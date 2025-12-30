import { getNewSource } from "./getNewSource";
import { getNewOrganization, discoverNewOrganization } from "./getNewOrganization";
import { getOrganizationTags } from "./getOrganizationTags";
import { getJobTags } from "./getJobTags";
import { discoverNewJob } from "./discoverNewJob";

export const prompts = {
  getNewSource,
  getNewOrganization,
  discoverNewOrganization,
  getOrganizationTags,
  getJobTags,
  discoverNewJob,
};
