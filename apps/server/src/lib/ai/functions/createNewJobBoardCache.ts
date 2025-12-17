import { db, schemas, jobBoardCaches, orgs } from "@canadian-startup-jobs/db";
import { SHA256 } from "bun";

export async function createNewPortfolioCache(url: string) {
  const htmlPayload = await fetch(url);
  const hasher = new SHA256();
  const hash = hasher.digest(await htmlPayload.bytes())
  const now = Date.now();
  const args = schemas.portfolioCaches.insert.safeParse({
    url,
    freshTil: now + (7 * 24 * 60 * 60 * 1000),
    lastHash: hash.toString()
  });
  if (args.error) throw new Error("Args fucked up");
  const newPortfolio = await db.insert(portfolioCaches).values(args.data).returning();
  if (!newPortfolio[0]) throw new Error("Insert fucked up");
  return newPortfolio[0];
}

export async function connectSourceToPortfolioCache(sourceId: number, cacheId: number) {
  const args = schemas.sourcesPortfolioCaches.insert.safeParse({
    sourceId, portfolioCacheId: cacheId
  });
  if (args.error) throw new Error("Ids are fucked up");
  const newPivot = await db.insert(sourcesPortfolioCaches).values(args.data).returning();
  if (!newPivot[0]) throw new Error("Inserting pivot table fucked up");
  return newPivot[0];
}
