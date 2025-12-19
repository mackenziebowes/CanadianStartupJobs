import { tool } from "ai";
import z from "zod";
import {
  industries as industriesCRUD,
  provinces as provincesCRUD,
  raisingStage as raisingStageCRUD,
  teamSize as teamSizeCRUD,
} from "@/functions/tags";
import {
  orgPivots
} from "@/functions/pivots/orgs";
import { logGeneric } from "../observability";

const tagNameSchema = z
  .enum(["Team Size", "Raising Stage", "Province", "Industry"])
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

const createTagNameSchema = z.enum(["Team Size", "Raising Stage", "Industry"]).describe("The available tags for creation - only call this after confirming the tag you want to create doesn't exist.");

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
  tagName: tagNameSchema,
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
