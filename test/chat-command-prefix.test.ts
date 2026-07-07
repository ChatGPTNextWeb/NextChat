// app/command.ts imports app/locales, which participates in an import cycle,
// so a static import can hit a temporal-dead-zone error. Load it dynamically.
let ChatCommandPrefix: RegExp;

beforeAll(async () => {
  // Warm up the import cycle in a working order before loading the target.
  await import("../app/client/api");
  ({ ChatCommandPrefix } = await import("../app/command"));
});

describe("ChatCommandPrefix", () => {
  test("matches a leading ASCII colon", () => {
    expect(ChatCommandPrefix.test(":help")).toBe(true);
  });

  test("matches a leading full-width (CJK) colon", () => {
    expect(ChatCommandPrefix.test("：help")).toBe(true);
  });

  test("does not match when the colon is not at the start", () => {
    expect(ChatCommandPrefix.test("help:me")).toBe(false);
  });

  test("does not match plain text", () => {
    expect(ChatCommandPrefix.test("hello")).toBe(false);
    expect(ChatCommandPrefix.test("")).toBe(false);
  });
});
