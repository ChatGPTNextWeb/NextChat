import { isModelAvailableInServer } from "../app/utils/model";

describe("isModelAvailableInServer", () => {
  // NOTE: the helper returns true when a model has been *explicitly disabled*
  // in the server's custom-model string (available === false), and false
  // otherwise (including when the model is enabled or unknown).

  test("returns false for a model that is available by default", () => {
    expect(isModelAvailableInServer("", "gpt-4", "openai")).toBe(false);
  });

  test("returns true when '-all' disables every model", () => {
    expect(isModelAvailableInServer("-all", "gpt-4", "openai")).toBe(true);
  });

  test("returns true when the specific model is disabled", () => {
    expect(isModelAvailableInServer("-gpt-4@openai", "gpt-4", "openai")).toBe(
      true,
    );
  });

  test("returns false for an unknown model that is not in the table", () => {
    expect(
      isModelAvailableInServer("", "totally-unknown-model", "openai"),
    ).toBe(false);
  });

  test("a model re-enabled after '-all' is not reported as disabled", () => {
    expect(
      isModelAvailableInServer("-all,+gpt-4@openai", "gpt-4", "openai"),
    ).toBe(false);
  });
});
