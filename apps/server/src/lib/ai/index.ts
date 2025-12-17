import { createNewSourceFromMarkdown } from "./functions/createNewSourceFromMarkdown";
import { createNewPortfolioCache, connectSourceToPortfolioCache } from "./functions/createNewPortfolioCache";
import { createNewOrganizationFromURL } from "./functions/createNewOrganizationFromURL";
import { createNewJobBoardCache, connectOrganizationToJobBoardCache } from "./functions/createNewJobBoardCache";

const sources = {
  createNewSourceFromMarkdown,
  createNewPortfolioCache,
  connectSourceToPortfolioCache
};

const organizations = {
  createNewOrganizationFromURL,
  createNewJobBoardCache,
  connectOrganizationToJobBoardCache
};

export { sources, organizations };
