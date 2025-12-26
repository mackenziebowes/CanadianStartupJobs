// Schema
// ## jobs (`jobs`)

// | Column | Type | Required | Default |
// | :--- | :--- | :--- | :--- |
// | `id` | `number` | Yes | - |
// | `title` | `string` | Yes | - |
// | `city` | `string` | Yes | - |
// | `province` | `string` | Yes | - |
// | `remote_ok` | `boolean` | Yes | - |
// | `salary_min` | `number` | No | - |
// | `salary_max` | `number` | No | - |
// | `description` | `string` | Yes | - |
// | `company` | `string` | Yes | - |
// | `job_board_url` | `string` | No | - |
// | `posting_url` | `string` | No | - |
// | `is_at_a_startup` | `boolean` | No | - |
// | `last_scraped_markdown` | `string` | No | - |
// | `created_at` | `date` | Yes | `[object Object]` |
// | `updated_at` | `date` | Yes | `[object Object]` |

import { eq, asc, desc, inArray } from "drizzle-orm";
import { db, jobs, organizations, provinces, jobTypes, experienceLevels, industries, roles } from "@canadian-startup-jobs/db";
import { z } from "zod";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { orgPivots } from "@/db/functions/pivots/orgs";
import { jobPivots } from "@/db/functions/pivots/jobs";

const jobCreateSchema = z.object({
  title: z.string(),
  city: z.string(),
  province: z.string(),
  remote_ok: z.boolean().default(false),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  description: z.string(),
  company: z.string(),
  job_board_url: z.string().optional(),
  posting_url: z.string().optional(),
  is_at_a_startup: z.boolean().optional(),
  last_scraped_markdown: z.string().optional(),
});

type jobCreate = z.infer<typeof jobCreateSchema>;

type jobsInsert = typeof jobs.$inferInsert;
type jobsSelect = typeof jobs.$inferSelect;

type organizationsSelect = typeof organizations.$inferSelect;

type JobWithRichData = jobsSelect & {
  organization: organizationsSelect | null;
  tags: {
    provinces: typeof provinces.$inferSelect[];
    experienceLevels: typeof experienceLevels.$inferSelect[];
    industries: typeof industries.$inferSelect[];
    jobTypes: typeof jobTypes.$inferSelect[];
    roles: typeof roles.$inferSelect[];
  };
};

const config_jobs = {
  pagination: {
    skip: 10,
    take: 10,
    order: "desc",
  },
};

const orderAsc = asc(jobs.id);
const orderDesc = desc(jobs.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_jobs.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};

// ==========
// Basic CRUD
// ==========

const create_jobs = async (jobCreateArgs: jobCreate) => {
  const insert: jobsInsert = {
    title: jobCreateArgs.title,
    city: jobCreateArgs.city,
    province: jobCreateArgs.province,
    remoteOk: jobCreateArgs.remote_ok,
    salaryMin: jobCreateArgs.salary_min,
    salaryMax: jobCreateArgs.salary_max,
    description: jobCreateArgs.description,
    company: jobCreateArgs.company,
    jobBoardUrl: jobCreateArgs?.job_board_url,
    postingUrl: jobCreateArgs?.posting_url,
    isAtAStartup: jobCreateArgs?.is_at_a_startup,
  };
  const result = await db
    .insert(jobs)
    .values(insert)
    .returning({ id: jobs.id });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, "Failed to create new job", { jobCreateArgs });
  return result[0];
};

const getJobById = async (id: number): Promise<jobsSelect> => {
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  if (!result[0]) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, "Job not found", { id });
  return result[0];
};

const listJobs = async (skip: number = 0, take: number = 10): Promise<jobsSelect[]> => {
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(take).offset(skip);
};

const getJobWithRichData = async (id: number): Promise<JobWithRichData> => {
  const jobResult = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  if (!jobResult[0]) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, "Job not found", { id });
  const job = jobResult[0];

  // Get organization via pivot
  const orgJobPivots = await orgPivots.job.get_by_job(id);
  let organization: organizationsSelect | null = null;
  if (orgJobPivots.length > 0) {
    const orgResult = await db.select().from(organizations).where(eq(organizations.id, orgJobPivots[0].orgId)).limit(1);
    if (orgResult[0]) {
      organization = orgResult[0];
    }
  }

  // Get all pivot rows for tags
  const [industryPivots, experienceLevelPivots, jobTypePivots, provincePivots, rolePivots] = await Promise.all([
    jobPivots.industry.get_by_job(id),
    jobPivots.experienceLevel.get_by_job(id),
    jobPivots.jobType.get_by_job(id),
    jobPivots.provinces.get_by_job(id),
    jobPivots.roles.get_by_job(id),
  ]);

  // Get actual tag records
  const industriesData = await db
    .select()
    .from(industries)
    .where(inArray(industries.id, industryPivots.map((p) => p.industryId)));

  const experienceLevelsData = await db
    .select()
    .from(experienceLevels)
    .where(inArray(experienceLevels.id, experienceLevelPivots.map((p) => p.experienceLevelId)));

  const jobTypesData = await db
    .select()
    .from(jobTypes)
    .where(inArray(jobTypes.id, jobTypePivots.map((p) => p.jobTypeId)));

  const provincesData = await db
    .select()
    .from(provinces)
    .where(inArray(provinces.id, provincePivots.map((p) => p.provinceId)));

  const rolesData = await db
    .select()
    .from(roles)
    .where(inArray(roles.id, rolePivots.map((p) => p.roleId)));

  return {
    ...job,
    organization,
    tags: {
      provinces: provincesData,
      experienceLevels: experienceLevelsData,
      industries: industriesData,
      jobTypes: jobTypesData,
      roles: rolesData,
    },
  };
};

export { create_jobs, getJobById, getJobWithRichData, listJobs, jobCreateSchema };
