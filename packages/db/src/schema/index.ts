// Export all schema definitions from this file
// Add your table schemas here or import them from separate files
import {
  organizations,
  jobBoardCaches,
  orgsSizes,
  orgsStages,
  orgsProvinces,
  orgsIndustries,
  orgsJobs,
} from "./organizations/index";
import {
  jobs,
  jobCaches,
  jobsRoles,
  jobsJobTypes,
  jobsProvinces,
  jobsIndustries,
  jobsExperienceLevels,
  jobsJobsCaches,
} from "./jobs/index";
import {
  provinces,
  jobTypes,
  experienceLevels,
  industries,
  roles,
  teamSize,
  raisingStage,
} from "./tags/index";
import {
  sources,
  portfolioCaches,
  sourcesPortfolioCaches,
} from "./sources/index";
import { createSchemaFactory } from "drizzle-zod";
const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  coerce: {
    date: true
  }
});
const schemas = {
  organizations: {
    select: createSelectSchema(organizations),
    insert: createInsertSchema(organizations),
    update: createUpdateSchema(organizations),
  }
};

export {
  schemas,
  organizations,
  jobBoardCaches,
  orgsSizes,
  orgsStages,
  orgsProvinces,
  orgsIndustries,
  orgsJobs,
  jobs,
  jobCaches,
  jobsRoles,
  jobsJobTypes,
  jobsProvinces,
  jobsIndustries,
  jobsExperienceLevels,
  jobsJobsCaches,
  provinces,
  jobTypes,
  experienceLevels,
  industries,
  roles,
  teamSize,
  raisingStage,
  sources,
  portfolioCaches,
  sourcesPortfolioCaches,
};
