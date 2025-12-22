/*
## jobs (`jobs`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `title` | `string` | Yes | - |
| `city` | `string` | Yes | - |
| `province` | `string` | Yes | - |
| `remote_ok` | `boolean` | Yes | - |
| `salary_min` | `number` | No | - |
| `salary_max` | `number` | No | - |
| `description` | `string` | Yes | - |
| `company` | `string` | Yes | - |
| `job_board_url` | `string` | No | - |
| `posting_url` | `string` | No | - |
| `is_at_a_startup` | `boolean` | No | - |
| `last_scraped_markdown` | `string` | No | - |
| `created_at` | `date` | Yes | `[object Object]` |
| `updated_at` | `date` | Yes | `[object Object]` |
*/
import z from "zod";

const createJobDataSchema = z.object({
  title: z.string(),
  city: z.string(),
  province: z.string(),
  remote_ok: z.string(),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  salary_hidden: z.boolean(),
  description: z.string(),
  company: z.string(),
  job_board_url: z.string(),
  posting_url: z.string(),
  is_at_a_startup: z.string(),
});

type CreateJobData = z.infer<typeof createJobDataSchema>;

const createJobDataInstances = new Map<number, CreateJobData>();

// Minimum Viable createJobDataInstance
const createNewCDJISchema = z.object({
  title: z.string().describe("The title of the job, pulled from the Careers Page"),
  company: z.string().describe("Can pull this from the Organization in the previous step."),
  job_board_url: z.string().describe("The Careers Page or whatever where this job was found originally."),
  posting_url: z.string().describe("The original posting for this job, found as a child of the job_board_url.")
});

type CreateNewCDJI = z.infer<typeof createNewCDJISchema>;

const createNewCJDI = (args: CreateNewCDJI) => {

}
