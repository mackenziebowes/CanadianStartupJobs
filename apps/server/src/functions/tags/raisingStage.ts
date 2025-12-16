
import { eq, asc, desc } from "drizzle-orm";
import { db, raisingStage } from "@canadian-startup-jobs/db";

type raisingStageInsert = typeof raisingStage.$inferInsert;
type raisingStageSelect = typeof raisingStage.$inferSelect;

const config_raisingStage = {
  pagination: {
    skip: 10,
    take: 10,
    order: desc,
  },
};


const orderAsc = asc(raisingStage.id);
const orderDesc = desc(raisingStage.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_raisingStage.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};


// ==========
// Basic CRUD
// ==========

const create_raisingStage = async (
  insert: raisingStageInsert,
): Promise<boolean> => {
  const result = await db
    .insert(raisingStage)
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: raisingStage.id });
  if (result.length == 0) return false;
  return true;
};


const delete_raisingStage = async (
  select: raisingStageSelect,
): Promise<boolean> => {
  const result = await db
    .delete(raisingStage)
    .where(eq(raisingStage.id, select.id))
    .returning({ deletedId: raisingStage.id });
  if (result.length == 0) return false;
  return true;
};

const get_raisingStage = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
): Promise<raisingStageSelect[]> => {
  const experienceLevelResults = await db
    .select()
    .from(raisingStage)
    .orderBy(orderStatement(order))
    .limit(take ?? config_raisingStage.pagination.take)
    .offset(skip ?? config_raisingStage.pagination.skip);
  return experienceLevelResults;
};

const update_raisingStage = async (
  select: raisingStageSelect,
  insert: raisingStageInsert,
): Promise<boolean> => {
  const result = await db
    .update(raisingStage)
    .set(insert)
    .where(eq(raisingStage.id, select.id))
    .returning({ updatedId: raisingStage.id });
  if (result.length == 0) return false;
  return true;
};

export {
  create_raisingStage,
  delete_raisingStage,
  get_raisingStage,
  update_raisingStage,
};
