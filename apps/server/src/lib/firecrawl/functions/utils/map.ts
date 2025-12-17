import { firecrawl } from "@/lib/firecrawl";

export const mapSite = async (url: string) => {
  return await firecrawl.map(url, { limit: 50, sitemap: 'include' });
};

export const searchSiteMap = async (url: string, searchTerm: string) => {
  return await firecrawl.map(url, { limit: 50, sitemap: 'include', search: searchTerm });
};
