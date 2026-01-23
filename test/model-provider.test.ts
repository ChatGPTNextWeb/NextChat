import { getModelProvider } from "../app/utils/model";

describe("getModelProvider", () => {
  test("should return model and provider when input contains '@'", () => {
    const input = "model@provider";
    const [model, provider] = getModelProvider(input);
    expect(model).toBe("model");
    expect(provider).toBe("provider");
  });

  test("should return model and undefined provider when input does not contain '@'", () => {
    const input = "model";
    const [model, provider] = getModelProvider(input);
    expect(model).toBe("model");
    expect(provider).toBeUndefined();
  });

  test("should handle multiple '@' characters correctly", () => {
    const input = "model@provider@extra";
    const [model, provider] = getModelProvider(input);
    expect(model).toBe("model@provider");
    expect(provider).toBe("extra");
  });

  test("should return empty strings when input is empty", () => {
    const input = "";
    const [model, provider] = getModelProvider(input);
    expect(model).toBe("");
    expect(provider).toBeUndefined();
  });
});
