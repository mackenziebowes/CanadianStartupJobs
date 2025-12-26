
import { eq, asc, desc } from "drizzle-orm";
import { db, industries } from "@canadian-startup-jobs/db";

type industriesInsert = typeof industries.$inferInsert;
type industriesSelect = typeof industries.$inferSelect;

const config_industries = {
  pagination: {
    skip: 10,
    take: 10,
    order: desc,
  },
};


const orderAsc = asc(industries.id);
const orderDesc = desc(industries.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_industries.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};


// ==========
// Basic CRUD
// ==========

const create_industries = async (
  insert: industriesInsert,
): Promise<boolean> => {
  const result = await db
    .insert(industries)
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: industries.id });
  if (result.length == 0) return false;
  return true;
};


const delete_industries = async (
  select: industriesSelect,
): Promise<boolean> => {
  const result = await db
    .delete(industries)
    .where(eq(industries.id, select.id))
    .returning({ deletedId: industries.id });
  if (result.length == 0) return false;
  return true;
};

const get_industries = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
): Promise<industriesSelect[]> => {
  const experienceLevelResults = await db
    .select()
    .from(industries)
    .orderBy(orderStatement(order))
    .limit(take ?? config_industries.pagination.take)
    .offset(skip ?? config_industries.pagination.skip);
  return experienceLevelResults;
};

const update_industries = async (
  select: industriesSelect,
  insert: industriesInsert,
): Promise<boolean> => {
  const result = await db
    .update(industries)
    .set(insert)
    .where(eq(industries.id, select.id))
    .returning({ updatedId: industries.id });
  if (result.length == 0) return false;
  return true;
};

export {
  create_industries,
  delete_industries,
  get_industries,
  update_industries,
};
