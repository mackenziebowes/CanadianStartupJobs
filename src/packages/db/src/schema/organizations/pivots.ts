import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { jobs } from "../jobs/index";
import { organizations, jobBoardCaches } from "./index";
import { provinces, industries, teamSize, raisingStage } from "../tags/index";

const orgsProvinces = pgTable(
  "orgs_provinces",
  {
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id),
    provinceId: integer("province_id")
      .notNull()
      .references(() => provinces.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.orgId, t.provinceId] }),
    },
  ],
);

const orgsIndustries = pgTable(
  "orgs_industries",
  {
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id),
    industryId: integer("industry_id")
      .notNull()
      .references(() => industries.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.orgId, t.industryId] }),
    },
  ],
);

const orgsSizes = pgTable(
  "orgs_sizes",
  {
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id),
    teamSizeId: integer("team_size_id")
      .notNull()
      .references(() => teamSize.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.orgId, t.teamSizeId] }),
    },
  ],
);

const orgsStages = pgTable(
  "orgs_stages",
  {
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id),
    raisingStageId: integer("raising_stage_id")
      .notNull()
      .references(() => raisingStage.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.orgId, t.raisingStageId] }),
    },
  ],
);

const orgsJobs = pgTable(
  "orgs_jobs",
  {
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.orgId, t.jobId] }),
    },
  ],
);

const orgsJobBoardCaches = pgTable(
  "orgs_job_board_caches",
  {
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id),
    jobBoardCacheId: integer("job_board_cache_id")
      .notNull()
      .references(() => jobBoardCaches.id),
  },
  (t) => [
    {
      pk: primaryKey({ columns: [t.orgId, t.jobBoardCacheId] }),
    },
  ],
);

export {
  orgsProvinces,
  orgsIndustries,
  orgsSizes,
  orgsStages,
  orgsJobs,
  orgsJobBoardCaches,
};
