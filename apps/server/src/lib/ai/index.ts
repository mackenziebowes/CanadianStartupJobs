import { createNewSourceFromMarkdown } from "./functions/createNewSourceFromMarkdown";
import { createNewPortfolioCache, connectSourceToPortfolioCache } from "./functions/createNewPortfolioCache";
import { createNewOrganizationFromURL } from "./functions/createNewOrganizationFromURL";
import { createNewJobFromURL } from "./functions/createNewJobFromURL";
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

const jobs = {
  createNewJobFromURL
};

export { sources, organizations, jobs };
