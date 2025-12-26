
import { eq, asc, desc } from "drizzle-orm";
import { db, roles } from "@canadian-startup-jobs/db";

type rolesInsert = typeof roles.$inferInsert;
type rolesSelect = typeof roles.$inferSelect;

const config_roles = {
  pagination: {
    skip: 10,
    take: 10,
    order: desc,
  },
};

const orderAsc = asc(roles.id);
const orderDesc = desc(roles.id);
const orderStatement = (order?: "asc" | "desc"): typeof orderAsc => {
  const direction = order ?? config_roles.pagination.order;
  if (direction === "asc") {
    return orderAsc;
  }
  return orderDesc;
};

// ==============
//   Basic CRUD
// ==============

const create_roles = async (
  insert: rolesInsert,
): Promise<boolean> => {
  const result = await db
    .insert(roles)
    .values(insert)
    .onConflictDoNothing()
    .returning({ id: roles.id });
  if (result.length == 0) return false;
  return true;
};

const delete_roles = async (
  select: rolesSelect,
): Promise<boolean> => {
  const result = await db
    .delete(roles)
    .where(eq(roles.id, select.id))
    .returning({ deletedId: roles.id });
  if (result.length == 0) return false;
  return true;
};

const get_roles = async (
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
): Promise<rolesSelect[]> => {
  const experienceLevelResults = await db
    .select()
    .from(roles)
    .orderBy(orderStatement(order))
    .limit(take ?? config_roles.pagination.take)
    .offset(skip ?? config_roles.pagination.skip);
  return experienceLevelResults;
};

const update_roles = async (
  select: rolesSelect,
  insert: rolesInsert,
): Promise<boolean> => {
  const result = await db
    .update(roles)
    .set(insert)
    .where(eq(roles.id, select.id))
    .returning({ updatedId: roles.id });
  if (result.length == 0) return false;
  return true;
};

export {
  create_roles,
  delete_roles,
  get_roles,
  update_roles,
};
