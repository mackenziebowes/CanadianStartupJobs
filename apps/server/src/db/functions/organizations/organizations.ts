import { eq } from "drizzle-orm";
import { db, organizations } from "@canadian-startup-jobs/db";
import { z } from "zod";
import { AppError, ERROR_CODES } from "@/lib/errors";

type organizationsInsert = typeof organizations.$inferInsert;
type organizationsSelect = typeof organizations.$inferSelect;

const getOrganizationById = async (id: number): Promise<organizationsSelect> => {
  const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  if (!result[0]) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, "Organization not found", { id });
  return result[0];
};

export { getOrganizationById };
