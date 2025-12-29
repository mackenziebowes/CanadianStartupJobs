import { eq } from "drizzle-orm";
import { db, sources } from "@canadian-startup-jobs/db";
import { AppError, ERROR_CODES } from "@/lib/errors";

type sourcesInsert = typeof sources.$inferInsert;
type sourcesSelect = typeof sources.$inferSelect;

const getSourceById = async (id: number): Promise<sourcesSelect> => {
  const result = await db.select().from(sources).where(eq(sources.id, id)).limit(1);
  if (!result[0]) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, "Source not found", { id });
  return result[0];
};

export { getSourceById };
