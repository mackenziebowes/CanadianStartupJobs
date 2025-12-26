import { create_jobs, getJobWithRichData, listJobs, jobCreateSchema } from "@/db/functions/jobs/jobs";
import { Hono } from "hono";
import { idSchema } from "@/routes/types/types";
const app = new Hono();

app.get("/", async (c) => {
  const jobs = await listJobs(0, 10);
  return c.json(jobs);
});

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

app.get("/:id", async (c) => {
  const parsed = idSchema.safeParse({ id: c.req.param("id") });

  if (!parsed.success) {
    return c.json({ error: "Invalid job ID", issues: parsed.error.issues }, 400);
  }

  try {
    const job = await getJobWithRichData(parsed.data.id);
    return c.json(job);
  } catch (err) {
    return c.json({ error: "Job not found" }, 404);
  }
});

export default app;
