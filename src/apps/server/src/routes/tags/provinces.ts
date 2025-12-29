import {
  create_provinces,
  update_provinces,
  delete_provinces,
  get_provinces,
} from "@/lib/db/functions/tags/provinces";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const { skip, take, order } = c.req.query();

  const skipInt = skip ? parseInt(skip) : undefined;
  const takeInt = take ? parseInt(take) : undefined;
  const orderType = order === "asc" || order === "desc" ? order : undefined;

  const default_provinces = await get_provinces(
    skipInt,
    takeInt,
    orderType,
  );
  return c.json(default_provinces);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const success = await create_provinces(body);
  if (!success) {
    return c.json({ error: "Failed to create provinces" }, 500);
  }
  return c.json({ success: true }, 201);
});

app.delete("/", async (c) => {
  const body = await c.req.json();
  const success = await delete_provinces(body);
  if (!success) {
    return c.json({ error: "Failed to delete provinces" }, 500);
  }
  return c.json({ success: true });
});

app.put("/", async (c) => {
  const body = await c.req.json();
  const { select, insert } = body;
  const success = await update_provinces(select, insert);
  if (!success) {
    return c.json({ error: "Failed to update provinces" }, 500);
  }
  return c.json({ success: true });
});

export default app;
