let useAccessStore: typeof import("../app/store/access").useAccessStore;

beforeAll(async () => {
  await import("../app/client/api");
  ({ useAccessStore } = await import("../app/store/access"));
});

describe("transcription access config", () => {
  test("keeps the optional API key in the access store", () => {
    expect(useAccessStore.getState().transcriptionApiKey).toBe("");
  });
});
