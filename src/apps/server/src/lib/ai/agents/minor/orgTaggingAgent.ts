import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { readPage, searchSite, orgTools } from "@/lib/ai/tools";
import { observePrepareSteps } from "@/lib/ai/observability";

export const orgTaggingAgent = new Agent({
  model: google("gemini-2.5-pro"),
  tools: {
    readPage,
    searchSite,
    listTags: orgTools.tags.list,
    createTag: orgTools.tags.create,
    connectOrgToTag: orgTools.tags.connect
  },
  stopWhen: stepCountIs(10),
  prepareStep: observePrepareSteps("Organization Tagging")
});
