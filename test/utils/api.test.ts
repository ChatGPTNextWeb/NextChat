import { getBearerToken, validString } from "../../app/client/api";

describe("getBearerToken", () => {
  test("should add Bearer prefix by default", () => {
    expect(getBearerToken("test-key")).toBe("Bearer test-key");
  });

  test("should not add Bearer prefix when noBearer is true", () => {
    expect(getBearerToken("test-key", true)).toBe("test-key");
  });

  test("should trim whitespace", () => {
    expect(getBearerToken("  test-key  ")).toBe("Bearer test-key");
  });

  test("should return empty string for empty key", () => {
    expect(getBearerToken("")).toBe("");
  });

  /* This test identified issue with validString() method  */
  test("should return empty string for whitespace only", () => {
    expect(getBearerToken("   ")).toBe("");
  });

  test("should handle null-like values", () => {
    expect(getBearerToken(null as any)).toBe("");
    expect(getBearerToken(undefined as any)).toBe("");
  });
});

describe("validString", () => {
  test("should return true for non-empty string", () => {
    expect(validString("test")).toBe(true);
  });

  test("should return false for empty string", () => {
    expect(validString("")).toBe(false);
  });

  test("should return false for whitespace", () => {
    expect(validString("   ")).toBe(false);
  });

  test("should return false for null", () => {
    expect(validString(null as any)).toBe(false);
  });

  test("should return false for undefined", () => {
    expect(validString(undefined as any)).toBe(false);
  });

  test("should return true for string with special characters", () => {
    expect(validString("!@#$%")).toBe(true);
  });
});