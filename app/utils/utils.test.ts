import {
  trimTopic,
  isDalle3,
  getTimeoutMSByModel,
  getModelSizes,
  supportsCustomSize,
  showPlugins,
  getMessageTextContent,
  getMessageTextContentWithoutThinking,
  getMessageImages,
  semverCompare,
  getOperationId,
} from "../../app/utils";
import { ServiceProvider } from "../../app/constant";

describe("trimTopic", () => {
  test("should remove trailing punctuation", () => {
    expect(trimTopic("Hello World,")).toBe("Hello World");
    expect(trimTopic("Test。")).toBe("Test");
    expect(trimTopic("Question?")).toBe("Question");
  });

  test("should remove quotes from both ends", () => {
    expect(trimTopic('"Hello"')).toBe("Hello");
    expect(trimTopic('"""Test"""')).toBe("Test");
  });

  test("should remove asterisks", () => {
    expect(trimTopic("**Bold**")).toBe("Bold");
    expect(trimTopic("***Test***")).toBe("Test");
  });

  test("should handle empty string", () => {
    expect(trimTopic("")).toBe("");
  });

  test("should handle string with only punctuation", () => {
    expect(trimTopic("...")).toBe("");
  });

  test("should not remove punctuation from middle", () => {
    expect(trimTopic("Hello, World")).toBe("Hello, World");
  });
});

describe("isDalle3", () => {
  test("should return true for dall-e-3", () => {
    expect(isDalle3("dall-e-3")).toBe(true);
  });

  test("should return false for other models", () => {
    expect(isDalle3("dall-e-2")).toBe(false);
    expect(isDalle3("gpt-4")).toBe(false);
    expect(isDalle3("")).toBe(false);
  });
});

describe("getTimeoutMSByModel", () => {
  test("should return extended timeout for dall-e models", () => {
    expect(getTimeoutMSByModel("dall-e-3")).toBe(300000);
    expect(getTimeoutMSByModel("dalle-2")).toBe(300000);
  });

  test("should return extended timeout for o1 models", () => {
    expect(getTimeoutMSByModel("o1-preview")).toBe(300000);
    expect(getTimeoutMSByModel("o3-mini")).toBe(300000);
  });

  test("should return extended timeout for deepseek-r models", () => {
    expect(getTimeoutMSByModel("deepseek-r1")).toBe(300000);
  });

  test("should return extended timeout for thinking models", () => {
    expect(getTimeoutMSByModel("gpt-4-thinking")).toBe(300000);
  });

  test("should return normal timeout for regular models", () => {
    expect(getTimeoutMSByModel("gpt-4")).toBe(60000);
    expect(getTimeoutMSByModel("claude-3")).toBe(60000);
  });

  test("should be case insensitive", () => {
    expect(getTimeoutMSByModel("DALL-E-3")).toBe(300000);
    expect(getTimeoutMSByModel("GPT-4")).toBe(60000);
  });
});

describe("getModelSizes", () => {
  test("should return sizes for dall-e-3", () => {
    const sizes = getModelSizes("dall-e-3");
    expect(sizes).toEqual(["1024x1024", "1792x1024", "1024x1792"]);
  });

  test("should return sizes for cogview models", () => {
    const sizes = getModelSizes("cogview-3");
    expect(sizes).toContain("1024x1024");
    expect(sizes.length).toBeGreaterThan(3);
  });

  test("should return empty array for unsupported models", () => {
    expect(getModelSizes("gpt-4")).toEqual([]);
    expect(getModelSizes("claude-3")).toEqual([]);
  });

  test("should be case insensitive for cogview", () => {
    const sizes = getModelSizes("CogView-3");
    expect(sizes.length).toBeGreaterThan(0);
  });
});

describe("supportsCustomSize", () => {
  test("should return true for models with custom sizes", () => {
    expect(supportsCustomSize("dall-e-3")).toBe(true);
    expect(supportsCustomSize("cogview-3")).toBe(true);
  });

  test("should return false for models without custom sizes", () => {
    expect(supportsCustomSize("gpt-4")).toBe(false);
    expect(supportsCustomSize("claude-3")).toBe(false);
  });
});

describe("showPlugins", () => {
  test("should return true for OpenAI", () => {
    expect(showPlugins(ServiceProvider.OpenAI, "gpt-4")).toBe(true);
  });

  test("should return true for Azure", () => {
    expect(showPlugins(ServiceProvider.Azure, "gpt-4")).toBe(true);
  });

  test("should return true for Moonshot", () => {
    expect(showPlugins(ServiceProvider.Moonshot, "moonshot-v1")).toBe(true);
  });

  test("should return true for ChatGLM", () => {
    expect(showPlugins(ServiceProvider.ChatGLM, "glm-4")).toBe(true);
  });

  test("should return true for Anthropic non-claude-2", () => {
    expect(showPlugins(ServiceProvider.Anthropic, "claude-3")).toBe(true);
  });

  test("should return false for Anthropic claude-2", () => {
    expect(showPlugins(ServiceProvider.Anthropic, "claude-2")).toBe(false);
  });

  test("should return true for Google non-vision", () => {
    expect(showPlugins(ServiceProvider.Google, "gemini-pro")).toBe(true);
  });

  test("should return false for Google vision", () => {
    expect(showPlugins(ServiceProvider.Google, "gemini-vision")).toBe(false);
  });

  test("should return false for other providers", () => {
    expect(showPlugins(ServiceProvider.Baidu, "ernie")).toBe(false);
  });
});

