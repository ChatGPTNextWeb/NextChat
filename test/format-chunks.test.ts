import { TextDecoder, TextEncoder } from "util";
import { chunks } from "../app/utils/format";

// jsdom does not expose TextEncoder/TextDecoder as globals, but the
// `chunks` generator relies on them. Provide the Node implementations
// only when they are missing so this stays additive and side-effect free.
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

describe("chunks", () => {
  test("yields a space-free string in one piece when it fits the limit", () => {
    const result = [...chunks("helloworld", 1000)];
    expect(result).toEqual(["helloworld"]);
  });

  test("preserves spaces across chunk boundaries", () => {
    const result = [...chunks("hello world", 5)];
    expect(result.join("")).toBe("hello world");
    expect(result.every((c) => new TextEncoder().encode(c).length <= 5)).toBe(
      true,
    );
  });

  test("concatenating the pieces reproduces whitespace exactly", () => {
    const input = "  the quick  brown\tfox\njumps over the lazy dog  ";
    const result = [...chunks(input, 8)];
    expect(result.every((c) => c.length > 0)).toBe(true);
    expect(result.join("")).toBe(input);
    expect(result.every((c) => new TextEncoder().encode(c).length <= 8)).toBe(
      true,
    );
  });

  test("never splits in the middle of a multi-byte character", () => {
    const input = "😀😁😂🤣😃😄😅😆";
    const result = [...chunks(input, 6)];
    expect(result.join("")).not.toContain("�");
    expect(result.join("")).toBe(input);
    expect(result.every((c) => new TextEncoder().encode(c).length <= 6)).toBe(
      true,
    );
  });

  test.each(["abcéx", "abc€x", "abc😀x", "中文消息"])(
    "keeps UTF-8 boundaries in %s",
    (input) => {
      const result = [...chunks(input, 4)];
      expect(result.join("")).toBe(input);
      expect(result.every((c) => new TextEncoder().encode(c).length <= 4)).toBe(
        true,
      );
    },
  );

  test.each(["\uFEFFhello", "abcd\uFEFFxyz"])(
    "preserves byte-order-mark characters in %s",
    (input) => {
      expect([...chunks(input, 4)].join("")).toBe(input);
    },
  );

  test("splits long space-free strings at the default byte limit", () => {
    const input = "x".repeat(1_000_001);
    const result = [...chunks(input)];
    expect(result.map((c) => c.length)).toEqual([1_000_000, 1]);
    expect(result.join("")).toBe(input);
  });

  test("produces no chunks for an empty string", () => {
    expect([...chunks("")]).toEqual([]);
  });

  test("rejects a byte limit smaller than one character", () => {
    expect(() => [...chunks("😀", 3)]).toThrow(RangeError);
  });
});
