import { Hono } from "hono";
import { getOrganizationById } from "@/lib/db/functions/organizations";
import { idSchema } from "@/routes/types/types";

const app = new Hono();

app.get("/:id", async (c) => {
  const parsed = idSchema.safeParse({ id: c.req.param("id") });

  if (!parsed.success) {
    return c.json({ error: "Invalid organization ID", issues: parsed.error.issues }, 400);
  }

  try {
    const organization = await getOrganizationById(parsed.data.id);
    return c.json(organization);
  } catch (err) {
    return c.json({ error: "Organization not found" }, 404);
  }
});

export default app;
