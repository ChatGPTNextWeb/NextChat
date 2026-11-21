import { jest } from "@jest/globals";
import { TextDecoder, TextEncoder } from "util";
import { ChatGPTApi } from "../app/client/platforms/openai";
import { XAIApi } from "../app/client/platforms/xai";
import { ServiceProvider } from "../app/constant";

const fetchMock = jest.fn<typeof fetch>();

const PARTIAL = "The answer starts here and then";
const events = [
  { choices: [{ delta: { content: PARTIAL } }] },
  { error: { message: "upstream overloaded", type: "server_error" } },
];

// An event stream that ends without [DONE], as a provider does when it fails mid-answer.
function eventStreamResponse(payloads: unknown[]) {
  const chunks = payloads.map((payload) =>
    new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`),
  );
  return {
    ok: true,
    status: 200,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "content-type" ? "text/event-stream" : null,
    },
    body: {
      getReader: () => {
        let next = 0;
        return {
          read: async () =>
            next < chunks.length
              ? { done: false, value: chunks[next++] }
              : { done: true, value: undefined },
          releaseLock: () => undefined,
          cancel: async () => undefined,
        };
      },
    },
  } as unknown as Response;
}

function streamFinishedWith(
  api: ChatGPTApi | XAIApi,
  providerName: string,
  payloads: unknown[] = events,
) {
  fetchMock.mockResolvedValue(eventStreamResponse(payloads));
  return new Promise<string>((resolve) => {
    api.chat({
      messages: [{ role: "user", content: "hello" }],
      config: { model: "test-model", providerName, stream: true },
      onUpdate: jest.fn(),
      onFinish: (message: string) => resolve(message),
      onError: (error: Error) => resolve(`onError: ${error.message}`),
      onController: jest.fn(),
    } as Parameters<ChatGPTApi["chat"]>[0]);
  });
}

describe("a provider error event in the middle of a stream", () => {
  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    // jsdom has no TextDecoder, which the event stream parser needs.
    Object.assign(global, { TextDecoder });
    jest.spyOn(console, "log").mockImplementation(() => undefined);
    jest.spyOn(console, "debug").mockImplementation(() => undefined);
  });

  it.each([
    [
      "streamWithThink (OpenAI)",
      () => streamFinishedWith(new ChatGPTApi(), ServiceProvider.OpenAI),
    ],
    [
      "stream (xAI)",
      () => streamFinishedWith(new XAIApi(), ServiceProvider.XAI),
    ],
  ])("is shown with the partial answer by %s", async (_name, run) => {
    const message = await run();
    expect(message).toContain(PARTIAL);
    expect(message).toContain("upstream overloaded");
  });

  it("is not reported for chunks that merely carry an empty error field", async () => {
    const message = await streamFinishedWith(
      new ChatGPTApi(),
      ServiceProvider.OpenAI,
      [
        { choices: [{ delta: { content: PARTIAL } }], error: null },
        { choices: [{ delta: { content: " done." } }], error: {} },
      ],
    );
    expect(message).toBe(`${PARTIAL} done.`);
  });
});
