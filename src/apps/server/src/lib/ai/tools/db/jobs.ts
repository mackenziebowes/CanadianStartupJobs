import { tool } from "ai";
import z from "zod";
import {
  industries as industriesCRUD,
  provinces as provincesCRUD,
  experienceLevels as experienceLevelsCRUD,
  jobTypes as jobTypesCRUD,
  roles as rolesCRUD,
} from "@/lib/db/functions/tags";
import {
  jobPivots
} from "@/lib/db/functions/pivots/jobs";
import { logGeneric } from "@/lib/ai/observability";

const tagNameSchema = z
  .enum(["Provinces", "Industries", "Experience Levels", "Job Types", "Roles"])
  .describe("The readable name of a tag field");

const listTagSchema = z.object({
  tagName: tagNameSchema,
  skip: z.number().describe("Pagination Offset"),
  take: z.number().describe("List Size"),
});
type ListTag = z.infer<typeof listTagSchema>;

export const listTags = tool({
  description: "List existing tags in a tag field.",
  inputSchema: listTagSchema,
  execute: async ({ tagName, skip, take }: ListTag) => {
    logGeneric("List Tags", { tagName, skip, take });
    switch (tagName) {
      case "Provinces":
        return JSON.stringify(await provincesCRUD.read(skip, take));
      case "Industries":
        return JSON.stringify(await industriesCRUD.read(skip, take));
      case "Experience Levels":
        return JSON.stringify(await experienceLevelsCRUD.read(skip, take));
      case "Job Types":
        return JSON.stringify(await jobTypesCRUD.read(skip, take));
      case "Roles":
        return JSON.stringify(await rolesCRUD.read(skip, take));
    }
  },
});

const createTagNameSchema = z.enum(["Roles"]).describe("The available tags for creation - only call this after confirming the tag you want to create doesn't exist.");

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
      case "Roles":
        return JSON.stringify(await rolesCRUD.create({name: tagValue}));
    }
  },
});

const connectJobTagSchema = z.object({
  tagName: tagNameSchema,
  jobId: z.number().describe("The ID of the job to add the tag to."),
  otherId: z.number().describe("The ID of the specific tag to apply to the organization."),
});
type ConnectJobTag = z.infer<typeof connectJobTagSchema>;

const connectJobToTag = tool({
  description: "Connect a tag to a job by IDs",
  inputSchema: connectJobTagSchema,
  execute: async ({ tagName, jobId, otherId }: ConnectJobTag) => {
    logGeneric("Connect Tag", { tagName, jobId, otherId });
    switch (tagName) {
      case "Provinces":
        return JSON.stringify(await jobPivots.provinces.add(jobId, otherId));
      case "Industries":
        return JSON.stringify(await jobPivots.industry.add(jobId, otherId));
      case "Experience Levels":
        return JSON.stringify(await jobPivots.experienceLevel.add(jobId, otherId));
      case "Job Types":
        return JSON.stringify(await jobPivots.jobType.add(jobId, otherId));
      case "Roles":
        return JSON.stringify(await jobPivots.roles.add(jobId, otherId));
    }
  }
});

/*
=======================
  Job Creation Stuff
=======================
*/




export const jobTools = {
  tags: {
    list: listTags,
    create: createTag,
    connect: connectJobToTag
  }
};
