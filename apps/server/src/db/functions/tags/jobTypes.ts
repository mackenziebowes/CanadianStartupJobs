
import { eq, asc, desc } from "drizzle-orm";
import { db, jobTypes } from "@canadian-startup-jobs/db";

type jobTypesInsert = typeof jobTypes.$inferInsert;
type jobTypesSelect = typeof jobTypes.$inferSelect;

const config_jobTypes = {
  pagination: {
    skip: 10,
    take: 10,
    order: desc,
  },
};


const orderAsc = asc(jobTypes.id);
const orderDesc = desc(jobTypes.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_jobTypes.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};


// ==========
// Basic CRUD
// ==========

const create_jobTypes = async (
  insert: jobTypesInsert,
): Promise<boolean> => {
  const result = await db
    .insert(jobTypes)
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: jobTypes.id });
  if (result.length == 0) return false;
  return true;
};


const delete_jobTypes = async (
  select: jobTypesSelect,
): Promise<boolean> => {
  const result = await db
    .delete(jobTypes)
    .where(eq(jobTypes.id, select.id))
    .returning({ deletedId: jobTypes.id });
  if (result.length == 0) return false;
  return true;
};

const get_jobTypes = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
): Promise<jobTypesSelect[]> => {
  const experienceLevelResults = await db
    .select()
    .from(jobTypes)
    .orderBy(orderStatement(order))
    .limit(take ?? config_jobTypes.pagination.take)
    .offset(skip ?? config_jobTypes.pagination.skip);
  return experienceLevelResults;
};

const update_jobTypes = async (
  select: jobTypesSelect,
  insert: jobTypesInsert,
): Promise<boolean> => {
  const result = await db
    .update(jobTypes)
    .set(insert)
    .where(eq(jobTypes.id, select.id))
    .returning({ updatedId: jobTypes.id });
  if (result.length == 0) return false;
  return true;
};

export {
  create_jobTypes,
  delete_jobTypes,
  get_jobTypes,
  update_jobTypes,
};
