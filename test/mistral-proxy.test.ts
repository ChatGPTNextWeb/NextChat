/** @jest-environment node */
import { jest as jestApi } from "@jest/globals";
import { NextRequest } from "next/server";
import md5 from "spark-md5";

const jest = jestApi;
jest.unstable_mockModule("@/app/config/server", () => ({
  getServerSideConfig: jest.fn(),
}));
const { handle } = await import("../app/api/mistral");
const { getServerSideConfig } = await import("../app/config/server");
const { POST } = await import("../app/api/[provider]/[...path]/route");

describe("Mistral proxy", () => {
  const params = { path: ["v1", "chat", "completions"] };
  let config: ReturnType<typeof getServerSideConfig>;

  function request(
    body: unknown = { model: "mistral-large-latest", messages: [] },
    token = "Bearer user-key",
    path = "v1/chat/completions",
  ) {
    return new NextRequest(`http://localhost/api/mistral/${path}`, {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    config = {
      codes: new Set(),
      needCode: false,
      hideUserApiKey: false,
      mistralApiKey: "server-mistral-key",
      apiKey: "server-openai-key",
      customModels: "",
    } as ReturnType<typeof getServerSideConfig>;
    (getServerSideConfig as jest.Mock).mockReturnValue(config);
    (global.fetch as jest.Mock).mockReset();
    (global.fetch as jest.Mock).mockImplementation(async () =>
      Response.json({ choices: [] }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("dispatches the provider route and forwards the user's Mistral key", async () => {
    const response = await POST(request(), {
      params: { provider: "mistral", ...params },
    });
    expect(response.status).toBe(200);
    await response.text();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.mistral.ai/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer user-key" }),
        redirect: "manual",
      }),
    );
  });

  test("injects only the Mistral server key for a valid access code", async () => {
    config.needCode = true;
    config.codes = new Set([md5.hash("test-code")]);
    const response = await handle(request(undefined, "Bearer nk-test-code"), {
      params,
    });
    await response.text();
    expect(
      (global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization,
    ).toBe("Bearer server-mistral-key");
  });

  test("rejects an invalid access code without contacting upstream", async () => {
    config.needCode = true;
    const response = await handle(request(undefined, "Bearer nk-wrong"), {
      params,
    });
    expect(response.status).toBe(401);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("honors HIDE_USER_API_KEY", async () => {
    config.hideUserApiKey = true;
    const response = await handle(request(), { params });
    expect(response.status).toBe(401);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("does not forward the access code when no Mistral server key is set", async () => {
    config.mistralApiKey = "";
    const response = await handle(request(undefined, ""), { params });
    expect(response.status).toBe(401);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test.each(["{", "null", "[]", "{}", '{"model":42}', '{"model":""}'])(
    "rejects invalid chat JSON %s before contacting upstream",
    async (body) => {
      const response = await handle(request(body), { params });
      expect(response.status).toBe(400);
      expect(global.fetch).not.toHaveBeenCalled();
    },
  );

  test("enforces provider-qualified CUSTOM_MODELS restrictions", async () => {
    config.customModels = "-mistral-large-latest@mistral";
    const response = await handle(request(), { params });
    expect(response.status).toBe(403);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("allows a configured custom Mistral model", async () => {
    config.customModels = "-all,+custom-model@mistral";
    const response = await handle(
      request({ model: "custom-model", messages: [] }),
      { params },
    );
    expect(response.status).toBe(200);
    await response.text();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("does not forward unsupported paths", async () => {
    const response = await handle(
      request(undefined, "Bearer user-key", "v1/files"),
      {
        params: { path: ["v1", "files"] },
      },
    );
    expect(response.status).toBe(404);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("joins a custom upstream base URL without a duplicate slash", async () => {
    config.mistralUrl = "http://localhost:9999/";
    const response = await handle(request(), { params });
    await response.text();
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(
      "http://localhost:9999/v1/chat/completions",
    );
  });

  test("preserves upstream errors without a browser authentication prompt", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      Response.json(
        { message: "Rate limited" },
        {
          status: 429,
          headers: { "Retry-After": "5", "WWW-Authenticate": "Bearer" },
        },
      ),
    );
    const response = await handle(request(), { params });
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("5");
    expect(response.headers.has("WWW-Authenticate")).toBe(false);
    expect(await response.json()).toEqual({ message: "Rate limited" });
  });

  test("streams SSE unchanged and disables proxy buffering", async () => {
    const sse =
      'data: {"choices":[{"delta":{"content":"Bonjour"}}]}\n\ndata: [DONE]\n\n';
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(sse, { headers: { "Content-Type": "text/event-stream" } }),
    );
    const response = await handle(request(), { params });
    expect(response.headers.get("X-Accel-Buffering")).toBe("no");
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");
    expect(await response.text()).toBe(sse);
  });

  test("reports transport failures as a gateway error, not HTTP 200", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Offline"));
    const response = await handle(request(), { params });
    expect(response.status).toBe(502);
    expect(await response.json()).toHaveProperty("error");
  });

  test("does not forward stale compressed-body headers", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("decoded body", {
        headers: { "Content-Encoding": "gzip", "Content-Length": "99" },
      }),
    );
    const response = await handle(request(), { params });
    expect(response.headers.has("Content-Encoding")).toBe(false);
    expect(response.headers.has("Content-Length")).toBe(false);
    expect(await response.text()).toBe("decoded body");
  });

  test("preserves the original chat payload after model validation", async () => {
    const body =
      ' { "model": "mistral-large-latest", "messages": [], "stream": true } ';
    const response = await handle(request(body), { params });
    await response.text();
    expect((global.fetch as jest.Mock).mock.calls[0][1].body).toBe(body);
  });

  test("rejects GET requests even on the chat path", async () => {
    const response = await handle(
      new NextRequest("http://localhost/api/mistral/v1/chat/completions"),
      { params },
    );
    expect(response.status).toBe(404);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("keeps client cancellation connected after receiving upstream headers", async () => {
    const controller = new AbortController();
    const req = new NextRequest(request(), { signal: controller.signal });
    const response = await handle(req, { params });
    const upstreamSignal = (global.fetch as jest.Mock).mock.calls[0][1].signal;
    expect(upstreamSignal.aborted).toBe(false);
    controller.abort();
    expect(upstreamSignal.aborted).toBe(true);
    await response.body?.cancel();
  });

  test("cancels the upstream body when the downstream reader cancels", async () => {
    const cancel = jest.fn<(reason?: unknown) => void>();
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(new ReadableStream({ cancel })),
    );
    const response = await handle(request(), { params });
    await response.body?.cancel("reader stopped");
    expect(cancel).toHaveBeenCalledWith("reader stopped");
    expect((global.fetch as jest.Mock).mock.calls[0][1].signal.aborted).toBe(
      true,
    );
  });

  test("times out a stalled upstream request and releases the timer", async () => {
    jest.useFakeTimers();
    try {
      (global.fetch as jest.Mock).mockImplementationOnce(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener("abort", () =>
              reject(new Error("aborted")),
            );
          }),
      );
      const pending = handle(request(), { params });
      await jest.advanceTimersByTimeAsync(10 * 60 * 1000);
      const response = await pending;
      expect(response.status).toBe(504);
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
});
