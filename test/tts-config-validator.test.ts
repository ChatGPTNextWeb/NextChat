// app/store/config.ts participates in an import cycle, so a static import can
// hit a temporal-dead-zone error. Load it dynamically in beforeAll instead.
let TTSConfigValidator: {
  engine: (x: string) => string;
  model: (x: string) => string;
  voice: (x: string) => string;
  speed: (x: number) => number;
};

beforeAll(async () => {
  // Warm up the import cycle in a working order before loading the target.
  await import("../app/client/api");
  ({ TTSConfigValidator } = await import("../app/store/config"));
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
});
