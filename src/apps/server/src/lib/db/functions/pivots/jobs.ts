import { and, eq, asc, desc } from "drizzle-orm";
import {
  db,
  jobsExperienceLevels,
  jobsIndustries,
  jobsJobsCaches,
  jobsJobTypes,
  jobsProvinces,
  jobsRoles,
} from "@canadian-startup-jobs/db";

const add_jobsExperienceLevels = async (
  jobId: number,
  experienceLevelId: number,
): Promise<boolean> => {
  const result = await db
    .insert(jobsExperienceLevels)
    .values({ jobId, experienceLevelId })
    .onConflictDoNothing()
    .returning({ jobId: jobsExperienceLevels.jobId });
  return result.length > 0;
};

const remove_jobsExperienceLevels = async (
  jobId: number,
  experienceLevelId: number,
): Promise<boolean> => {
  const result = await db
    .delete(jobsExperienceLevels)
    .where(
      and(
        eq(jobsExperienceLevels.jobId, jobId),
        eq(jobsExperienceLevels.experienceLevelId, experienceLevelId),
      ),
    );
  return result.length > 0;
};

const orderAsc_jobsExperienceLevels = asc(jobsExperienceLevels.jobId);
const orderDesc_jobsExperienceLevels = desc(
  jobsExperienceLevels.experienceLevelId,
);
const orderStatement_jobsExperienceLevels = (
  order?: "asc" | "desc",
): typeof orderAsc_jobsExperienceLevels => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_jobsExperienceLevels;
  return orderDesc_jobsExperienceLevels;
};

