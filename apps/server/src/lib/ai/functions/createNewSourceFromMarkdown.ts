import { google } from '@ai-sdk/google';
import { db, schemas, sources,  } from "@canadian-startup-jobs/db";
import { generateObject } from "ai";
import { prompts } from '@/lib/ai/prompts';

type NewSource = typeof sources.$inferInsert;
const insertSource = async (source: NewSource) => {
  return await db.insert(sources).values(source).returning();
};

export const createNewSourceFromMarkdown = async (markdown: string, url: string, portfolio: string) => {
  const { object } = await generateObject({
    model: google('gemini-1.5-pro-latest'),
    schema: schemas.sources.insert.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    }),
    prompt: prompts.getNewSource(markdown, url, portfolio)
  });

  const newSource = await insertSource({
    ...(object as NewSource),
    website: url,
    portfolio: portfolio,
  });

  console.log("✅ New source created.", newSource);
  return newSource;
};
