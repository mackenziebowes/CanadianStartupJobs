import { firecrawl, config } from "@/lib/firecrawl";

const scrapeConfig = {
  maxAge: config.CACHE_TIME_LIMITS_MS.ONE_MONTH
};

export const getMarkdown = async (url: string) => {
  return await firecrawl.scrape(url, { formats: ['markdown'], maxAge: scrapeConfig.maxAge });
}

export const getSummary = async (url: string) => {
   return await firecrawl.scrape(url, { formats: ['summary'], maxAge: scrapeConfig.maxAge });
}

export const getLinks = async (url: string) => {
  return await firecrawl.scrape(url, { formats: ["links"], maxAge: scrapeConfig.maxAge });
}

export const getMdAndLinks = async (url: string) => {
  return await firecrawl.scrape(url, { formats: ["markdown", "links"], maxAge: scrapeConfig.maxAge });
}
