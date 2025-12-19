import { firecrawl, config } from "@/lib/firecrawl";



export const getMarkdown = async (url: string) => {
  return await firecrawl.scrape(url, { formats: ['markdown'], maxAge:config.CACHE_TIME_LIMITS_MS.ONE_MONTH });
}

export const getSummary = async (url: string) => {
   return await firecrawl.scrape(url, { formats: ['summary'], maxAge: config.CACHE_TIME_LIMITS_MS.ONE_MONTH });
}

export const getLinks = async (url: string) => {
  return await firecrawl.scrape(url, { formats: ["links"], maxAge: config.CACHE_TIME_LIMITS_MS.ONE_MONTH });
}

export const getMdAndLinks = async (url: string) => {
  return await firecrawl.scrape(url, { formats: ["markdown", "links"], maxAge: config.CACHE_TIME_LIMITS_MS.ONE_MONTH });
}
