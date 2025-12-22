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

import { eq, asc, desc } from "drizzle-orm";
import { db, jobs } from "@canadian-startup-jobs/db";
import { z } from "zod";
import { AppError, ERROR_CODES } from "@/lib/errors";

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

export { create_jobs, jobCreateSchema };
