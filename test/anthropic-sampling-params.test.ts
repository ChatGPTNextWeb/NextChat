import { getAnthropicSamplingParams } from "@/app/client/platforms/anthropic";

describe("getAnthropicSamplingParams", () => {
  test("omits top_p for Claude 4 models", () => {
    expect(getAnthropicSamplingParams("claude-sonnet-4-5", 0.5, 1)).toEqual({
      temperature: 0.5,
    });
  });

  test("keeps top_p for older Claude models", () => {
    expect(
      getAnthropicSamplingParams("claude-3-5-sonnet-20241022", 0.5, 0.9),
    ).toEqual({
      temperature: 0.5,
      top_p: 0.9,
    });
  });
});
