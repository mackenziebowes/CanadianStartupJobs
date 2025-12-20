import { tool } from "ai";
import z from "zod";
import {
  industries as industriesCRUD,
  provinces as provincesCRUD,
  raisingStage as raisingStageCRUD,
  teamSize as teamSizeCRUD,
  experienceLevels as experienceLevelsCRUD,
  jobTypes as jobTypesCRUD,
  roles as rolesCRUD,
} from "@/functions/tags";
import {
  orgPivots
} from "@/functions/pivots/orgs";
import {
  jobPivots
} from "@/functions/pivots/jobs";
import { logGeneric } from "../observability";

const orgTagNameSchema = z
  .enum(["Team Size", "Raising Stage", "Province", "Industry"])
  .describe("The readable name of a tag field");

// Job-specific tag schema
const jobTagNameSchema = z
  .enum(["Experience Level", "Role", "Job Type", "Province", "Industry"])
  .describe("The readable name of a job tag field");

const skipTakeSchema = z.object({
  skip: z.number().describe("Pagination Offset"),
  take: z.number().describe("List Size"),
});

const listJobTagSchema = z.object({
  tagName: jobTagNameSchema,
  ...skipTakeSchema.shape,
});

const listOrgTagSchema = z.object({
  tagName: orgTagNameSchema,
  ...skipTakeSchema.shape,
})

type ListOrgTag = z.infer<typeof listOrgTagSchema>;
type ListJobTag = z.infer<typeof listJobTagSchema>;

export const listOrgTags = tool({
  description: "List existing tags in a tag field.",
  inputSchema: listOrgTagSchema,
  execute: async ({ tagName, skip, take }: ListOrgTag) => {
    logGeneric("List Tags", { tagName, skip, take });
    switch (tagName) {
      case "Team Size":
        return JSON.stringify(await teamSizeCRUD.read(skip, take));
      case "Raising Stage":
        return JSON.stringify(await raisingStageCRUD.read(skip, take));
      case "Province":
        return JSON.stringify(await provincesCRUD.read(skip, take));
      case "Industry":
        return JSON.stringify(await industriesCRUD.read(skip, take));
    }
  },
});

export const listJobTags = tool({
  description: "List existing tags in a tag field.",
  inputSchema: listJobTagSchema,
  execute: async ({ tagName, skip, take }: ListJobTag) => {
    switch (tagName) {
      case "Experience Level":
        return JSON.stringify(await experienceLevelsCRUD.read(skip, take));
      case "Job Type":
        return JSON.stringify(await jobTypesCRUD.read(skip, take));
      case "Role":
        return JSON.stringify(await rolesCRUD.read(skip, take));
      case "Province":
        return JSON.stringify(await provincesCRUD.read(skip, take));
      case "Industry":
        return JSON.stringify(await industriesCRUD.read(skip, take));
    }
  }
});

const createTagNameSchema = z.enum(["Team Size", "Raising Stage", "Industry", "Province"]).describe("The available tags for creation - only call this after confirming the tag you want to create doesn't exist.");

const createTagSchema = z.object({
  tagName: createTagNameSchema,
  tagValue: z.string().describe("The actual entry to add to the tag field."),
});
type CreateTag = z.infer<typeof createTagSchema>;

export const createTag = tool({
  description: "Create a new entry for a tag field",
  inputSchema: createTagSchema,
  execute: async ({ tagName, tagValue }: CreateTag) => {
    logGeneric("Create Tag", { tagName, tagValue });
    switch (tagName) {
      case "Team Size":
        return JSON.stringify(await teamSizeCRUD.create({ name: tagValue }));
      case "Raising Stage":
        return JSON.stringify(await raisingStageCRUD.create({ name: tagValue }));
      case "Industry":
        return JSON.stringify(await industriesCRUD.create({ name: tagValue }));
    }
  },
});

const connectOrgTagSchema = z.object({
  tagName: orgTagNameSchema,
  orgId: z.number().describe("The ID of the organization to add the tag to."),
  otherId: z.number().describe("The ID of the specific tag to apply to the organization."),
});
type ConnectOrgTag = z.infer<typeof connectOrgTagSchema>;

export const connectOrgToTag = tool({
  description: "Connect a tag to an organization by IDs",
  inputSchema: connectOrgTagSchema,
  execute: async ({ tagName, orgId, otherId }: ConnectOrgTag) => {
    logGeneric("Connect Tag", { tagName, orgId, otherId });
    switch (tagName) {
      case "Team Size":
        return JSON.stringify(await orgPivots.teamSize.add(orgId, otherId));
      case "Raising Stage":
        return JSON.stringify(await orgPivots.raisingStage.add(orgId, otherId));
      case "Industry":
        return JSON.stringify(await orgPivots.industry.add(orgId, otherId));
      case "Province":
        return JSON.stringify(await orgPivots.province.add(orgId, otherId));
    }
  }
});

const connectJobTagSchema = z.object({
  tagName: jobTagNameSchema,
  jobId: z.number().describe("The ID of the job to add the tag to."),
  otherId: z.number().describe("The ID of the specific tag to apply to the job."),
});
type ConnectJobTag = z.infer<typeof connectJobTagSchema>;

export const connectJobToTag = tool({
  description: "Connect a tag to a job by IDs",
  inputSchema: connectJobTagSchema,
  execute: async ({ tagName, jobId, otherId }: ConnectJobTag) => {
    logGeneric("Connect Job Tag", { tagName, jobId, otherId });
    switch (tagName) {
      case "Experience Level":
        return JSON.stringify(await jobPivots.experienceLevel.add(jobId, otherId));
      case "Role":
        return JSON.stringify(await jobPivots.roles.add(jobId, otherId));
      case "Job Type":
        return JSON.stringify(await jobPivots.jobTypes.add(jobId, otherId));
      case "Industry":
        return JSON.stringify(await jobPivots.industry.add(jobId, otherId));
      case "Province":
        return JSON.stringify(await jobPivots.provinces.add(jobId, otherId));
    }
  }
});
