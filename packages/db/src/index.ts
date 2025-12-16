import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
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
} from "./schema/index";

// Get database connection string from environment variables
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER || "postgres"}:${process.env.POSTGRES_PASSWORD || "postgres"}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT || "5433"}/${process.env.POSTGRES_DB || "canadian_startup_db"}`;

// Create postgres client
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client, {
  schema: {
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
  },
});

// Export schema for use in other services
export * from "./schema/index";
export {
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

// Export types
export type Database = typeof db;
