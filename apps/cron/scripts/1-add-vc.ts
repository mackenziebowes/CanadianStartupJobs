import { db, sources } from "@canadian-startup-jobs/db";
import { eq } from "drizzle-orm";
import Firecrawl from "@mendable/firecrawl-js";
import { openaiClient as openai } from "../src/ai/openaiClient";
import dotenv from "dotenv";

dotenv.config();

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRE_CRAWL_API_KEY!,
});

async function main() {
  const url = process.argv[2];
  const name = process.argv[3];

  if (!url || !name) {
    console.error("Usage: tsx scripts/1-add-vc.ts <url> <name>");
    process.exit(1);
  }

  console.log(`\n🔍 Processing VC: ${name} (${url})`);

  // 1. Check if exists or create
  let source = await db.query.sources.findFirst({
    where: eq(sources.website, url),
  });

  if (!source) {
    console.log("Creating new source...");
    const [inserted] = await db
      .insert(sources)
      .values({
        name,
        description: "VC Firm",
        website: url,
      })
      .returning();
    source = inserted;
  } else {
    console.log("Source already exists.");
  }

  if (source.portfolio) {
    console.log(`✅ Portfolio URL already known: ${source.portfolio}`);
    return;
  }

  // 2. Map the site to find Portfolio page
  console.log("🗺️  Mapping site to find portfolio page...");
  const mapResult = await firecrawl.map(url, {
    limit: 100,
  });

  if (!mapResult.links || mapResult.links.length === 0) {
    console.error("❌ Failed to map site:", mapResult);
    return;
  }

  // 3. Ask LLM to pick the portfolio link
  console.log(`🤖 Analyzing ${mapResult.links.length} links with LLM...`);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a web crawler helper. Identify the URL that most likely contains the list of portfolio companies / investments for this Venture Capital firm. Return ONLY the URL. If none found, return 'null'.",
      },
      {
        role: "user",
        content: `Base URL: ${url}\n\nLinks:\n${mapResult.links.map((l) => l.url).join("\n")}`,
      },
    ],
  });

  const portfolioUrl = completion.choices[0].message.content?.trim();

  if (portfolioUrl && portfolioUrl !== "null" && portfolioUrl !== "None") {
    console.log(`✨ Found Portfolio URL: ${portfolioUrl}`);

    await db
      .update(sources)
      .set({ portfolio: portfolioUrl })
      .where(eq(sources.id, source.id) as any);

    console.log("💾 Saved to database.");
  } else {
    console.log("⚠️  Could not identify a portfolio page automatically.");
  }
}

main().catch(console.error);
