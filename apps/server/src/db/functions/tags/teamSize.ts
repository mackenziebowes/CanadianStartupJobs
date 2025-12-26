
import { eq, asc, desc } from "drizzle-orm";
import { db, teamSize } from "@canadian-startup-jobs/db";

type teamSizeInsert = typeof teamSize.$inferInsert;
type teamSizeSelect = typeof teamSize.$inferSelect;

const config_teamSize = {
  pagination: {
    skip: 10,
    take: 10,
    order: desc,
  },
};


const orderAsc = asc(teamSize.id);
const orderDesc = desc(teamSize.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_teamSize.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};


// ==========
// Basic CRUD
// ==========

const create_teamSize = async (
  insert: teamSizeInsert,
) => {
  const result = await db
    .insert(teamSize)
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: teamSize.id });
  if (result.length == 0) return false;
  return result;
};

const delete_teamSize = async (
  select: teamSizeSelect,
) => {
  const result = await db
    .delete(teamSize)
    .where(eq(teamSize.id, select.id))
    .returning({ deletedId: teamSize.id });
  if (result.length == 0) return false;
  return true;
};

const get_teamSize = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const experienceLevelResults = await db
    .select()
    .from(teamSize)
    .orderBy(orderStatement(order))
    .limit(take ?? config_teamSize.pagination.take)
    .offset(skip ?? config_teamSize.pagination.skip);
  return experienceLevelResults;
};

const update_teamSize = async (
  select: teamSizeSelect,
  insert: teamSizeInsert,
) => {
  const result = await db
    .update(teamSize)
    .set(insert)
    .where(eq(teamSize.id, select.id))
    .returning({ updatedId: teamSize.id });
  if (result.length == 0) return false;
  return result;
};

export {
  create_teamSize,
  delete_teamSize,
  get_teamSize,
  update_teamSize,
};
