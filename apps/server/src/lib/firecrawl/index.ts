import { firecrawl } from "./client";
import { searchSiteMap, mapSite } from "./functions/utils/map";
import { getLinks, getSummary, getMarkdown, getMdAndLinks } from "./functions/utils/scrape";
import { getBasicOrg, searchOrg } from "./functions/getNewOrganization";

import { CACHE_TIME_LIMITS_MS } from "./config";

const utils = {
  searchSiteMap,
  mapSite,
  getLinks,
  getSummary,
  getMarkdown,
  getMdAndLinks
};

const org = {
  getBasicOrg,
  searchOrg
};

const config = {
  CACHE_TIME_LIMITS_MS
}
export { firecrawl, utils, config, org };
