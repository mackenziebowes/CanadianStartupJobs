import { Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { db, jobs, jobBoardCaches } from "@canadian-startup-jobs/db";
import { scrapeJobsFromJobBoards } from "@/scrape-helpers/scrapeJobsFromJobBoards";
import { redisConnection } from "@/lib/queues";
import { WORKER_CONCURRENCY, RATE_LIMITER } from "@/data/constants";
import crypto from "crypto";

// Type for scraped job data
type ScrapedJob = {
  title: string;
  location: string;
  remoteOk?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  company: string;
  jobBoardUrl?: string;
  postingUrl?: string;
  isAtAStartup?: boolean;
};

// Helper to parse location string into city/province
function parseLocation(location: string): { city: string; province: string } {
  if (!location) return { city: "Unknown", province: "Unknown" };
  
  const parts = location.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    // Assuming "City, Province" format
    return { city: parts[0], province: parts[1] };
  } else {
    return { city: location, province: "Unknown" };
  }
}

export const jobBoardWorker = new Worker(
  "job-boards",
  async (job) => {
    try {
      const url = job.data.url;

      // 1. Freshness Gate (Time-based)
      let cacheRecord = null;
      try {
        const results = await db.select().from(jobBoardCaches).where(eq(jobBoardCaches.url, url)).limit(1);
        if (results.length > 0) cacheRecord = results[0];
      } catch (e) {
        // Table might not exist or schema mismatch, proceed safely
      }

      if (cacheRecord?.freshTil && new Date(cacheRecord.freshTil) > new Date()) {
        console.log(`Skipping ${url} - Fresh until ${cacheRecord.freshTil}`);
        return { success: true, skipped: true, reason: "fresh_til" };
      }

      // 2. Hash Gate (Content-based)
      let shouldScrape = true;
      let newHash = "";
      let htmlContent = "";

      try {
        const response = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; CanadianStartupJobs/1.0;)" }
        });
        
        if (response.ok) {
          htmlContent = await response.text();
          newHash = crypto.createHash("md5").update(htmlContent).digest("hex");

          if (cacheRecord?.lastHash === newHash) {
            shouldScrape = false;
            // Update freshTil only
            await db.update(jobBoardCaches)
              .set({ 
                freshTil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                lastCheckedAt: new Date()
              })
              .where(eq(jobBoardCaches.url, url));
              
            return { success: true, skipped: true, reason: "hash_match" };
          }
        }
      } catch (err) {
        console.warn(`Lightweight fetch failed for ${url}, falling back to Firecrawl.`);
      }

      // 3. Full Scrape (Firecrawl)
      const { jobs: scrapedJobs, markdown } = await scrapeJobsFromJobBoards(url);
      const jobsTyped = scrapedJobs as ScrapedJob[];

      if (jobsTyped.length === 0) {
        return { success: true, url, jobsInserted: 0 };
      }

      // Transform scraped jobs to match database schema
      const jobsToUpsert = jobsTyped.map((jobData) => {
        const { city, province } = parseLocation(jobData.location);
        return {
          title: jobData.title,
          city: city,
          province: province,
          remoteOk: jobData.remoteOk ?? false,
          salaryMin: jobData.salaryMin ?? null,
          salaryMax: jobData.salaryMax ?? null,
          description: jobData.description,
          company: jobData.company,
          jobBoardUrl: jobData.jobBoardUrl ?? url,
          postingUrl: jobData.postingUrl ?? null,
          isAtAStartup: jobData.isAtAStartup ?? null,
          lastScrapedMarkdown: null, // Scraper doesn't give per-job markdown yet, firecrawl usually returns page markdown
        };
      });

      // Bulk upsert logic...
      const jobsWithUrl = jobsToUpsert.filter((j) => j.postingUrl);
      const jobsWithoutUrl = jobsToUpsert.filter((j) => !j.postingUrl);

      let insertedCount = 0;
      let updatedCount = 0;

      if (jobsWithUrl.length > 0) {
        const existingUrls = new Set<string>();

        for (const jobData of jobsWithUrl) {
          if (!jobData.postingUrl) continue;
          try {
            const existing = await db.select({ postingUrl: jobs.postingUrl })
              .from(jobs)
              .where(eq(jobs.postingUrl, jobData.postingUrl))
              .limit(1);

            if (existing.length > 0 && existing[0].postingUrl) {
              existingUrls.add(existing[0].postingUrl);
            }
          } catch (error) { }
        }

        const toInsert = jobsWithUrl.filter((j) => j.postingUrl && !existingUrls.has(j.postingUrl));
        const toUpdate = jobsWithUrl.filter((j) => j.postingUrl && existingUrls.has(j.postingUrl));

        if (toInsert.length > 0) {
          await db.insert(jobs).values(toInsert);
          insertedCount += toInsert.length;
        }

        for (const jobData of toUpdate) {
          if (!jobData.postingUrl) continue;
          try {
            await db.update(jobs)
              .set({ ...jobData, updatedAt: new Date() })
              .where(eq(jobs.postingUrl, jobData.postingUrl));
            updatedCount++;
          } catch (error) { }
        }
      }

      if (jobsWithoutUrl.length > 0) {
        await db.insert(jobs).values(jobsWithoutUrl);
        insertedCount += jobsWithoutUrl.length;
      }

      // 4. Update Job Board Cache State
      try {
        const valuesToSet = {
          url: url,
          lastScrapedAt: new Date(),
          freshTil: new Date(Date.now() + 24 * 60 * 60 * 1000),
          lastHash: newHash || undefined, // Only set if we have it
          // Note: jobBoardCaches doesn't have lastScrapedMarkdown in schema view I saw earlier?
          // Let me double check schema view.
          // organizations/index.ts: lastHash, freshTil, lastScrapedAt, lastCheckedAt. NO lastScrapedMarkdown.
          // jobs/index.ts: jobs table HAS lastScrapedMarkdown.
          // Correct, I will omit lastScrapedMarkdown for jobBoardCaches.
        };

        // If newHash is empty (fetch failed), we don't update lastHash, or we keep old one?
        // Drizzle undefined values in .values() might be ignored or set to null?
        // Let's be explicit.
        
        await db.insert(jobBoardCaches).values(valuesToSet)
          .onConflictDoUpdate({ 
            target: jobBoardCaches.url, 
            set: valuesToSet
          });
          
      } catch (e) {
        console.error("Failed to update job board cache:", e);
      }

      return {
        success: true,
        url: job.data.url,
        jobsInserted: insertedCount,
        jobsUpdated: updatedCount,
        totalJobs: jobsTyped.length,
      };
    } catch (error) {
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: WORKER_CONCURRENCY.JOB_BOARD,
    limiter: RATE_LIMITER.FIRECRAWL,
  },
);
