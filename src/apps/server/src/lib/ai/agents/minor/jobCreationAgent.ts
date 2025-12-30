import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { readPage, searchSite, jobTools } from "@/lib/ai/tools";
import { observePrepareSteps } from "@/lib/ai/observability";

export const jobCreationAgent = new Agent({
  model: google("gemini-2.5-pro"),
})
