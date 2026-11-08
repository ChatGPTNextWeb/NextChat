import { jest } from "@jest/globals";
import {
  ApiPath,
  DEFAULT_MODELS,
  ModelProvider,
  RUNCRATE_BASE_URL,
  Runcrate,
  ServiceProvider,
} from "../app/constant";
import { RuncrateApi } from "../app/client/platforms/runcrate";
import { useAccessStore } from "../app/store/access";

describe("Runcrate provider", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
    useAccessStore.setState({
      useCustomConfig: false,
      runcrateUrl: ApiPath.Runcrate,
    });
  });

  test("registers built-in models under the Runcrate provider", () => {
    const models = DEFAULT_MODELS.filter((m) => m.provider.id === "runcrate");
    expect(models.length).toBeGreaterThan(0);
    for (const m of models) {
      expect(m.available).toBe(true);
      expect(m.provider.providerName).toBe(ServiceProvider.Runcrate);
      expect(m.provider.providerType).toBe("runcrate");
    }
  });

  test("uses the OpenAI-compatible v1 paths on api.runcrate.ai", () => {
    expect(RUNCRATE_BASE_URL).toBe("https://api.runcrate.ai");
    expect(Runcrate.ChatPath).toBe("v1/chat/completions");
    expect(Runcrate.ListModelPath).toBe("v1/models");
    expect(ModelProvider.Runcrate).toBe("Runcrate");
  });

  test("path() goes through the local proxy route by default", () => {
    const api = new RuncrateApi();
    expect(api.path(Runcrate.ChatPath)).toBe(
      `${ApiPath.Runcrate}/${Runcrate.ChatPath}`,
    );
  });

  test("path() honors a custom endpoint and normalizes it", () => {
    useAccessStore.setState({
      useCustomConfig: true,
      runcrateUrl: "my-gateway.example.com/",
    });
    const api = new RuncrateApi();
    expect(api.path(Runcrate.ChatPath)).toBe(
      `https://my-gateway.example.com/${Runcrate.ChatPath}`,
    );
  });

  test("models() keeps only text-in, text-out models", async () => {
    const payload = {
      object: "list",
      data: [
        {
          id: "org/chat-model",
          object: "model",
          input_modalities: ["text"],
          output_modalities: ["text"],
        },
        {
          id: "org/vision-chat-model",
          object: "model",
          input_modalities: ["text", "image"],
          output_modalities: ["text"],
        },
        {
          id: "org/speech-to-text",
          object: "model",
          input_modalities: ["audio"],
          output_modalities: ["text"],
        },
        {
          id: "org/image-generator",
          object: "model",
          input_modalities: ["text"],
          output_modalities: ["image"],
        },
      ],
    };
    const fetchMock = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(payload) } as Response),
    );
    const originalFetch = global.fetch;
    global.fetch = fetchMock as unknown as typeof fetch;
    try {
      const models = await new RuncrateApi().models();
      expect(models.map((m) => m.name)).toEqual([
        "org/chat-model",
        "org/vision-chat-model",
      ]);
      expect(models[0].provider?.providerName).toBe("Runcrate");
      const urls = (fetchMock.mock.calls as unknown as [string][]).map(
        ([url]) => url,
      );
      expect(urls).toContain(`${ApiPath.Runcrate}/${Runcrate.ListModelPath}`);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("server config reads RUNCRATE_API_KEY and RUNCRATE_URL", async () => {
    process.env = {
      ...originalEnv,
      RUNCRATE_API_KEY: "rc-key",
      RUNCRATE_URL: "https://proxy.example.com",
    };
    const { getServerSideConfig } = await import("../app/config/server");
    const config = getServerSideConfig();
    expect(config.isRuncrate).toBe(true);
    expect(config.runcrateApiKey).toBe("rc-key");
    expect(config.runcrateUrl).toBe("https://proxy.example.com");
  });

  test("server config reports Runcrate as disabled without a key", async () => {
    const env = { ...originalEnv };
    delete env.RUNCRATE_API_KEY;
    process.env = env;
    const { getServerSideConfig } = await import("../app/config/server");
    expect(getServerSideConfig().isRuncrate).toBe(false);
  });
});
