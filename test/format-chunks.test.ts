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

  test("splits on spaces so no word is cut in half", () => {
    // maxBytes small enough to force a split at the space boundary
    const result = [...chunks("hello world", 5)];
    expect(result).toEqual(["hello", "world"]);
  });

  test("concatenating the pieces reproduces the original words", () => {
    const input = "the quick brown fox jumps over the lazy dog";
    const result = [...chunks(input, 8)];
    // every produced chunk is non-empty
    expect(result.every((c) => c.length > 0)).toBe(true);
    // spaces were the only thing dropped between chunks
    expect(result.join(" ")).toBe(input);
  });

  test("never splits in the middle of a multi-byte character", () => {
    // each emoji is 4 UTF-8 bytes; a naive byte cut would corrupt them
    const input = "😀😁😂🤣😃😄😅😆";
    const result = [...chunks(input, 6)];
    // a corrupted cut would surface as the replacement character
    expect(result.join("")).not.toContain("�");
    expect(result.join("")).toBe(input);
  });

  test("produces no chunks for an empty string", () => {
    expect([...chunks("")]).toEqual([]);
  });
});
