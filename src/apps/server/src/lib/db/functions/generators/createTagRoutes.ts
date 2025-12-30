const createImportStatement = (tableName: string) => {
  return `import {
  create_${tableName},
  update_${tableName},
  delete_${tableName},
  get_${tableName},
} from "@/lib/db/functions/tags/${tableName}";
import { Hono } from "hono";

const app = new Hono();`;
};

const createGetRoute = (tableName: string) => {
  return `
app.get("/", async (c) => {
  const { skip, take, order } = c.req.query();

  const skipInt = skip ? parseInt(skip) : undefined;
  const takeInt = take ? parseInt(take) : undefined;
  const orderType = order === "asc" || order === "desc" ? order : undefined;

  const default_${tableName} = await get_${tableName}(
    skipInt,
    takeInt,
    orderType,
  );
  return c.json({ default_${tableName} });
});`;
};

const createPostRoute = (tableName: string) => {
  return `
app.post("/", async (c) => {
  const body = await c.req.json();
  const success = await create_${tableName}(body);
  if (!success) {
    return c.json({ error: "Failed to create ${tableName}" }, 500);
  }
  return c.json({ success: true }, 201);
});`;
};

const createDeleteRoute = (tableName: string) => {
  return `
app.delete("/", async (c) => {
  const body = await c.req.json();
  const success = await delete_${tableName}(body);
  if (!success) {
    return c.json({ error: "Failed to delete ${tableName}" }, 500);
  }
  return c.json({ success: true });
});`;
};

const createUpdateRoute = (tableName: string) => {
  return `
app.put("/", async (c) => {
  const body = await c.req.json();
  const { select, insert } = body;
  const success = await update_${tableName}(select, insert);
  if (!success) {
    return c.json({ error: "Failed to update ${tableName}" }, 500);
  }
  return c.json({ success: true });
});`;
};

const createDefaultExport = () => {
  return `
export default app;`;
};

export const createTagRoutes = (tableName: string): string => {
  let finalString = "";
  finalString += createImportStatement(tableName) + "\n";
  finalString += createGetRoute(tableName) + "\n";
  finalString += createPostRoute(tableName) + "\n";
  finalString += createDeleteRoute(tableName) + "\n";
  finalString += createUpdateRoute(tableName) + "\n";
  finalString += createDefaultExport() + "\n";
  return finalString;
};
