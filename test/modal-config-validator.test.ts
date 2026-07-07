// app/store/config.ts participates in an import cycle, so a static import can
// hit a temporal-dead-zone error. Load it dynamically in beforeAll instead.
let ModalConfigValidator: {
  model: (x: string) => string;
  max_tokens: (x: number) => number;
  presence_penalty: (x: number) => number;
  frequency_penalty: (x: number) => number;
  temperature: (x: number) => number;
  top_p: (x: number) => number;
};

beforeAll(async () => {
  // Warm up the import cycle in a working order before loading the target.
  await import("../app/client/api");
  ({ ModalConfigValidator } = await import("../app/store/config"));
});

describe("ModalConfigValidator", () => {
  test("max_tokens clamps to [0, 512000] and defaults to 1024 on NaN", () => {
    expect(ModalConfigValidator.max_tokens(-5)).toBe(0);
    expect(ModalConfigValidator.max_tokens(600000)).toBe(512000);
    expect(ModalConfigValidator.max_tokens(2048)).toBe(2048);
    expect(ModalConfigValidator.max_tokens(NaN)).toBe(1024);
  });

  test("temperature clamps to [0, 2]", () => {
    expect(ModalConfigValidator.temperature(-1)).toBe(0);
    expect(ModalConfigValidator.temperature(5)).toBe(2);
    expect(ModalConfigValidator.temperature(0.7)).toBe(0.7);
  });

  test("top_p clamps to [0, 1]", () => {
    expect(ModalConfigValidator.top_p(2)).toBe(1);
    expect(ModalConfigValidator.top_p(-1)).toBe(0);
    expect(ModalConfigValidator.top_p(0.9)).toBe(0.9);
  });

  test("presence_penalty and frequency_penalty clamp to [-2, 2]", () => {
    expect(ModalConfigValidator.presence_penalty(-9)).toBe(-2);
    expect(ModalConfigValidator.presence_penalty(9)).toBe(2);
    expect(ModalConfigValidator.frequency_penalty(-9)).toBe(-2);
    expect(ModalConfigValidator.frequency_penalty(9)).toBe(2);
  });

  test("model passes the value through unchanged", () => {
    expect(ModalConfigValidator.model("gpt-4")).toBe("gpt-4");
  });
});
