
import { eq, asc, desc } from "drizzle-orm";
import { db, provinces } from "@canadian-startup-jobs/db";

type provincesInsert = typeof provinces.$inferInsert;
type provincesSelect = typeof provinces.$inferSelect;

const config_provinces = {
  pagination: {
    skip: 10,
    take: 10,
    order: desc,
  },
};


const orderAsc = asc(provinces.id);
const orderDesc = desc(provinces.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_provinces.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};


// ==========
// Basic CRUD
// ==========

const create_provinces = async (
  insert: provincesInsert,
): Promise<boolean> => {
  const result = await db
    .insert(provinces)
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: provinces.id });
  if (result.length == 0) return false;
  return true;
};


const delete_provinces = async (
  select: provincesSelect,
): Promise<boolean> => {
  const result = await db
    .delete(provinces)
    .where(eq(provinces.id, select.id))
    .returning({ deletedId: provinces.id });
  if (result.length == 0) return false;
  return true;
};

const get_provinces = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
): Promise<provincesSelect[]> => {
  const experienceLevelResults = await db
    .select()
    .from(provinces)
    .orderBy(orderStatement(order))
    .limit(take ?? config_provinces.pagination.take)
    .offset(skip ?? config_provinces.pagination.skip);
  return experienceLevelResults;
};

const update_provinces = async (
  select: provincesSelect,
  insert: provincesInsert,
): Promise<boolean> => {
  const result = await db
    .update(provinces)
    .set(insert)
    .where(eq(provinces.id, select.id))
    .returning({ updatedId: provinces.id });
  if (result.length == 0) return false;
  return true;
};

export {
  create_provinces,
  delete_provinces,
  get_provinces,
  update_provinces,
};
