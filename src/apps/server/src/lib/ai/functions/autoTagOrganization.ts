
import { prompts } from "@/lib/ai/prompts";
import { orgTaggingAgent } from "@/lib/ai/agents/minor/orgTaggingAgent";

const getTagData = async (org: string, markdown: string, links: string[], url: string) => {
  const result = await orgTaggingAgent.generate({
    prompt: prompts.getOrganizationTags(org, markdown, links, url),
  });

  console.log("Org Tagging Agent Result Steps:", result.steps.length);
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
};
