import { tool } from "ai";
import z from "zod";
import { teamSize as teamSizeCRUD } from "@/functions/tags";

const tagNameSchema = z.enum(["Team Size", "Raising Stage", "Province", "Industry"]).describe("The readable name of a tag field");

const listTagSchema = z.object({
  tagName: tagNameSchema,
  skip: z.number().describe("Pagination Offset"),
  take: z.number().describe("List Size"),
});
type ListTag = z.infer<typeof listTagSchema>;

export const listTags = tool({
  description: "List existing tags in a tag field.",
  inputSchema: listTagSchema,
  execute: async ({
    tagName,
    skip,
    take
  }: ListTag) => {
    switch (tagName) {
      case "Team Size":
        return JSON.stringify(await teamSizeCRUD.read(skip, take));
    }
  }
});

const createTagSchema = z.object({
  tagName: tagNameSchema,
  tagValue: z.string().describe("The actual entry to add to the tag field")
});
type CreateTag = z.infer<typeof createTagSchema>;

export const createTag = tool({
  description: "Create a new entry for a tag field",
  inputSchema: createTagSchema,
  execute: async ({
    tagName,
    tagValue
  }: CreateTag) => {
    switch (tagName) {
      case "Team Size":
        return JSON.stringify(await teamSizeCRUD.create({ name: tagValue }));
    }
  }
})

/* Blocked by @/functions/tags and @/functions/pivots completion. */
