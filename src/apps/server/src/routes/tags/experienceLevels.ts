import {
  create_experienceLevels,
  update_experienceLevels,
  delete_experienceLevels,
  get_experienceLevels,
} from "@/lib/db/functions/tags/experienceLevels";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const { skip, take, order } = c.req.query();

  const skipInt = skip ? parseInt(skip) : undefined;
  const takeInt = take ? parseInt(take) : undefined;
  const orderType = order === "asc" || order === "desc" ? order : undefined;

  const default_experienceLevels = await get_experienceLevels(
    skipInt,
    takeInt,
    orderType,
  );
  return c.json(default_experienceLevels);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const success = await create_experienceLevels(body);
  if (!success) {
    return c.json({ error: "Failed to create experience level" }, 500);
  }
  return c.json({ success: true }, 201);
});

app.delete("/", async (c) => {
  const body = await c.req.json();
  const success = await delete_experienceLevels(body);
  if (!success) {
    return c.json({ error: "Failed to delete experience level" }, 500);
  }
  return c.json({ success: true });
});

app.put("/", async (c) => {
  const body = await c.req.json();
  const { select, insert } = body;
  const success = await update_experienceLevels(select, insert);
  if (!success) {
    return c.json({ error: "Failed to update experience level" }, 500);
  }
  return c.json({ success: true });
});

export default app;
