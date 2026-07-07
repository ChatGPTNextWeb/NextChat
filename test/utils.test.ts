import {
  trimTopic,
  semverCompare,
  getMessageTextContent,
  getMessageTextContentWithoutThinking,
  getMessageImages,
  isDalle3,
  getModelSizes,
  supportsCustomSize,
} from "../app/utils";
import { RequestMessage } from "../app/client/api";

describe("trimTopic", () => {
  test("removes wrapping quotes and asterisks", () => {
    expect(trimTopic('"Hello"')).toBe("Hello");
    expect(trimTopic("“Hello”")).toBe("Hello");
    expect(trimTopic("*Hello*")).toBe("Hello");
    expect(trimTopic('"*Title*"')).toBe("Title");
  });

  test("removes trailing punctuation (CJK and ASCII)", () => {
    expect(trimTopic("你好。")).toBe("你好");
    expect(trimTopic("Are you sure?")).toBe("Are you sure");
    expect(trimTopic("Hello, world.")).toBe("Hello, world");
  });

  test("keeps inner punctuation and returns empty string untouched", () => {
    expect(trimTopic("a, b, c")).toBe("a, b, c");
    expect(trimTopic("")).toBe("");
  });
});

describe("semverCompare", () => {
  test("returns 0 for equal versions", () => {
    expect(semverCompare("1.0.0", "1.0.0")).toBe(0);
  });

  test("compares numerically, not lexicographically", () => {
    expect(semverCompare("1.10.0", "1.2.0")).toBeGreaterThan(0);
    expect(semverCompare("1.2.0", "1.10.0")).toBeLessThan(0);
  });

  test("treats a prerelease as lower than its release", () => {
    expect(semverCompare("1.0.0", "1.0.0-beta")).toBe(1);
    expect(semverCompare("1.0.0-beta", "1.0.0")).toBe(-1);
  });
});

describe("getMessageTextContent", () => {
  test("returns plain string content as-is", () => {
    const msg: RequestMessage = { role: "user", content: "hello" };
    expect(getMessageTextContent(msg)).toBe("hello");
  });

  test("returns the first text part of multimodal content", () => {
    const msg: RequestMessage = {
      role: "user",
      content: [
        { type: "image_url", image_url: { url: "http://img" } },
        { type: "text", text: "a caption" },
      ],
    };
    expect(getMessageTextContent(msg)).toBe("a caption");
  });

  test("returns empty string when there is no text part", () => {
    const msg: RequestMessage = {
      role: "user",
      content: [{ type: "image_url", image_url: { url: "http://img" } }],
    };
    expect(getMessageTextContent(msg)).toBe("");
  });
});

describe("getMessageTextContentWithoutThinking", () => {
  test("drops thinking lines that start with '> '", () => {
    const msg: RequestMessage = {
      role: "assistant",
      content: "> reasoning step\nfinal answer",
    };
    expect(getMessageTextContentWithoutThinking(msg)).toBe("final answer");
  });

  test("drops blank lines and trims the result", () => {
    const msg: RequestMessage = {
      role: "assistant",
      content: "\n> thinking\n\nline one\nline two\n",
    };
    expect(getMessageTextContentWithoutThinking(msg)).toBe(
      "line one\nline two",
    );
  });
});

describe("getMessageImages", () => {
  test("returns an empty array for string content", () => {
    const msg: RequestMessage = { role: "user", content: "no images here" };
    expect(getMessageImages(msg)).toEqual([]);
  });

  test("collects all image urls from multimodal content", () => {
    const msg: RequestMessage = {
      role: "user",
      content: [
        { type: "image_url", image_url: { url: "http://a" } },
        { type: "text", text: "between" },
        { type: "image_url", image_url: { url: "http://b" } },
      ],
    };
    expect(getMessageImages(msg)).toEqual(["http://a", "http://b"]);
  });
});

describe("isDalle3", () => {
  test("matches only the exact dall-e-3 model id", () => {
    expect(isDalle3("dall-e-3")).toBe(true);
    expect(isDalle3("dall-e-2")).toBe(false);
    expect(isDalle3("gpt-4")).toBe(false);
  });
});

describe("getModelSizes / supportsCustomSize", () => {
  test("returns dall-e-3 sizes", () => {
    expect(getModelSizes("dall-e-3")).toEqual([
      "1024x1024",
      "1792x1024",
      "1024x1792",
    ]);
    expect(supportsCustomSize("dall-e-3")).toBe(true);
  });

  test("returns cogview sizes (case-insensitive match)", () => {
    expect(getModelSizes("CogView-3")).toContain("768x1344");
    expect(supportsCustomSize("cogview-3")).toBe(true);
  });

  test("returns no sizes for models without custom sizing", () => {
    expect(getModelSizes("gpt-4")).toEqual([]);
    expect(supportsCustomSize("gpt-4")).toBe(false);
  });
});
