describe("mergeWithUpdate", () => {
  test("lets newer remote state win when local has no update time", async () => {
    globalThis.fetch = (async (url: string) => ({
      json: async () =>
        url.includes("prompts.json") ? { en: [], tw: [], cn: [] } : [],
    })) as typeof fetch;
    const { mergeWithUpdate } = await import("../app/utils/sync");

    const local = {
      theme: "local",
    } as { theme: string; lastUpdateTime?: number };
    const remote = { theme: "remote", lastUpdateTime: 200 };

    const merged = mergeWithUpdate(local, remote);

    expect(merged.theme).toBe("remote");
  });
});
