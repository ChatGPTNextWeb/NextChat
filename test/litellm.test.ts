/**
 * Tests for the LiteLLM provider platform.
 *
 * Covers: path resolution, message extraction, model listing,
 * error responses, and model string format consistency.
 */

// Mock the stores and config before importing the module
jest.mock("@/app/store", () => ({
  useAccessStore: {
    getState: () => ({
      useCustomConfig: true,
      litellmUrl: "http://localhost:4000",
      litellmApiKey: "sk-test-key",
    }),
  },
  useAppConfig: {
    getState: () => ({
      modelConfig: {
        model: "anthropic/claude-sonnet-4-6",
        temperature: 0.7,
        top_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
      },
    }),
  },
  useChatStore: {
    getState: () => ({
      currentSession: () => ({
        mask: {
          modelConfig: {},
          plugin: [],
        },
      }),
    }),
  },
  ChatMessageTool: {},
  usePluginStore: {
    getState: () => ({
      getAsTools: () => [[], []],
    }),
  },
}));

jest.mock("@/app/config/client", () => ({
  getClientConfig: () => ({
    isApp: false,
    buildMode: "standalone",
  }),
}));

jest.mock("@/app/client/api", () => ({
  getHeaders: () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer sk-test-key",
  }),
  LLMApi: class {},
}));

jest.mock("@/app/utils/chat", () => ({
  preProcessImageContent: jest.fn((content: any) => content),
  streamWithThink: jest.fn(),
}));

jest.mock("@/app/utils", () => ({
  getMessageTextContent: (msg: any) =>
    typeof msg.content === "string" ? msg.content : "",
  getMessageTextContentWithoutThinking: (msg: any) =>
    typeof msg.content === "string" ? msg.content : "",
  isVisionModel: () => false,
  getTimeoutMSByModel: () => 60000,
}));

jest.mock("@/app/utils/stream", () => ({
  fetch: jest.fn(),
}));

import { LiteLLMApi } from "@/app/client/platforms/litellm";
import { fetch as mockFetch } from "@/app/utils/stream";

describe("LiteLLMApi", () => {
  let api: LiteLLMApi;

  beforeEach(() => {
    api = new LiteLLMApi();
    jest.clearAllMocks();
  });

  describe("path()", () => {
    it("builds correct path with custom config URL", () => {
      const result = api.path("v1/chat/completions");
      expect(result).toBe("http://localhost:4000/v1/chat/completions");
    });

    it("strips trailing slash from base URL", () => {
      // Override access store to have trailing slash
      const store = require("@/app/store");
      const original = store.useAccessStore.getState;
      store.useAccessStore.getState = () => ({
        useCustomConfig: true,
        litellmUrl: "http://localhost:4000/",
        litellmApiKey: "sk-test",
      });

      const result = api.path("v1/models");
      expect(result).toBe("http://localhost:4000/v1/models");

      store.useAccessStore.getState = original;
    });
  });

  describe("extractMessage()", () => {
    it("extracts content from standard response", () => {
      const result = api.extractMessage({
        choices: [{ message: { content: "Hello world" } }],
      });
      expect(result).toBe("Hello world");
    });

    it("returns empty string for missing choices", () => {
      expect(api.extractMessage({})).toBe("");
      expect(api.extractMessage({ choices: [] })).toBe("");
    });

    it("returns empty string for null content", () => {
      const result = api.extractMessage({
        choices: [{ message: { content: null } }],
      });
      expect(result).toBe("");
    });
  });

  describe("models()", () => {
    it("fetches and parses model list from /v1/models", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: [
            { id: "anthropic/claude-sonnet-4-6", object: "model" },
            { id: "openai/gpt-4o", object: "model" },
            {
              id: "bedrock/anthropic.claude-sonnet-4-6-v1",
              object: "model",
            },
          ],
        }),
      };
      (mockFetch as jest.Mock).mockResolvedValue(mockResponse);

      const models = await api.models();

      expect(models).toHaveLength(3);
      expect(models[0].name).toBe("anthropic/claude-sonnet-4-6");
      expect(models[0].provider.id).toBe("litellm");
      expect(models[0].provider.providerName).toBe("LiteLLM");
      expect(models[1].name).toBe("openai/gpt-4o");
      expect(models[2].name).toBe("bedrock/anthropic.claude-sonnet-4-6-v1");
    });

    it("returns empty array on HTTP error", async () => {
      (mockFetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      const models = await api.models();
      expect(models).toEqual([]);
    });

    it("returns empty array when data is null", async () => {
      (mockFetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: null }),
      });

      const models = await api.models();
      expect(models).toEqual([]);
    });

    it("preserves provider/model format in model IDs", async () => {
      const litellmModels = [
        "anthropic/claude-sonnet-4-6",
        "openai/gpt-4o",
        "vertex_ai/gemini-2.5-flash",
        "bedrock/anthropic.claude-sonnet-4-6-v1",
        "groq/llama-4-scout-17b-16e-instruct",
        "mistral/mistral-large-latest",
      ];

      (mockFetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: litellmModels.map((id) => ({ id, object: "model" })),
        }),
      });

      const models = await api.models();
      for (let i = 0; i < litellmModels.length; i++) {
        expect(models[i].name).toBe(litellmModels[i]);
      }
    });
  });

  describe("usage()", () => {
    it("returns zero usage (not supported by LiteLLM proxy)", async () => {
      const usage = await api.usage();
      expect(usage).toEqual({ used: 0, total: 0 });
    });
  });

  describe("speech()", () => {
    it("throws not implemented error", () => {
      expect(() => api.speech({} as any)).toThrow("Method not implemented");
    });
  });

  describe("chat()", () => {
    it("sends correct payload for non-streaming", async () => {
      const mockResponse = {
        json: async () => ({
          choices: [
            { message: { role: "assistant", content: "4" } },
          ],
        }),
      };
      (mockFetch as jest.Mock).mockResolvedValue(mockResponse);

      const onFinish = jest.fn();
      const onError = jest.fn();

      await api.chat({
        messages: [{ role: "user", content: "What is 2+2?" }],
        config: {
          model: "anthropic/claude-sonnet-4-6",
          stream: false,
        },
        onFinish,
        onError,
        onUpdate: jest.fn(),
      } as any);

      expect(mockFetch).toHaveBeenCalled();
      const [url, opts] = (mockFetch as jest.Mock).mock.calls[0];
      expect(url).toContain("v1/chat/completions");

      const body = JSON.parse(opts.body);
      expect(body.model).toBe("anthropic/claude-sonnet-4-6");
      expect(body.stream).toBe(false);
      expect(body.messages).toHaveLength(1);
      expect(body.messages[0].role).toBe("user");
    });

    it("calls onError when fetch fails", async () => {
      (mockFetch as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      const onError = jest.fn();
      await api.chat({
        messages: [{ role: "user", content: "test" }],
        config: { model: "test-model", stream: false },
        onFinish: jest.fn(),
        onError,
        onUpdate: jest.fn(),
      } as any);

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
