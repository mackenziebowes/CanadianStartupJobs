import { google } from '@ai-sdk/google';
import { db, schemas, organizations, } from "@canadian-startup-jobs/db";
import { generateObject, generateText, stepCountIs, tool } from "ai";
import { prompts } from '@/lib/ai/prompts';
import { AppError, ERROR_CODES } from "@/lib/errors";
import { org } from '@/lib/firecrawl';
import z from "zod";
import { MapData } from '@mendable/firecrawl-js';

/**
* 2 pass dev:
* pass 1 => Organizations *only*
* pass 2 => Organizations + tags
*/

type NewOrganization = typeof organizations.$inferInsert;
const insertOrganization = async (source: NewOrganization) => {
  return await db.insert(organizations).values(source).returning();
};

const readPageResult = (url: string, markdown: string, links: string[]) => {
  return `
## Read Page Results for ${url}
### Markdown View
\`\`\`md
${markdown}
\`\`\`
### All Links
\`\`\`md
${links.map((link => `- ${link},`)).join("\n")}
\`\`\`
`;
};

const searchSiteResult = (url: string, searchTerm: string, results: MapData) => {
  return `
## Search Site Results for "${searchTerm}" in ${url}:

### Results
${results.links.map((link) => {
  return `
- **URL:** ${link.url}
- **Category:** ${link?.category ?? "Not Found"}
- **Title:** ${link?.title ?? "Not Found"}
- **Description:** ${link?.description ?? "Not Found"}
`;
}).join("\n-----\n")}
`;
}

const tools = {
  readPage: tool({
    description: "Get a clean markdown view of a URL",
    inputSchema: z.string().describe("The complete url to view"),
    execute: async (url: string) => {
      const results = await org.getBasicOrg(url);
      if (!results.markdown || !results.links) return "Error with site reading tool.";
      return readPageResult(url, results.markdown, results.links);
    }
  }),
  searchSite: tool({
    description: "Search a sitemap for a term",
    inputSchema: z.object({
      url: z.string().describe("The complete url of a page in the website to search"),
      searchTerm: z.string().describe("The term to search for across the site map"),
    }),
    execute: async ({url, searchTerm}) => {
      const results = await org.searchOrg(url, searchTerm);
      if (!results.links) return "Error with site searching tool.";
      return searchSiteResult(url, searchTerm, results);
    }
  })
}

export const createNewOrganizationFromURL = async (url: string) => {
  const { markdown, links } = await org.getBasicOrg(url);
  if (!markdown) throw new AppError(ERROR_CODES.FC_MARKDOWN_FAILED, `Failed to get markdown for ${url}`);
  if (!links) throw new AppError(ERROR_CODES.FC_LINKS_FAILED, `Failed to get links for ${url}`);
  const primaryData = await generateText({
    model: google('gemini-2.5-pro'),
    prompt: prompts.discoverNewOrganization(markdown, links, url),
    tools,
  })
  const objectData = await generateObject({
    model: google('gemini-2.5-pro'),
    schema: schemas.organizations.insert.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    }),
    prompt: prompts.getNewOrganization(primaryData.text, url),
  });
  if (!objectData.object) throw new AppError(ERROR_CODES.AI_OBJECT_CREATION_FAILED, "Failed to extract organization object", {...objectData});
  const uploadValues = schemas.organizations.insert.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).safeParse(objectData.object);
  if (uploadValues.error) throw new AppError(ERROR_CODES.SCHEMA_PARSE_FAILED, "Failed to parse extracted organization object", { ...uploadValues.error });

  const newOrganization = await insertOrganization({
    ...(uploadValues.data),
    website: url,
  });
  if (!newOrganization[0]) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, "Failed to insert extracted organization to db");
  console.log("✅ New Organization created.");
  return newOrganization[0];
};
