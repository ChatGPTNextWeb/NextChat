/**
 * Tests for custom model support (issue #4221).
 *
 * Verifies that models added via the customModels setting (e.g. "chatglm3-6b")
 * are handled correctly throughout the codebase:
 *  - collectModelTable builds the right entries
 *  - isModelNotavailableInServer correctly allows custom models
 */

import { collectModelTable, isModelNotavailableInServer } from "../app/utils/model";
import { DEFAULT_MODELS } from "../app/constant";

describe("collectModelTable with custom models", () => {
  test("adds a custom model with provider derived from model name when no @ given", () => {
    const table = collectModelTable(DEFAULT_MODELS, "chatglm3-6b");
    const entry = table["chatglm3-6b@chatglm3-6b"];
    expect(entry).toBeDefined();
    expect(entry.name).toBe("chatglm3-6b");
    expect(entry.available).toBe(true);
    expect(entry.provider?.providerType).toBe("custom");
  });

  test("adds a custom model with explicit provider (model@OpenAI format)", () => {
    const table = collectModelTable(DEFAULT_MODELS, "chatglm3-6b@OpenAI");
    const entry = table["chatglm3-6b@openai"];
    expect(entry).toBeDefined();
    expect(entry.name).toBe("chatglm3-6b");
    expect(entry.available).toBe(true);
    expect(entry.provider?.providerType).toBe("custom");
  });

  test("custom model is marked unavailable when prefixed with -", () => {
    const table = collectModelTable(DEFAULT_MODELS, "-chatglm3-6b");
    // Custom model created with available=false
    const entry = table["chatglm3-6b@chatglm3-6b"];
    expect(entry).toBeDefined();
    expect(entry.available).toBe(false);
  });

  test("custom model with display name alias (model=Alias format)", () => {
    const table = collectModelTable(DEFAULT_MODELS, "chatglm3-6b=GLM-3");
    const entry = table["chatglm3-6b@chatglm3-6b"];
    expect(entry).toBeDefined();
    expect(entry.displayName).toBe("GLM-3");
    expect(entry.available).toBe(true);
  });
});

describe("isModelNotavailableInServer with custom models", () => {
  afterEach(() => {
    delete process.env.DISABLE_GPT4;
  });

  test("allows a custom model when providerNames includes the model name itself (existing behaviour)", () => {
    // This is the pattern used in api/common.ts: third provider is the model name
    const result = isModelNotavailableInServer(
      "chatglm3-6b",
      "chatglm3-6b",
      ["OpenAI", "Azure", "chatglm3-6b"],
    );
    expect(result).toBe(false);
  });

  test("allows a custom model even when providerNames does NOT include the model name (new fallback)", () => {
    // Custom model added to server customModels without explicit provider.
    // The request comes in with only standard provider names — the new fallback
    // should still allow it because the model's providerType is "custom".
    const result = isModelNotavailableInServer(
      "chatglm3-6b",
      "chatglm3-6b",
      ["OpenAI", "Azure"],
    );
    expect(result).toBe(false);
  });

  test("blocks a model that is not in customModels and not in DEFAULT_MODELS", () => {
    // No custom model configured — completely unknown model should be blocked
    // only if customModels is non-empty (the check is skipped when customModels is empty)
    const result = isModelNotavailableInServer(
      "-all,gpt-4o-mini", // customModels is set, but chatglm3-6b is not listed
      "chatglm3-6b",
      ["OpenAI", "Azure"],
    );
    expect(result).toBe(true);
  });

  test("allows a built-in model when no custom model filter is applied", () => {
    const result = isModelNotavailableInServer(
      "",
      "gpt-4o",
      "OpenAI",
    );
    expect(result).toBe(false);
  });

  test("custom model added via -all,+model format is allowed", () => {
    const result = isModelNotavailableInServer(
      "-all,chatglm3-6b",
      "chatglm3-6b",
      ["OpenAI", "Azure", "chatglm3-6b"],
    );
    expect(result).toBe(false);
  });
});
