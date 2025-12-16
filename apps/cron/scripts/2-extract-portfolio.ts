import { db, sources, portfolioCaches, sourcesPortfolioCaches } from "@canadian-startup-jobs/db";
import { eq, and } from "drizzle-orm";
import dotenv from "dotenv";
import crypto from "crypto";
import { scrapeAndExtract } from "@/lib/customScrapeAndExtract";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

dotenv.config();

async function getSourceById(id: number) {
  const rows = await db.select().from(sources).where(eq(sources.id, id));
  return rows[0] || null;
}

async function getSourceByPortfolioUrl(url: string) {
  const rows = await db.select().from(sources).where(eq(sources.portfolio, url));
  return rows[0] || null;
}

async function getOrCreatePortfolioCache(url: string, lastHash: string | null) {
  const existing = await db
    .select()
    .from(portfolioCaches)
    .where(eq(portfolioCaches.url, url));

  if (existing[0]) {
    const row = existing[0];
    if (lastHash && row.lastHash !== lastHash) {
      await db
        .update(portfolioCaches)
        .set({ lastHash })
        .where(eq(portfolioCaches.id, row.id));
    }
    return row;
  }

  const inserted = await db
    .insert(portfolioCaches)
    .values({ url, lastHash: lastHash || null })
    .returning();
  return inserted[0];
}

async function linkSourceToCache(sourceId: number, cacheId: number) {
  const existing = await db
    .select()
    .from(sourcesPortfolioCaches)
    .where(
      and(
        eq(sourcesPortfolioCaches.sourceId, sourceId),
        eq(sourcesPortfolioCaches.portfolioCacheId, cacheId),
      ),
    );
  if (existing[0]) return;
  await db
    .insert(sourcesPortfolioCaches)
    .values({ sourceId, portfolioCacheId: cacheId });
}

async function saveResultsFile(key: string, data: unknown) {
  const dir = join(process.cwd(), "scripts", "tmp");
  await mkdir(dir, { recursive: true });
  const file = join(dir, `portfolio-${key}.json`);
  await writeFile(file, JSON.stringify(data, null, 2), "utf8");
  return file;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: tsx scripts/2-extract-portfolio.ts <portfolioUrl|sourceId>");
    process.exit(1);
  }

  let portfolioUrl: string | null = null;
  let sourceId: number | null = null;

  if (/^https?:\/\//i.test(arg)) {
    portfolioUrl = arg;
    const src = await getSourceByPortfolioUrl(portfolioUrl);
    sourceId = src ? src.id : null;
  } else {
    const id = Number(arg);
    if (!Number.isFinite(id)) {
      console.error("Second argument must be a URL or numeric sourceId");
      process.exit(1);
    }
    const src = await getSourceById(id);
    if (!src) {
      console.error(`Source not found: ${id}`);
      process.exit(1);
    }
    sourceId = src.id;
    if (!src.portfolio) {
      console.error("Source has no portfolio URL. Run step 1 first.");
      process.exit(1);
    }
    portfolioUrl = src.portfolio;
  }

  if (!portfolioUrl) {
    console.error("Could not determine portfolio URL");
    process.exit(1);
  }

  console.log(`Scraping portfolio: ${portfolioUrl}`);
  const extracted = await scrapeAndExtract({ url: portfolioUrl });

  const hash = crypto
    .createHash("md5")
    .update(JSON.stringify(extracted))
    .digest("hex");

  const cacheRow = await getOrCreatePortfolioCache(portfolioUrl, hash);
  if (sourceId != null) {
    await linkSourceToCache(sourceId, cacheRow.id);
  }

  const key = sourceId != null ? `source-${sourceId}` : hash.slice(0, 8);
  const out = await saveResultsFile(key, extracted);
  console.log(`Saved extracted companies to ${out}`);
  console.log(
    JSON.stringify(
      {
        portfolioUrl,
        sourceId,
        cacheId: cacheRow.id,
        companies: extracted.companies.length,
        directories: extracted.companyDirectories.length,
        jobBoards: extracted.jobBoards.length,
        resultFile: out,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
