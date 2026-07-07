import { isGPT4Model } from "../app/utils/model";

describe("isGPT4Model", () => {
  test("matches the gpt-4, chatgpt-4o and o1 families", () => {
    expect(isGPT4Model("gpt-4")).toBe(true);
    expect(isGPT4Model("gpt-4-turbo")).toBe(true);
    expect(isGPT4Model("gpt-4o")).toBe(true);
    expect(isGPT4Model("chatgpt-4o-latest")).toBe(true);
    expect(isGPT4Model("o1-preview")).toBe(true);
  });

  test("excludes gpt-4o-mini", () => {
    expect(isGPT4Model("gpt-4o-mini")).toBe(false);
  });

  test("does not match non-gpt-4 models", () => {
    expect(isGPT4Model("gpt-3.5-turbo")).toBe(false);
    expect(isGPT4Model("o3-mini")).toBe(false);
    expect(isGPT4Model("claude-3-opus")).toBe(false);
  });
});
