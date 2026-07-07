import { getTimeoutMSByModel, showPlugins } from "../app/utils";
import {
  REQUEST_TIMEOUT_MS,
  REQUEST_TIMEOUT_MS_FOR_THINKING,
  ServiceProvider,
} from "../app/constant";

describe("getTimeoutMSByModel", () => {
  test("uses the longer timeout for reasoning / image models", () => {
    const thinking = [
      "dall-e-3",
      "dalle-mini",
      "o1-preview",
      "o3-mini",
      "deepseek-reasoner",
      "glm-4-thinking",
    ];
    for (const model of thinking) {
      expect(getTimeoutMSByModel(model)).toBe(REQUEST_TIMEOUT_MS_FOR_THINKING);
    }
  });

  test("is case-insensitive", () => {
    expect(getTimeoutMSByModel("DALL-E-3")).toBe(
      REQUEST_TIMEOUT_MS_FOR_THINKING,
    );
    expect(getTimeoutMSByModel("O1-PREVIEW")).toBe(
      REQUEST_TIMEOUT_MS_FOR_THINKING,
    );
  });

  test("uses the default timeout for regular chat models", () => {
    expect(getTimeoutMSByModel("gpt-4")).toBe(REQUEST_TIMEOUT_MS);
    expect(getTimeoutMSByModel("gpt-3.5-turbo")).toBe(REQUEST_TIMEOUT_MS);
    expect(getTimeoutMSByModel("claude-3-opus")).toBe(REQUEST_TIMEOUT_MS);
  });
});

describe("showPlugins", () => {
  test("is enabled for OpenAI, Azure, Moonshot and ChatGLM", () => {
    expect(showPlugins(ServiceProvider.OpenAI, "gpt-4")).toBe(true);
    expect(showPlugins(ServiceProvider.Azure, "gpt-4")).toBe(true);
    expect(showPlugins(ServiceProvider.Moonshot, "moonshot-v1-8k")).toBe(true);
    expect(showPlugins(ServiceProvider.ChatGLM, "glm-4")).toBe(true);
  });

  test("is enabled for Anthropic except claude-2 models", () => {
    expect(showPlugins(ServiceProvider.Anthropic, "claude-3-opus")).toBe(true);
    expect(showPlugins(ServiceProvider.Anthropic, "claude-2.1")).toBe(false);
  });

  test("is enabled for Google except vision models", () => {
    expect(showPlugins(ServiceProvider.Google, "gemini-pro")).toBe(true);
    expect(showPlugins(ServiceProvider.Google, "gemini-pro-vision")).toBe(
      false,
    );
  });

  test("is disabled for other providers", () => {
    expect(showPlugins(ServiceProvider.Baidu, "ernie-bot")).toBe(false);
    expect(showPlugins(ServiceProvider.Tencent, "hunyuan")).toBe(false);
  });
});
