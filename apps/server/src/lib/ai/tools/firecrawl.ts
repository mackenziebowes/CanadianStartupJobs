import type { MapData } from "@mendable/firecrawl-js";
import { tool } from "ai";
import z from "zod";
import { utils } from "@/lib/firecrawl";

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
export const readPage = tool({
  description: "Get a clean markdown view of a URL",
  inputSchema: z.string().describe("The complete url to view"),
  execute: async (url: string) => {
    const results = await utils.getMdAndLinks(url);
    if (!results.markdown || !results.links) return "Error with site reading tool.";
    return readPageResult(url, results.markdown, results.links);
  }
});

export const searchSite = tool({
  description: "Search a sitemap for a term",
  inputSchema: z.object({
    url: z.string().describe("The complete url of a page in the website to search"),
    searchTerm: z.string().describe("The term to search for across the site map"),
  }),
  execute: async ({ url, searchTerm }) => {
    const results = await utils.searchSiteMap(url, searchTerm);
    if (!results.links) return "Error with site searching tool.";
    return searchSiteResult(url, searchTerm, results);
  }
});
