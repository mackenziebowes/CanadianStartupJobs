import { Hono } from "hono";
import { getSourceById } from "@/lib/db/functions/sources";
import { idSchema } from "@/routes/types/types";

const app = new Hono();


app.get("/:id", async (c) => {
  const parsed = idSchema.safeParse({ id: c.req.param("id") });

  if (!parsed.success) {
    return c.json({ error: "Invalid source ID", issues: parsed.error.issues }, 400);
  }

  try {
    const source = await getSourceById(parsed.data.id);
    return c.json(source);
  } catch (err) {
    return c.json({ error: "Source not found" }, 404);
  }
});

export default app;
