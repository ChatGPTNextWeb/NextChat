import { validString } from "../app/client/api";

describe("validString", () => {
  test("returns true for a non-empty string", () => {
    expect(validString("a")).toBe(true);
    expect(validString("  padded  ")).toBe(true);
  });

  test("returns false for an empty string", () => {
    expect(validString("")).toBe(false);
  });

  test("returns false for null / undefined input", () => {
    expect(validString(undefined as any)).toBe(false);
    expect(validString(null as any)).toBe(false);
  });
});
