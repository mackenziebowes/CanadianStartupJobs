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

import { create_jobs, jobCreateSchema } from "@/db/functions/jobs/jobs";
import { Hono } from "hono";

const app = new Hono();

// app.get("/", async (c) => {
//   const { skip, take, order } = c.req.query();

//   const skipInt = skip ? parseInt(skip) : undefined;
//   const takeInt = take ? parseInt(take) : undefined;
//   const orderType = order === "asc" || order === "desc" ? order : undefined;

//   const default_jobs = await get_jobs(
//     skipInt,
//     takeInt,
//     orderType,
//   );
//   return c.json({ default_jobs });
// });

app.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = jobCreateSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid input", issues: parsed.error.issues }, 400);
  }

  const success = await create_jobs(parsed.data);

  if (!success) {
    return c.json({ error: "Failed to create job" }, 500);
  }
  return c.json({ success: true }, 201);
});

// app.delete("/", async (c) => {
//   const body = await c.req.json();
//   const success = await delete_jobs(body);
//   if (!success) {
//     return c.json({ error: "Failed to delete experience level" }, 500);
//   }
//   return c.json({ success: true });
// });

// app.put("/", async (c) => {
//   const body = await c.req.json();
//   const { select, insert } = body;
//   const success = await update_jobs(select, insert);
//   if (!success) {
//     return c.json({ error: "Failed to update experience level" }, 500);
//   }
//   return c.json({ success: true });
// });

export default app;
