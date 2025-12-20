import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { prompts } from "../prompts";
import { readPage, searchSite, listJobTags, createTag, connectJobToTag } from "@/lib/ai/tools";
import { observePrepareSteps } from "../observability";

const taggingAgent = new Agent({
  model: google("gemini-2.5-pro"),
  tools: {
    readPage,
    searchSite,
    listTags: listJobTags,
    createTag,
    connectJobToTag,
  },
  stopWhen: stepCountIs(10),
  prepareStep: observePrepareSteps("Tagging - Job"),
});

const getTagData = async (job: string, markdown: string, links: string[], url: string) => {
  const result = await taggingAgent.generate({
    prompt: prompts.getJobTags(job, markdown, links, url),
  });

  console.log("Job Tagging Agent Result Steps:", result.steps.length);
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

export const autoTagJob = async (flatJob: string, markdown: string, links: string[], url: string) => {
  await getTagData(flatJob, markdown, links, url);
};