describe("getMessageTextContent", () => {
  test("should return string content directly", () => {
    const message = { role: "user" as const, content: "Hello" };
    expect(getMessageTextContent(message)).toBe("Hello");
  });

  test("should extract text from multimodal content", () => {
    const message = {
      role: "user" as const,
      content: [
        { type: "text" as const, text: "Hello" },
        {
          type: "image_url" as const,
          image_url: { url: "http://example.com" },
        },
      ],
    };
    expect(getMessageTextContent(message)).toBe("Hello");
  });

  test("should return empty string if no text content", () => {
    const message = {
      role: "user" as const,
      content: [
        {
          type: "image_url" as const,
          image_url: { url: "http://example.com" },
        },
      ],
    };
    expect(getMessageTextContent(message)).toBe("");
  });

  test("should handle empty content array", () => {
    const message = { role: "user" as const, content: [] };
    expect(getMessageTextContent(message)).toBe("");
  });
});

describe("getMessageTextContentWithoutThinking", () => {
  test("should filter out thinking lines", () => {
    const message = {
      role: "user" as const,
      content: "Normal text\n> Thinking...\nMore text",
    };
    expect(getMessageTextContentWithoutThinking(message)).toBe(
      "Normal text\nMore text",
    );
  });

  test("should handle content without thinking", () => {
    const message = { role: "user" as const, content: "Just normal text" };
    expect(getMessageTextContentWithoutThinking(message)).toBe(
      "Just normal text",
    );
  });

  test("should handle multimodal content", () => {
    const message = {
      role: "user" as const,
      content: [{ type: "text" as const, text: "Hello\n> thinking\nWorld" }],
    };
    expect(getMessageTextContentWithoutThinking(message)).toBe("Hello\nWorld");
  });

  test("should remove empty lines", () => {
    const message = {
      role: "user" as const,
      content: "Line1\n\n\nLine2",
    };
    expect(getMessageTextContentWithoutThinking(message)).toBe("Line1\nLine2");
  });
});

describe("getMessageImages", () => {
  test("should extract image URLs from multimodal content", () => {
    const message = {
      role: "user" as const,
      content: [
        { type: "text" as const, text: "Hello" },
        { type: "image_url" as const, image_url: { url: "http://img1.com" } },
        { type: "image_url" as const, image_url: { url: "http://img2.com" } },
      ],
    };
    const urls = getMessageImages(message);
    expect(urls).toEqual(["http://img1.com", "http://img2.com"]);
  });

  test("should return empty array for string content", () => {
    const message = { role: "user" as const, content: "Hello" };
    expect(getMessageImages(message)).toEqual([]);
  });

  test("should return empty array if no images", () => {
    const message = {
      role: "user" as const,
      content: [{ type: "text" as const, text: "Hello" }],
    };
    expect(getMessageImages(message)).toEqual([]);
  });

  test("should handle missing image_url", () => {
    const message = {
      role: "user" as const,
      content: [{ type: "image_url" as const }],
    };
    const urls = getMessageImages(message);
    expect(urls).toEqual([""]);
  });
});

describe("semverCompare", () => {
  test("should compare versions correctly", () => {
    expect(semverCompare("1.0.0", "2.0.0")).toBeLessThan(0);
    expect(semverCompare("2.0.0", "1.0.0")).toBeGreaterThan(0);
    expect(semverCompare("1.0.0", "1.0.0")).toBe(0);
  });

  test("should handle pre-release versions", () => {
    expect(semverCompare("1.0.0-alpha", "1.0.0")).toBeLessThan(0);
    expect(semverCompare("1.0.0", "1.0.0-alpha")).toBeGreaterThan(0);
  });

  test("should handle patch versions", () => {
    expect(semverCompare("1.0.1", "1.0.2")).toBeLessThan(0);
    expect(semverCompare("1.0.10", "1.0.2")).toBeGreaterThan(0);
  });

  test("should handle minor versions", () => {
    expect(semverCompare("1.1.0", "1.2.0")).toBeLessThan(0);
    expect(semverCompare("1.10.0", "1.2.0")).toBeGreaterThan(0);
  });

  test("should handle major versions", () => {
    expect(semverCompare("2.0.0", "10.0.0")).toBeLessThan(0);
  });
});

describe("getOperationId", () => {
  test("should return operationId if provided", () => {
    const op = { operationId: "customId", method: "GET", path: "/test" };
    expect(getOperationId(op)).toBe("customId");
  });

  test("should generate ID from method and path", () => {
    const op = { method: "GET", path: "/users/list" };
    expect(getOperationId(op)).toBe("GET_users_list");
  });

  test("should handle POST method", () => {
    const op = { method: "post", path: "/create" };
    expect(getOperationId(op)).toBe("POST_create");
  });

  test("should replace slashes with underscores", () => {
    const op = { method: "GET", path: "/api/v1/users" };
    expect(getOperationId(op)).toBe("GET_api_v1_users");
  });

  test("should handle root path", () => {
    const op = { method: "GET", path: "/" };
    expect(getOperationId(op)).toBe("GET_");
  });
});
