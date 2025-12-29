const GLOBAL_CONFIG = {
  pagination: {
    skip: 10,
    take: 10,
    order: "desc",
  },
};

const createImportStatement = (tableName: string) => {
  return `
import { eq, asc, desc } from "drizzle-orm";
import { db, ${tableName} } from "@canadian-startup-jobs/db";`;
};

const createTypeDeclarations = (tableName: string) => {
  return `
type ${tableName}Insert = typeof ${tableName}.$inferInsert;
type ${tableName}Select = typeof ${tableName}.$inferSelect;`;
};

const createConfig = (tableName: string) => {
  return `
const config_${tableName} = {
  pagination: {
    skip: ${GLOBAL_CONFIG.pagination.skip},
    take: ${GLOBAL_CONFIG.pagination.take},
    order: ${GLOBAL_CONFIG.pagination.order},
  },
};
`;
};

const createOrdering = (tableName: string) => {
  return `
const orderAsc = asc(${tableName}.id);
const orderDesc = desc(${tableName}.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_${tableName}.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};
`;
};

const createInsertFunction = (tableName: string) => {
  return `
// ==========
// Basic CRUD
// ==========

const create_${tableName} = async (
  insert: ${tableName}Insert,
): Promise<boolean> => {
  const result = await db
    .insert(${tableName})
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: ${tableName}.id });
  if (result.length == 0) return false;
  return true;
};
`;
};

const createDeleteFunction = (tableName: string) => {
  return `
const delete_${tableName} = async (
  select: ${tableName}Select,
): Promise<boolean> => {
  const result = await db
    .delete(${tableName})
    .where(eq(${tableName}.id, select.id))
    .returning({ deletedId: ${tableName}.id });
  if (result.length == 0) return false;
  return true;
};`;
};

const createGetFunction = (tableName: string) => {
  return `
const get_${tableName} = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
): Promise<${tableName}Select[]> => {
  const experienceLevelResults = await db
    .select()
    .from(${tableName})
    .orderBy(orderStatement(order))
    .limit(take ?? config_${tableName}.pagination.take)
    .offset(skip ?? config_${tableName}.pagination.skip);
  return experienceLevelResults;
};`;
};

const createUpdateFunction = (tableName: string) => {
  return `
const update_${tableName} = async (
  select: ${tableName}Select,
  insert: ${tableName}Insert,
): Promise<boolean> => {
  const result = await db
    .update(${tableName})
    .set(insert)
    .where(eq(${tableName}.id, select.id))
    .returning({ updatedId: ${tableName}.id });
  if (result.length == 0) return false;
  return true;
};`;
};

const createExportStatement = (tableName: string): string => {
  return `
export {
  create_${tableName},
  delete_${tableName},
  get_${tableName},
  update_${tableName},
};`;
};

export const createTagFunctions = (tableName: string): string => {
  let finalString = "";
  finalString += createImportStatement(tableName) + "\n";
  finalString += createTypeDeclarations(tableName) + "\n";
  finalString += createConfig(tableName) + "\n";
  finalString += createOrdering(tableName) + "\n";
  finalString += createInsertFunction(tableName) + "\n";
  finalString += createDeleteFunction(tableName) + "\n";
  finalString += createGetFunction(tableName) + "\n";
  finalString += createUpdateFunction(tableName) + "\n";
  finalString += createExportStatement(tableName) + "\n";
  return finalString;
};
