let DEFAULT_CONFIG: {
  transcriptionConfig: {
    enable: boolean;
    baseUrl: string;
    model: string;
  };
};

beforeAll(async () => {
  await import("../app/client/api");
  ({ DEFAULT_CONFIG } = await import("../app/store/config"));
});

describe("default transcription config", () => {
  test("keeps voice input disabled with local FunASR-compatible defaults", () => {
    expect(DEFAULT_CONFIG.transcriptionConfig).toEqual({
      enable: false,
      baseUrl: "http://localhost:8000/v1",
      model: "sensevoice",
    });
  });
});
