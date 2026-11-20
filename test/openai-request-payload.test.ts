import { jest } from "@jest/globals";
import { ChatGPTApi } from "../app/client/platforms/openai";
import { ServiceProvider } from "../app/constant";

const fetchMock = jest.fn<typeof fetch>();

async function requestBodyFor(model: string) {
  fetchMock.mockClear();
  fetchMock.mockResolvedValue({
    json: async () => ({ choices: [{ message: { content: "ok" } }] }),
  } as Response);
  await new ChatGPTApi().chat({
    messages: [{ role: "user", content: "hello" }],
    config: {
      model,
      providerName: ServiceProvider.OpenAI,
      stream: false,
    },
    onFinish: jest.fn(),
    onError: jest.fn(),
  });
  const chatCall = fetchMock.mock.calls.find(([url]) =>
    String(url).includes("chat/completions"),
  );
  expect(chatCall).toBeDefined();
  return JSON.parse(String(chatCall?.[1]?.body));
}

describe("ChatGPTApi chat request body", () => {
  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  it.each(["gpt-5", "gpt-5.2", "gpt-5.4"])(
    "does not send top_p to %s, which rejects it",
    async (model) => {
      const body = await requestBodyFor(model);
      expect(body).not.toHaveProperty("top_p");
      expect(body.temperature).toBe(1);
    },
  );

  it.each(["gpt-4o", "gpt-4.1"])(
    "keeps sending the configured sampling parameters to %s",
    async (model) => {
      const body = await requestBodyFor(model);
      expect(body).toHaveProperty("top_p");
      expect(body).toHaveProperty("temperature");
    },
  );
});