const get_jobsExperienceLevels_by_job = async (
  jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsExperienceLevels)
    .where(eq(jobsExperienceLevels.jobId, jobId))
    .orderBy(orderStatement_jobsExperienceLevels(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_jobsExperienceLevels_by_experienceLevel = async (
  experienceLevelId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsExperienceLevels)
    .where(eq(jobsExperienceLevels.experienceLevelId, experienceLevelId))
    .orderBy(orderStatement_jobsExperienceLevels(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const add_jobsIndustries = async (
  jobId: number,
  industryId: number,
): Promise<boolean> => {
  const result = await db
    .insert(jobsIndustries)
    .values({ jobId, industryId })
    .onConflictDoNothing()
    .returning({ jobId: jobsIndustries.jobId });
  return result.length > 0;
};

const remove_jobsIndustries = async (
  jobId: number,
  industryId: number,
): Promise<boolean> => {
  const result = await db
    .delete(jobsIndustries)
    .where(
      and(
        eq(jobsIndustries.jobId, jobId),
        eq(jobsIndustries.industryId, industryId),
      ),
    );
  return result.length > 0;
};

const orderAsc_jobsIndustries = asc(jobsIndustries.jobId);
const orderDesc_jobsIndustries = desc(jobsIndustries.industryId);
const orderStatement_jobsIndustries = (
  order?: "asc" | "desc",
): typeof orderAsc_jobsIndustries => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_jobsIndustries;
  return orderDesc_jobsIndustries;
};

const get_jobsIndustries_by_job = async (
  jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsIndustries)
    .where(eq(jobsIndustries.jobId, jobId))
    .orderBy(orderStatement_jobsIndustries(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_jobsIndustries_by_industry = async (
  industryId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsIndustries)
    .where(eq(jobsIndustries.industryId, industryId))
    .orderBy(orderStatement_jobsIndustries(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const add_jobsJobsCaches = async (
  jobId: number,
  jobCacheId: number,
): Promise<boolean> => {
  const result = await db
    .insert(jobsJobsCaches)
    .values({ jobId, jobCacheId })
    .onConflictDoNothing()
    .returning({ jobId: jobsJobsCaches.jobId });
  return result.length > 0;
};

const remove_jobsJobsCaches = async (
  jobId: number,
  jobCacheId: number,
): Promise<boolean> => {
  const result = await db
    .delete(jobsJobsCaches)
    .where(
      and(
        eq(jobsJobsCaches.jobId, jobId),
        eq(jobsJobsCaches.jobCacheId, jobCacheId),
      ),
    );
  return result.length > 0;
};

const orderAsc_jobsJobsCaches = asc(jobsJobsCaches.jobId);
const orderDesc_jobsJobsCaches = desc(jobsJobsCaches.jobCacheId);
const orderStatement_jobsJobsCaches = (
  order?: "asc" | "desc",
): typeof orderAsc_jobsJobsCaches => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_jobsJobsCaches;
  return orderDesc_jobsJobsCaches;
};

const get_jobsJobsCaches_by_job = async (
  jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsJobsCaches)
    .where(eq(jobsJobsCaches.jobId, jobId))
    .orderBy(orderStatement_jobsJobsCaches(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_jobsJobsCaches_by_jobCache = async (
  jobCacheId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsJobsCaches)
    .where(eq(jobsJobsCaches.jobCacheId, jobCacheId))
    .orderBy(orderStatement_jobsJobsCaches(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const add_jobsJobTypes = async (
  jobId: number,
  jobTypeId: number,
): Promise<boolean> => {
  const result = await db
    .insert(jobsJobTypes)
    .values({ jobId, jobTypeId })
    .onConflictDoNothing()
    .returning({ jobId: jobsJobTypes.jobId });
  return result.length > 0;
};

const remove_jobsJobTypes = async (
  jobId: number,
  jobTypeId: number,
): Promise<boolean> => {
  const result = await db
    .delete(jobsJobTypes)
    .where(
      and(eq(jobsJobTypes.jobId, jobId), eq(jobsJobTypes.jobTypeId, jobTypeId)),
    );
  return result.length > 0;
};

const orderAsc_jobsJobTypes = asc(jobsJobTypes.jobId);
const orderDesc_jobsJobTypes = desc(jobsJobTypes.jobTypeId);
const orderStatement_jobsJobTypes = (
  order?: "asc" | "desc",
): typeof orderAsc_jobsJobTypes => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_jobsJobTypes;
  return orderDesc_jobsJobTypes;
};

const get_jobsJobTypes_by_job = async (
  jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsJobTypes)
    .where(eq(jobsJobTypes.jobId, jobId))
    .orderBy(orderStatement_jobsJobTypes(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_jobsJobTypes_by_jobType = async (
  jobTypeId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsJobTypes)
    .where(eq(jobsJobTypes.jobTypeId, jobTypeId))
    .orderBy(orderStatement_jobsJobTypes(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const add_jobsProvinces = async (
  jobId: number,
  provinceId: number,
): Promise<boolean> => {
  const result = await db
    .insert(jobsProvinces)
    .values({ jobId, provinceId })
    .onConflictDoNothing()
    .returning({ jobId: jobsProvinces.jobId });
  return result.length > 0;
};

const remove_jobsProvinces = async (
  jobId: number,
  provinceId: number,
): Promise<boolean> => {
  const result = await db
    .delete(jobsProvinces)
    .where(
      and(
        eq(jobsProvinces.jobId, jobId),
        eq(jobsProvinces.provinceId, provinceId),
      ),
    );
  return result.length > 0;
};

const orderAsc_jobsProvinces = asc(jobsProvinces.jobId);
const orderDesc_jobsProvinces = desc(jobsProvinces.provinceId);
const orderStatement_jobsProvinces = (
  order?: "asc" | "desc",
): typeof orderAsc_jobsProvinces => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_jobsProvinces;
  return orderDesc_jobsProvinces;
};

const get_jobsProvinces_by_job = async (
  jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsProvinces)
    .where(eq(jobsProvinces.jobId, jobId))
    .orderBy(orderStatement_jobsProvinces(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_jobsProvinces_by_province = async (
  provinceId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsProvinces)
    .where(eq(jobsProvinces.provinceId, provinceId))
    .orderBy(orderStatement_jobsProvinces(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const add_jobsRoles = async (
  jobId: number,
  roleId: number,
): Promise<boolean> => {
  const result = await db
    .insert(jobsRoles)
    .values({ jobId, roleId })
    .onConflictDoNothing()
    .returning({ jobId: jobsRoles.jobId });
  return result.length > 0;
};

const remove_jobsRoles = async (
  jobId: number,
  roleId: number,
): Promise<boolean> => {
  const result = await db
    .delete(jobsRoles)
    .where(and(eq(jobsRoles.jobId, jobId), eq(jobsRoles.roleId, roleId)));
  return result.length > 0;
};

const orderAsc_jobsRoles = asc(jobsRoles.jobId);
const orderDesc_jobsRoles = desc(jobsRoles.roleId);
const orderStatement_jobsRoles = (
  order?: "asc" | "desc",
): typeof orderAsc_jobsRoles => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_jobsRoles;
  return orderDesc_jobsRoles;
};

const get_jobsRoles_by_job = async (
  jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsRoles)
    .where(eq(jobsRoles.jobId, jobId))
    .orderBy(orderStatement_jobsRoles(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_jobsRoles_by_role = async (
  roleId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(jobsRoles)
    .where(eq(jobsRoles.roleId, roleId))
    .orderBy(orderStatement_jobsRoles(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const industry = {
  add: add_jobsIndustries,
  remove: remove_jobsIndustries,
  get_by_job: get_jobsIndustries_by_job,
  get_by_industry: get_jobsIndustries_by_industry,
};

const experienceLevel = {
  add: add_jobsExperienceLevels,
  remove: remove_jobsExperienceLevels,
  get_by_job: get_jobsExperienceLevels_by_job,
  get_by_experienceLevel: get_jobsExperienceLevels_by_experienceLevel,
};

const jobCache = {
  add: add_jobsJobsCaches,
  remove: remove_jobsJobsCaches,
  get_by_job: get_jobsJobsCaches_by_job,
  get_by_jobCache: get_jobsJobsCaches_by_jobCache,
};

const jobType = {
  add: add_jobsJobTypes,
  remove: remove_jobsJobTypes,
  get_by_job: get_jobsJobTypes_by_job,
  get_by_jobType: get_jobsJobTypes_by_jobType
};

const provinces = {
  add: add_jobsProvinces,
  remove: remove_jobsProvinces,
  get_by_job: get_jobsProvinces_by_job,
  get_by_Provinces: get_jobsProvinces_by_province,
}

const roles = {
  add: add_jobsRoles,
  remove: remove_jobsRoles,
  get_by_job: get_jobsRoles_by_job,
  get_by_jobsRoles: get_jobsRoles_by_role,
}

const jobPivots = {
  industry,
  experienceLevel,
  jobCache,
  jobType,
  provinces,
  roles,
};

export {
  jobPivots
};
