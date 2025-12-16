import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { db, schemas, sources, sourcesPortfolioCaches, organizations, jobBoardCaches, jobs, jobCaches } from "@canadian-startup-jobs/db";
import { eq, and } from "drizzle-orm";
import Firecrawl from "@mendable/firecrawl-js";
import { join } from "node:path";
import { generateObject } from "ai";

const testVC = {
  url: "https://www.garage.vc",
  portfolio: "https://www.garage.vc/#portfolio"
};

const firecrawl = new Firecrawl({ apiKey: process.env.FIRE_CRAWL_API_KEY });

const getDoc = async (page: string) => {
  const doc = await firecrawl.scrape(page, { formats: ['markdown', 'links'] });
  return doc;
}

const getTestDocs = async () => {
  const home = await getDoc(testVC.url);
  const portfolio = await getDoc(testVC.portfolio);
  Bun.write(join("apps/server/src/scripts/out/1-add-vc/home.md"), home.markdown ?? "Failed to get markdown");
  Bun.write(join("apps/server/src/scripts/out/1-add-vc/home-links.md"), JSON.stringify(home.links ?? "Failed to get links"));
  Bun.write(join("apps/server/src/scripts/out/1-add-vc/portfolio.md"), portfolio.markdown ?? "Failed to get markdown");
  Bun.write(join("apps/server/src/scripts/out/1-add-vc/portfolio-links.md"), JSON.stringify(portfolio.links ?? "Failed to get links"));
  return { home, portfolio };
}


type NewSource = typeof sources.$inferInsert;
const insertSource = async (source: NewSource) => {
  return await db.insert(sources).values(source).returning();
};

type NewSourcePortfolioCache = typeof sourcesPortfolioCaches.$inferInsert;
const insertSourcePortfolioCache = async (sourcesPortfolioCache: NewSourcePortfolioCache) => {
  return await db.insert(sourcesPortfolioCaches).values(sourcesPortfolioCache).returning();
}

type NewOrganization = typeof organizations.$inferInsert;
const insertNewOrganization = async (organization: NewOrganization) => {
  return await db.insert(organizations).values(organization).returning();
};

const processStep1 = async (markdown: string) => {
  const { object } = await generateObject({
    model: google('gemini-2.5-pro'),
    schema: schemas.organizations.insert.omit({
      createdAt: true,
      updatedAt: true
    }),
    prompt: `Extract the required information from the following markdown to create a 'source' object. This markdown is from the homepage of a Venture Capital firm's website. Set the 'website' and 'portfolio' properties using the provided URLs. \n\nWebsite URL: ${testVC.url}\nPortfolio URL: ${testVC.portfolio}\n\nMarkdown content:\n---\n${markdown}`
  });

  const newSource = await insertSource({
    ...object,
    website: testVC.url,
    portfolio: testVC.portfolio,
  });

  console.log("✅ Step 1 complete: New source created.", newSource);
  return newSource;
};

// flows
// 1. home.markdown -> sources
// 2. sources.id + portfolio.markdown -> sourcesPortfolioCaches
// 3. portfolio.links -> firecrawl (home.md)
// 3.1 firecrawl (home.links) -> firecrawl (about)
// 3.2 firecrawl (home.links) -> firecrawl (careers)
// 3.3 home.md + about.md + careers.md -> organizations
// 3.4 organizations.id + careers.md -> jobBoardCaches
// 4. careers.links -> firecrawl (job.md)
// 4.1 job.md -> jobs

async function main() {
  const { home, portfolio } = await getTestDocs();
  if (!home.markdown) return null;
  await processStep1(home.markdown);
  console.log("Done :)");
}

main();
