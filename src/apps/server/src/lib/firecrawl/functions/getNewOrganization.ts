import { firecrawl, utils, config } from "@/lib/firecrawl";

export const getBasicOrg = async (url: string) => {
  return await firecrawl.scrape(url, { maxAge: config.CACHE_TIME_LIMITS_MS.ONE_DAY, formats: ["markdown", "links"] });
};

export const searchOrg = async (url: string, searchTerm: string) => {
  return await utils.searchSiteMap(url, searchTerm);
};
