import { TextDecoder, TextEncoder } from "util";

// hmac.ts instantiates a TextEncoder at module load time, and jsdom does
// not expose TextEncoder/TextDecoder as globals. Polyfill them from Node
// before the module is imported, and only when they are missing, so this
// stays additive and does not touch shared setup files.
if (typeof (global as any).TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}
if (typeof (global as any).TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

// Dynamically import after the polyfill is in place (a static import would
// be hoisted and run hmac.ts' top-level TextEncoder() too early).
let hex: (bin: Uint8Array) => string;

beforeAll(async () => {
  ({ hex } = await import("../app/utils/hmac"));
});

describe("hex", () => {
  test("encodes each byte as a two-character lowercase hex pair", () => {
    expect(hex(new Uint8Array([0, 1, 15, 16, 255]))).toBe("00010f10ff");
  });

  test("zero-pads single-digit byte values", () => {
    expect(hex(new Uint8Array([0]))).toBe("00");
    expect(hex(new Uint8Array([10]))).toBe("0a");
  });

  test("returns an empty string for an empty array", () => {
    expect(hex(new Uint8Array([]))).toBe("");
  });

  test("produces two hex characters per input byte", () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(hex(bytes)).toHaveLength(bytes.length * 2);
  });
});
