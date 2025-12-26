
import { and, eq, asc, desc } from "drizzle-orm";
import {
  db,
	orgsIndustries,
	orgsJobs,
	orgsProvinces,
	orgsSizes,
	orgsStages,
} from "@canadian-startup-jobs/db";
import { AppError, ERROR_CODES } from "@/lib/errors";

const add_orgsIndustries = async (
  orgId: number,
  industryId: number,
) => {
  const result = await db
    .insert(orgsIndustries)
    .values({ orgId, industryId })
    .onConflictDoNothing()
    .returning({ orgId: orgsIndustries.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, `Failed to add industry to org`, {
    orgId,
    industryId
  })
  return result;
};


const remove_orgsIndustries = async (
  orgId: number,
  industryId: number,
) => {
  const result = await db
    .delete(orgsIndustries)
    .where(
      and(
        eq(orgsIndustries.orgId, orgId),
        eq(orgsIndustries.industryId, industryId),
      ),
    ).returning({ orgId: orgsIndustries.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, `Failed to delete industry to org pivot`, {
    orgId,
    industryId
  })
  return result;
};


const orderAsc_orgsIndustries = asc(orgsIndustries.industryId);
const orderDesc_orgsIndustries = desc(
orgsIndustries.industryId,
);
const orderStatement_orgsIndustries = (
  order?: "asc" | "desc",
): typeof orderAsc_orgsIndustries => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_orgsIndustries;
  return orderDesc_orgsIndustries;
};


const get_orgsIndustries_by_org = async (
  orgId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsIndustries)
    .where(eq(orgsIndustries.orgId, orgId))
    .orderBy(orderStatement_orgsIndustries(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_orgsIndustries_by_industry = async (
industryId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsIndustries)
    .where(eq(orgsIndustries.industryId, industryId))
    .orderBy(orderStatement_orgsIndustries(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};


const add_orgsJobs = async (
  orgId: number,
  jobId: number,
) => {
  const result = await db
    .insert(orgsJobs)
    .values({ orgId, jobId })
    .onConflictDoNothing()
    .returning({ orgId: orgsJobs.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, `Failed to add job to org`, {
    orgId,
    jobId
  })
  return result;
};


const remove_orgsJobs = async (
  orgId: number,
  jobId: number,
) => {
  const result = await db
    .delete(orgsJobs)
    .where(
      and(
        eq(orgsJobs.orgId, orgId),
        eq(orgsJobs.jobId, jobId),
      ),
    ).returning({ orgId: orgsJobs.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, `Failed to delete job to org pivot`, {
    orgId,
    jobId
  })
  return result;
};


const orderAsc_orgsJobs = asc(orgsJobs.jobId);
const orderDesc_orgsJobs = desc(
orgsJobs.jobId,
);
const orderStatement_orgsJobs = (
  order?: "asc" | "desc",
): typeof orderAsc_orgsJobs => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_orgsJobs;
  return orderDesc_orgsJobs;
};


const get_orgsJobs_by_org = async (
  orgId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsJobs)
    .where(eq(orgsJobs.orgId, orgId))
    .orderBy(orderStatement_orgsJobs(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_orgsJobs_by_job = async (
jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsJobs)
    .where(eq(orgsJobs.jobId, jobId))
    .orderBy(orderStatement_orgsJobs(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};


const add_orgsProvinces = async (
  orgId: number,
  provinceId: number,
) => {
  const result = await db
    .insert(orgsProvinces)
    .values({ orgId, provinceId })
    .onConflictDoNothing()
    .returning({ orgId: orgsProvinces.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, `Failed to add province to org`, {
    orgId,
    provinceId
  })
  return result;
};


const remove_orgsProvinces = async (
  orgId: number,
  provinceId: number,
) => {
  const result = await db
    .delete(orgsProvinces)
    .where(
      and(
        eq(orgsProvinces.orgId, orgId),
        eq(orgsProvinces.provinceId, provinceId),
      ),
    ).returning({ orgId: orgsProvinces.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, `Failed to delete province to org pivot`, {
    orgId,
    provinceId
  })
  return result;
};


const orderAsc_orgsProvinces = asc(orgsProvinces.provinceId);
const orderDesc_orgsProvinces = desc(
orgsProvinces.provinceId,
);
const orderStatement_orgsProvinces = (
  order?: "asc" | "desc",
): typeof orderAsc_orgsProvinces => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_orgsProvinces;
  return orderDesc_orgsProvinces;
};


const get_orgsProvinces_by_org = async (
  orgId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsProvinces)
    .where(eq(orgsProvinces.orgId, orgId))
    .orderBy(orderStatement_orgsProvinces(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_orgsProvinces_by_province = async (
provinceId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsProvinces)
    .where(eq(orgsProvinces.provinceId, provinceId))
    .orderBy(orderStatement_orgsProvinces(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};


const add_orgsSizes = async (
  orgId: number,
  teamSizeId: number,
) => {
  const result = await db
    .insert(orgsSizes)
    .values({ orgId, teamSizeId })
    .onConflictDoNothing()
    .returning({ orgId: orgsSizes.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, `Failed to add teamSize to org`, {
    orgId,
    teamSizeId
  })
  return result;
};


const remove_orgsSizes = async (
  orgId: number,
  teamSizeId: number,
) => {
  const result = await db
    .delete(orgsSizes)
    .where(
      and(
        eq(orgsSizes.orgId, orgId),
        eq(orgsSizes.teamSizeId, teamSizeId),
      ),
    ).returning({ orgId: orgsSizes.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, `Failed to delete teamSize to org pivot`, {
    orgId,
    teamSizeId
  })
  return result;
};


const orderAsc_orgsSizes = asc(orgsSizes.teamSizeId);
const orderDesc_orgsSizes = desc(
orgsSizes.teamSizeId,
);
const orderStatement_orgsSizes = (
  order?: "asc" | "desc",
): typeof orderAsc_orgsSizes => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_orgsSizes;
  return orderDesc_orgsSizes;
};


const get_orgsSizes_by_org = async (
  orgId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsSizes)
    .where(eq(orgsSizes.orgId, orgId))
    .orderBy(orderStatement_orgsSizes(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_orgsSizes_by_teamSize = async (
teamSizeId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsSizes)
    .where(eq(orgsSizes.teamSizeId, teamSizeId))
    .orderBy(orderStatement_orgsSizes(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};


const add_orgsStages = async (
  orgId: number,
  raisingStageId: number,
) => {
  const result = await db
    .insert(orgsStages)
    .values({ orgId, raisingStageId })
    .onConflictDoNothing()
    .returning({ orgId: orgsStages.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, `Failed to add raisingStage to org`, {
    orgId,
    raisingStageId
  })
  return result;
};


const remove_orgsStages = async (
  orgId: number,
  raisingStageId: number,
) => {
  const result = await db
    .delete(orgsStages)
    .where(
      and(
        eq(orgsStages.orgId, orgId),
        eq(orgsStages.raisingStageId, raisingStageId),
      ),
    ).returning({ orgId: orgsStages.orgId });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, `Failed to delete raisingStage to org pivot`, {
    orgId,
    raisingStageId
  })
  return result;
};


const orderAsc_orgsStages = asc(orgsStages.raisingStageId);
const orderDesc_orgsStages = desc(
orgsStages.raisingStageId,
);
const orderStatement_orgsStages = (
  order?: "asc" | "desc",
): typeof orderAsc_orgsStages => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_orgsStages;
  return orderDesc_orgsStages;
};


const get_orgsStages_by_org = async (
  orgId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsStages)
    .where(eq(orgsStages.orgId, orgId))
    .orderBy(orderStatement_orgsStages(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_orgsStages_by_raisingStage = async (
raisingStageId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(orgsStages)
    .where(eq(orgsStages.raisingStageId, raisingStageId))
    .orderBy(orderStatement_orgsStages(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};



const industry = {
  add: add_orgsIndustries,
  remove: remove_orgsIndustries,
  get_by_org: get_orgsIndustries_by_org,
  get_by_industry: get_orgsIndustries_by_industry,
};

const job = {
  add: add_orgsJobs,
  remove: remove_orgsJobs,
  get_by_org: get_orgsJobs_by_org,
  get_by_job: get_orgsJobs_by_job,
};

const province = {
  add: add_orgsProvinces,
  remove: remove_orgsProvinces,
  get_by_org: get_orgsProvinces_by_org,
  get_by_province: get_orgsProvinces_by_province,
};

const teamSize = {
  add: add_orgsSizes,
  remove: remove_orgsSizes,
  get_by_org: get_orgsSizes_by_org,
  get_by_teamSize: get_orgsSizes_by_teamSize,
};

const raisingStage = {
  add: add_orgsStages,
  remove: remove_orgsStages,
  get_by_org: get_orgsStages_by_org,
  get_by_raisingStage: get_orgsStages_by_raisingStage,
};

const orgPivots = {
	industry,
	job,
	province,
	teamSize,
	raisingStage,
};

export {
  orgPivots
};
