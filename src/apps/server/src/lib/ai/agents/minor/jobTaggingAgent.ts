import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { readPage, searchSite, jobTools } from "@/lib/ai/tools";
import { observePrepareSteps } from "@/lib/ai/observability";

export const jobTaggingAgent = new Agent({
  model: google("gemini-2.5-pro"),
  tools: {
    readPage,
    searchSite,
    listTags: jobTools.tags.list,
    createTag: jobTools.tags.create,
    connectOrgToTag: jobTools.tags.connect
  },
  stopWhen: stepCountIs(10),
  prepareStep: observePrepareSteps("Job Tagging")
});
