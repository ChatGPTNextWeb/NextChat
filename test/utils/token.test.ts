import { estimateTokenLength } from "../../app/utils/token";

describe("estimateTokenLength", () => {
  test("should estimate ASCII lowercase letters", () => {
    const result = estimateTokenLength("abcdefghij");
    expect(result).toBe(2.5); // 10 * 0.25
  });

  test("should estimate ASCII uppercase letters", () => {
    const result = estimateTokenLength("ABCDEFGHIJ");
    expect(result).toBe(2.5); // 10 * 0.25
  });

  test("should estimate mixed case letters", () => {
    const result = estimateTokenLength("AbCdEf");
    expect(result).toBe(1.5); // 6 * 0.25
  });

  test("should estimate ASCII special characters", () => {
    const result = estimateTokenLength("!@#$%");
    expect(result).toBe(2.5); // 5 * 0.5
  });

  test("should estimate numbers", () => {
    const result = estimateTokenLength("12345");
    expect(result).toBe(2.5); // 5 * 0.5
  });

  test("should estimate spaces", () => {
    const result = estimateTokenLength("     ");
    expect(result).toBe(2.5); // 5 * 0.5
  });

  test("should estimate Chinese characters", () => {
    const result = estimateTokenLength("你好世界");
    expect(result).toBe(6); // 4 * 1.5
  });

  test("should estimate Japanese characters", () => {
    const result = estimateTokenLength("こんにちは");
    expect(result).toBe(7.5); // 5 * 1.5
  });

  test("should estimate emoji", () => {
    const result = estimateTokenLength("😀😃😄");
    expect(result).toBeGreaterThan(0);
  });

  test("should estimate mixed content", () => {
    const text = "Hello 世界 123";
    const result = estimateTokenLength(text);
    expect(result).toBeGreaterThan(0);
  });

  test("should handle empty string", () => {
    const result = estimateTokenLength("");
    expect(result).toBe(0);
  });

  test("should estimate long text", () => {
    const text = "a".repeat(1000);
    const result = estimateTokenLength(text);
    expect(result).toBe(250); // 1000 * 0.25
  });

  test("should estimate text with newlines", () => {
    const text = "line1\nline2\nline3";
    const result = estimateTokenLength(text);
    expect(result).toBeGreaterThan(0);
  });

  test("should estimate code-like text", () => {
    const code = "function test() { return 42; }";
    const result = estimateTokenLength(code);
    expect(result).toBeGreaterThan(0);
  });

  test("should estimate URL", () => {
    const url = "https://example.com/path?query=value";
    const result = estimateTokenLength(url);
    expect(result).toBeGreaterThan(0);
  });

  test("should handle character at boundary (charCode 122 = 'z')", () => {
    const result = estimateTokenLength("z");
    expect(result).toBe(0.25);
  });

  test("should handle character at boundary (charCode 65 = 'A')", () => {
    const result = estimateTokenLength("A");
    expect(result).toBe(0.25);
  });

  test("should handle character below ASCII range", () => {
    const result = estimateTokenLength("\t");
    expect(result).toBe(0.5);
  });
});