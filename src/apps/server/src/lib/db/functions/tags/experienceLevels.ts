import { eq, asc, desc } from "drizzle-orm";
import { db, experienceLevels } from "@canadian-startup-jobs/db";

type experienceLevelsInsert = typeof experienceLevels.$inferInsert;
type experienceLevelsSelect = typeof experienceLevels.$inferSelect;

const config_experienceLevels = {
  pagination: {
    skip: 10,
    take: 10,
    order: "desc",
  },
};

const orderAsc = asc(experienceLevels.id);
const orderDesc = desc(experienceLevels.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_experienceLevels.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};

// ==========
// Basic CRUD
// ==========

const create_experienceLevels = async (
  insert: experienceLevelsInsert,
): Promise<boolean> => {
  const result = await db
    .insert(experienceLevels)
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: experienceLevels.id });
  if (result.length == 0) return false;
  return true;
};

const delete_experienceLevels = async (
  select: experienceLevelsSelect,
): Promise<boolean> => {
  const result = await db
    .delete(experienceLevels)
    .where(eq(experienceLevels.id, select.id))
    .returning({ deletedId: experienceLevels.id });
  if (result.length == 0) return false;
  return true;
};

const get_experienceLevels = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
): Promise<experienceLevelsSelect[]> => {
  const experienceLevelResults = await db
    .select()
    .from(experienceLevels)
    .orderBy(orderStatement(order))
    .limit(take ?? config_experienceLevels.pagination.take)
    .offset(skip ?? config_experienceLevels.pagination.skip);
  return experienceLevelResults;
};

const update_experienceLevels = async (
  select: experienceLevelsSelect,
  insert: experienceLevelsInsert,
): Promise<boolean> => {
  const result = await db
    .update(experienceLevels)
    .set(insert)
    .where(eq(experienceLevels.id, select.id))
    .returning({ updatedId: experienceLevels.id });
  if (result.length == 0) return false;
  return true;
};

export {
  create_experienceLevels,
  update_experienceLevels,
  delete_experienceLevels,
  get_experienceLevels,
};
