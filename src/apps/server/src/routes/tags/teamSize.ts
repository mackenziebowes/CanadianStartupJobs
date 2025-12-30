import {
  create_teamSize,
  update_teamSize,
  delete_teamSize,
  get_teamSize,
} from "@/lib/db/functions/tags/teamSize";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const { skip, take, order } = c.req.query();

  const skipInt = skip ? parseInt(skip) : undefined;
  const takeInt = take ? parseInt(take) : undefined;
  const orderType = order === "asc" || order === "desc" ? order : undefined;

  const default_teamSize = await get_teamSize(
    skipInt,
    takeInt,
    orderType,
  );
  return c.json({ default_teamSize });
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const success = await create_teamSize(body);
  if (!success) {
    return c.json({ error: "Failed to create teamSize" }, 500);
  }
  return c.json({ success: true }, 201);
});

app.delete("/", async (c) => {
  const body = await c.req.json();
  const success = await delete_teamSize(body);
  if (!success) {
    return c.json({ error: "Failed to delete teamSize" }, 500);
  }
  return c.json({ success: true });
});

app.put("/", async (c) => {
  const body = await c.req.json();
  const { select, insert } = body;
  const success = await update_teamSize(select, insert);
  if (!success) {
    return c.json({ error: "Failed to update teamSize" }, 500);
  }
  return c.json({ success: true });
});

export default app;
