import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { jobs, jobCaches } from "./index";
import {
  provinces,
  jobTypes,
  experienceLevels,
  industries,
  roles,
} from "../tags/index";

const jobsProvinces = pgTable(
  "jobs_provinces",
  {
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
    provinceId: integer("province_id")
      .notNull()
      .references(() => provinces.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.jobId, t.provinceId] }),
    },
  ],
);

const jobsJobTypes = pgTable(
  "jobs_job_types",
  {
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
    jobTypeId: integer("job_type_id")
      .notNull()
      .references(() => jobTypes.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.jobId, t.jobTypeId] }),
    },
  ],
);

const jobsExperienceLevels = pgTable(
  "jobs_experience_levels",
  {
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
    experienceLevelId: integer("experience_level_id")
      .notNull()
      .references(() => experienceLevels.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.jobId, t.experienceLevelId] }),
    },
  ],
);

const jobsIndustries = pgTable(
  "jobs_industries",
  {
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
    industryId: integer("industry_id")
      .notNull()
      .references(() => industries.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.jobId, t.industryId] }),
    },
  ],
);

const jobsRoles = pgTable(
  "jobs_roles",
  {
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.jobId, t.roleId] }),
    },
  ],
);

const jobsJobsCaches = pgTable(
  "jobs_job_caches",
  {
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
    jobCacheId: integer("job_cache_id")
      .notNull()
      .references(() => jobCaches.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.jobId, t.jobCacheId] }),
    },
  ],
);
export {
  jobsProvinces,
  jobsJobTypes,
  jobsExperienceLevels,
  jobsIndustries,
  jobsRoles,
  jobsJobsCaches,
};
