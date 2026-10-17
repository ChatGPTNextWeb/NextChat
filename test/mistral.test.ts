import { jest as jestApi } from "@jest/globals";
import {
  ApiPath,
  DEFAULT_MODELS,
  ModelProvider,
  ServiceProvider,
} from "../app/constant";
const jest = jestApi;
const stream = jest.fn();
// Isolate transport wiring here; the browser check exercises real SSE handling.
jest.unstable_mockModule("@/app/utils/chat", () => ({
  stream,
  streamWithThink: jest.fn(),
  compressImage: jest.fn(),
  preProcessImageContentBase: jest.fn(),
  preProcessImageContent: jest.fn(),
  preProcessImageContentForAlibabaDashScope: jest.fn(),
  cacheImageToBase64Image: jest.fn(),
  base64Image2Blob: jest.fn(),
  uploadImage: jest.fn(),
  removeImage: jest.fn(),
}));
const { ClientApi, getClientApi, getHeaders } = await import(
  "../app/client/api"
);
const { MistralApi } = await import("../app/client/platforms/mistral");
const { useAccessStore, useAppConfig, useChatStore } = await import(
  "../app/store"
);

describe("Mistral provider", () => {
  const api = new MistralApi();
  const accessState = useAccessStore.getState();
  const configState = useAppConfig.getState();
  const chatState = useChatStore.getState();

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    useAccessStore.setState({
      ...accessState,
      useCustomConfig: false,
      needCode: false,
      mistralApiKey: "mistral-test-key",
      openaiApiKey: "openai-test-key",
    });
    const session = chatState.currentSession();
    useChatStore.setState({
      ...chatState,
      sessions: [
        {
          ...session,
          mask: {
            ...session.mask,
            modelConfig: {
              ...session.mask.modelConfig,
              model: "mistral-large-latest",
              providerName: ServiceProvider.Mistral,
              temperature: 2,
              max_tokens: 1234,
            },
          },
        },
      ],
      currentSessionIndex: 0,
    });
    (global.fetch as jest.Mock).mockClear();
    (stream as jest.Mock).mockClear();
  });

  afterEach(() => {
    useAccessStore.setState(accessState);
    useAppConfig.setState(configState);
    useChatStore.setState(chatState);
    document.head.querySelector("meta[name='config']")?.remove();
    jest.restoreAllMocks();
  });

  test("dispatches both provider factories to Mistral", () => {
    expect(new ClientApi(ModelProvider.Mistral).llm).toBeInstanceOf(MistralApi);
    expect(getClientApi(ServiceProvider.Mistral).llm).toBeInstanceOf(
      MistralApi,
    );
  });

  test("uses the same-origin proxy on the web", () => {
    expect(api.path("v1/chat/completions")).toBe(
      `${ApiPath.Mistral}/v1/chat/completions`,
    );
  });

  test.each([
    ["https://mistral.example.com/", "https://mistral.example.com"],
    ["mistral.example.com", "https://mistral.example.com"],
    ["/api/mistral", "/api/mistral"],
  ])("uses the custom Mistral endpoint %s", (mistralUrl, expected) => {
    useAccessStore.setState({ useCustomConfig: true, mistralUrl });
    expect(api.path("v1/chat/completions")).toBe(
      `${expected}/v1/chat/completions`,
    );
  });

  test("ignores a custom endpoint when custom configuration is disabled", () => {
    useAccessStore.setState({ mistralUrl: "https://unused.example.com" });
    expect(api.path("v1/chat/completions")).toBe(
      "/api/mistral/v1/chat/completions",
    );
  });

  test("uses the direct endpoint in the desktop app", () => {
    const meta = document.createElement("meta");
    meta.name = "config";
    meta.content = JSON.stringify({ isApp: true });
    document.head.appendChild(meta);
    expect(api.path("v1/chat/completions")).toBe(
      "https://api.mistral.ai/v1/chat/completions",
    );
  });

  test("selects the Mistral key without leaking the OpenAI key", () => {
    expect(getHeaders().Authorization).toBe("Bearer mistral-test-key");
    expect(useAccessStore.getState().isValidMistral()).toBeTruthy();
  });

  test("falls back to an access code, not another provider's key", () => {
    useAccessStore.setState({
      mistralApiKey: "",
      needCode: true,
      accessCode: "test-code",
    });
    expect(getHeaders().Authorization).toBe("Bearer nk-test-code");
  });

  test("includes selectable Mistral models", async () => {
    const models = await api.models();
    expect(models.length).toBeGreaterThan(0);
    expect(models.every((m) => m.provider.providerName === "Mistral")).toBe(
      true,
    );
    expect(DEFAULT_MODELS).toEqual(expect.arrayContaining(models));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test.each([
    ["hello", "hello"],
    [
      [
        { type: "text", text: "hello" },
        { type: "text", text: " world" },
      ],
      "hello world",
    ],
    [null, ""],
  ])("extracts text from completion content %j", (content, expected) => {
    expect(api.extractMessage({ choices: [{ message: { content } }] })).toBe(
      expected,
    );
  });

  test("sends text messages, supported parameters, and the correct key", async () => {
    const response = {
      ok: true,
      json: async () => ({ choices: [{ message: { content: "Bonjour" } }] }),
    } as Response;
    (global.fetch as jest.Mock).mockResolvedValueOnce(response);
    const onFinish = jest.fn();
    await api.chat({
      messages: [{ role: "user", content: "Hello" }],
      config: { model: "mistral-large-latest", providerName: "Mistral" },
      onFinish,
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/mistral/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer mistral-test-key",
        }),
        signal: expect.any(AbortSignal),
      }),
    );
    const payload = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[0][1].body,
    );
    expect(payload).toMatchObject({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: "Hello" }],
      temperature: 1.5,
      max_tokens: 1234,
    });
    expect(onFinish).toHaveBeenCalledWith("Bonjour", response);
  });

  test("reports non-streaming upstream errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ message: "Rate limit exceeded" }),
    });
    const onError = jest.fn();
    const onFinish = jest.fn();
    await api.chat({
      messages: [{ role: "user", content: "Hello" }],
      config: { model: "mistral-large-latest" },
      onFinish,
      onError,
    });
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Rate limit exceeded" }),
    );
    expect(onFinish).not.toHaveBeenCalled();
  });

  test("reports network errors and clears the request timer", async () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Offline"));
    const onError = jest.fn();
    await api.chat({
      messages: [],
      config: { model: "mistral-large-latest" },
      onFinish: jest.fn(),
      onError,
    });
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Offline" }),
    );
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  test("reuses streaming with text chunks, usage-only events, and tool fragments", async () => {
    await api.chat({
      messages: [{ role: "user", content: "Hello" }],
      config: { model: "mistral-large-latest", stream: true },
      onFinish: jest.fn(),
    });
    expect(stream).toHaveBeenCalledTimes(1);
    const [, payload, headers, , , controller, parse, processTools] = (
      stream as jest.Mock
    ).mock.calls[0];
    expect(payload.stream).toBe(true);
    expect(headers.Authorization).toBe("Bearer mistral-test-key");
    expect(controller).toBeInstanceOf(AbortController);
    const tools: any[] = [];
    expect(parse(JSON.stringify({ choices: [] }), tools)).toBe("");
    expect(
      parse(
        JSON.stringify({
          choices: [
            { delta: { content: [{ type: "text", text: "Bonjour" }] } },
          ],
        }),
        tools,
      ),
    ).toBe("Bonjour");
    parse(
      JSON.stringify({
        choices: [
          {
            delta: {
              tool_calls: [
                {
                  index: 0,
                  id: "call00001",
                  type: "function",
                  function: { name: "first", arguments: "{" },
                },
                {
                  index: 1,
                  id: "call00002",
                  type: "function",
                  function: { name: "second", arguments: "{}" },
                },
              ],
            },
          },
        ],
      }),
      tools,
    );
    parse(
      JSON.stringify({
        choices: [
          {
            delta: {
              tool_calls: [
                { index: 0, id: "call00001", function: { arguments: "}" } },
              ],
            },
          },
        ],
      }),
      tools,
    );
    expect(tools.map((t) => t.function.arguments)).toEqual(["{}", "{}"]);
    const toolMessage = { role: "assistant", tool_calls: tools };
    const toolResults = [
      { role: "tool", content: "result", tool_call_id: "call00001" },
    ];
    processTools(payload, toolMessage, toolResults);
    expect(payload.messages.slice(-2)).toEqual([toolMessage, ...toolResults]);
  });

  test("exposes cancellation for non-streaming requests", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: "done" } }] }),
    });
    const onController = jest.fn();
    await api.chat({
      messages: [],
      config: { model: "mistral-large-latest" },
      onFinish: jest.fn(),
      onController,
    });
    const controller = onController.mock.calls[0][0] as AbortController;
    controller.abort();
    expect((global.fetch as jest.Mock).mock.calls[0][1].signal.aborted).toBe(
      true,
    );
  });

  test("does not send unsupported billing or speech requests", async () => {
    expect(await api.usage()).toEqual({ used: 0, total: 0 });
    await expect(
      api.speech({ model: "tts-1", input: "hello", voice: "alloy" }),
    ).rejects.toThrow("Mistral");
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
