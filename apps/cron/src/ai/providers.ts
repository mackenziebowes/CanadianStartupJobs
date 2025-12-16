import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import z from "zod";
import { AI_CONFIG } from "@/data/constants";

/**
 * Main Goal:
 * Export an isomorphic AI interface for use throughout this package
 *
 * Sub goals:
 * 1) Check / handle apiKey presence/absence
 * 1.1) Throw if no matching keys are set
 * 2) Pull from @/data/config to determine which models are low/high thinking
 * 3) Apply best practices/safety reqs here, centralized, for housekeeping
 */

const validKeySchema = z.string().min(1);

// Store OpenAI key in memory for logic
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Store Google key in memory for logic
const GOOGLE_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const hasOpenAI = validKeySchema.safeParse(OPENAI_KEY).success;
const hasGoogleKey = validKeySchema.safeParse(GOOGLE_KEY).success;

if (!hasOpenAI && !hasGoogleKey) {
  throw new Error("Need at least one AI API Key set to run this program.");
}

const createOpenAIModels = () => {
  const provider = createOpenAI({
    apiKey: OPENAI_KEY,
  });
  return {
    low: provider(AI_CONFIG.MODELS.LOW.OPENAI),
    high: provider(AI_CONFIG.MODELS.HIGH.OPENAI),
    provider,
  };
};

const createGoogleModels = () => {
  const provider = createGoogleGenerativeAI({
    apiKey: GOOGLE_KEY,
  });
  return {
    low: provider(AI_CONFIG.MODELS.LOW.GOOGLE),
    high: provider(AI_CONFIG.MODELS.HIGH.GOOGLE),
    provider,
  };
};

const getActiveModels = () => {
  const preferred = AI_CONFIG.PREFERRED_SOURCE;

  if (preferred === "OpenAI" && hasOpenAI) {
    return createOpenAIModels();
  }

  if (preferred === "Google" && hasGoogleKey) {
    return createGoogleModels();
  }

  // Fallbacks
  if (hasOpenAI) return createOpenAIModels();
  if (hasGoogleKey) return createGoogleModels();

  throw new Error("No valid AI provider found");
};

export const providers = getActiveModels();
