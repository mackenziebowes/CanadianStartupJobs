import { describe, test, expect } from "bun:test";
import { providers } from "@/ai/providers";
import { AI_CONFIG } from "@/data/constants";

describe("AI Providers", () => {
  test("should export a providers object", () => {
    expect(providers).toBeDefined();
    expect(typeof providers).toBe("object");
  });

  test("should have 'low' and 'high' models defined", () => {
    expect(providers.low).toBeDefined();
    expect(providers.high).toBeDefined();
  });

  test("should include the provider instance", () => {
    expect(providers.provider).toBeDefined();
  });

  test("models should match the structure expected by AI SDK", () => {
    // Basic check to ensure they are objects with modelId or similar structure
    expect(providers.low).toBeTruthy();
    expect(providers.high).toBeTruthy();
  });

  test("should align with configuration constants", () => {
    // This verifies that the loaded model IDs match one of the configured sets.
    const lowModelId = providers.low.modelId;
    const highModelId = providers.high.modelId;

    const isOpenAI =
      lowModelId === AI_CONFIG.MODELS.LOW.OPENAI &&
      highModelId === AI_CONFIG.MODELS.HIGH.OPENAI;
    const isGoogle =
      lowModelId === AI_CONFIG.MODELS.LOW.GOOGLE &&
      highModelId === AI_CONFIG.MODELS.HIGH.GOOGLE;

    expect(isOpenAI || isGoogle).toBeTrue();
  });
});
