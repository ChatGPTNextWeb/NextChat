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
let hash: (str: string) => string;
let hashWithSecret: (str: string, secret: string) => string;

beforeAll(async () => {
  ({ hash, hashWithSecret } = await import("../app/utils/hmac"));
});

describe("hash (SHA-256)", () => {
  test("matches the well-known SHA-256 digest of 'abc'", () => {
    expect(hash("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  test("matches the SHA-256 digest of the empty string", () => {
    expect(hash("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  test("returns a 64-character lowercase hex string", () => {
    expect(hash("nextchat")).toMatch(/^[0-9a-f]{64}$/);
  });

  test("is deterministic for the same input", () => {
    expect(hash("same input")).toBe(hash("same input"));
  });
});

describe("hashWithSecret (HMAC-SHA256)", () => {
  test("matches the well-known HMAC-SHA256 test vector", () => {
    expect(
      hashWithSecret("The quick brown fox jumps over the lazy dog", "key"),
    ).toBe("f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8");
  });

  test("returns a 64-character lowercase hex string", () => {
    expect(hashWithSecret("message", "secret")).toMatch(/^[0-9a-f]{64}$/);
  });

  test("changes when the secret changes", () => {
    expect(hashWithSecret("message", "secret-a")).not.toBe(
      hashWithSecret("message", "secret-b"),
    );
  });
});
