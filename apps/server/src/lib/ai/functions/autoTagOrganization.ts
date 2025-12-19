import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { prompts } from "../prompts";
import { readPage, searchSite, listTags, createTag, connectOrgToTag } from "@/lib/ai/tools";
import { observePrepareSteps } from "../observability";

const taggingAgent = new Agent({
  model: google("gemini-2.5-pro"),
  tools: {
    readPage,
    searchSite,
    listTags,
    createTag,
    connectOrgToTag
  },
  stopWhen: stepCountIs(10),
  prepareStep: observePrepareSteps("Tagging")
});

const getTagData = async (org: string, markdown: string, links: string[], url: string) => {
  const result = await taggingAgent.generate({
    prompt: prompts.getOrganizationTags(org, markdown, links, url),
  });

  console.log("Tagging Agent Result Steps:", result.steps.length);
  if (result.steps.length > 0) {
     const lastStep = result.steps[result.steps.length - 1];
     console.log("Final Step Text:", lastStep.text);
     console.log("Final Step ToolCalls:", JSON.stringify(lastStep.toolCalls, null, 2));
     console.log("Final Step ToolResults:", JSON.stringify(lastStep.toolResults, null, 2));
  }
  console.log("Finish Reason:", result.finishReason);
  console.log("Usage:", result.usage);
  return result;
};

export const autoTagOrganization = async (flatOrg: string, markdown: string, links: string[], url: string) => {
  await getTagData(flatOrg, markdown, links, url);
}
