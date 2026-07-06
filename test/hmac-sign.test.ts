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
let sign: (key: string | Uint8Array, data: string | Uint8Array) => Uint8Array;
let hex: (bin: Uint8Array) => string;

beforeAll(async () => {
  ({ sign, hex } = await import("../app/utils/hmac"));
});

describe("sign (HMAC-SHA256 raw bytes)", () => {
  test("returns a 32-byte Uint8Array", () => {
    const out = sign("key", "message");
    expect(out).toBeInstanceOf(Uint8Array);
    expect(out).toHaveLength(32);
  });

  test("hex of the signature matches the known HMAC-SHA256 test vector", () => {
    const out = sign("key", "The quick brown fox jumps over the lazy dog");
    expect(hex(out)).toBe(
      "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8",
    );
  });

  test("accepts Uint8Array key/data and matches the string form", () => {
    const enc = new TextEncoder();
    const fromBytes = sign(enc.encode("key"), enc.encode("message"));
    const fromStrings = sign("key", "message");
    expect(hex(fromBytes)).toBe(hex(fromStrings));
  });

  test("different keys produce different signatures", () => {
    expect(hex(sign("k1", "m"))).not.toBe(hex(sign("k2", "m")));
  });
});
