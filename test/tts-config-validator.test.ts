import {
  DEFAULT_TTS_MODEL,
  DEFAULT_TTS_VOICE,
  StoreKey,
} from "../app/constant";

// app/store/config.ts participates in an import cycle, so a static import can
// hit a temporal-dead-zone error. Load it dynamically in beforeAll instead.
let TTSConfigValidator: {
  engine: (x: string) => string;
  model: (x: string) => string;
  voice: (x: string) => string;
  speed: (x: number) => number;
};
let useAppConfig: (typeof import("../app/store/config"))["useAppConfig"];

beforeAll(async () => {
  // Warm up the import cycle in a working order before loading the target.
  await import("../app/client/api");
  ({ TTSConfigValidator, useAppConfig } = await import("../app/store/config"));
});

describe("TTSConfigValidator", () => {
  test("speed clamps to [0.25, 4.0] and defaults to 1.0 on NaN", () => {
    expect(TTSConfigValidator.speed(0.1)).toBe(0.25);
    expect(TTSConfigValidator.speed(10)).toBe(4.0);
    expect(TTSConfigValidator.speed(2)).toBe(2);
    expect(TTSConfigValidator.speed(NaN)).toBe(1.0);
  });

  test("engine passes the value through unchanged", () => {
    expect(TTSConfigValidator.engine("OpenAI-TTS")).toBe("OpenAI-TTS");
  });

  test("model passes the value through unchanged", () => {
    expect(TTSConfigValidator.model("tts-1")).toBe("tts-1");
  });

  test("voice passes the value through unchanged", () => {
    expect(TTSConfigValidator.voice("alloy")).toBe("alloy");
  });

  test("model and voice accept any name, trimmed", () => {
    expect(TTSConfigValidator.model(" my-speech-model ")).toBe(
      "my-speech-model",
    );
    expect(TTSConfigValidator.voice(" my-voice ")).toBe("my-voice");
  });

  test("model and voice fall back to the defaults when empty", () => {
    expect(TTSConfigValidator.model("")).toBe(DEFAULT_TTS_MODEL);
    expect(TTSConfigValidator.model("   ")).toBe(DEFAULT_TTS_MODEL);
    expect(TTSConfigValidator.voice("")).toBe(DEFAULT_TTS_VOICE);
    expect(TTSConfigValidator.voice("   ")).toBe(DEFAULT_TTS_VOICE);
  });
});

describe("ttsConfig persistence", () => {
  test("a custom model and voice survive a save and reload", async () => {
    await useAppConfig.persist.rehydrate();
    useAppConfig.getState().update((config) => {
      config.ttsConfig.model = "my-speech-model";
      config.ttsConfig.voice = "my-voice";
    });
    const saved = localStorage.getItem(StoreKey.Config) as string;
    expect(JSON.parse(saved).state.ttsConfig).toMatchObject({
      model: "my-speech-model",
      voice: "my-voice",
    });

    useAppConfig.getState().reset();
    expect(useAppConfig.getState().ttsConfig.model).toBe(DEFAULT_TTS_MODEL);

    localStorage.setItem(StoreKey.Config, saved);
    await useAppConfig.persist.rehydrate();
    expect(useAppConfig.getState().ttsConfig).toMatchObject({
      model: "my-speech-model",
      voice: "my-voice",
    });
  });
});
