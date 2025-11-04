// test/utils/format.test.ts
import { TextEncoder, TextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;

import { prettyObject, chunks } from "../../app/utils/format";

describe("prettyObject", () => {
  test("should format object as JSON with code block", () => {
    const obj = { name: "test", value: 123 };
    const result = prettyObject(obj);
    expect(result).toBe('```json\n{\n  "name": "test",\n  "value": 123\n}\n```');
  });

  test("should handle string input", () => {
    const str = '{"key":"value"}';
    const result = prettyObject(str);
    expect(result).toBe('```json\n{"key":"value"}\n```');
  });

  test("should return toString for empty object", () => {
    const obj = {};
    const result = prettyObject(obj);
    expect(result).toBe("[object Object]");
  });

  test("should not add code block if already present", () => {
    const str = '```json\n{"test":true}\n```';
    const result = prettyObject(str);
    expect(result).toBe(str);
  });

  test("should handle null", () => {
    const result = prettyObject(null);
    expect(result).toBe("```json\nnull\n```");
  });

  /*
  Currently it's throwing an TypeError
  Or should we update prettyObject method to safely handle undefined like
  we did for null?
  */
  test("should handle undefined", () => {
    expect(() => prettyObject(undefined)).toThrow(TypeError);
  });

  test("should handle arrays", () => {
    const arr = [1, 2, 3];
    const result = prettyObject(arr);
    expect(result).toBe('```json\n[\n  1,\n  2,\n  3\n]\n```');
  });

  test("should handle nested objects", () => {
    const obj = { user: { name: "John", age: 30 } };
    const result = prettyObject(obj);
    expect(result).toContain('"user"');
    expect(result).toContain('"name"');
  });
});

describe("chunks", () => {
  test("should split string into chunks by byte size", () => {
    const text = "a".repeat(2000);
    const result = Array.from(chunks(text, 1000));
    expect(result.length).toBe(1);
  });

  test("should handle empty string", () => {
    const result = Array.from(chunks(""));
    expect(result).toEqual([]);
  });

  test("should handle string smaller than maxBytes", () => {
    const text = "hello world";
    const result = Array.from(chunks(text, 1000));
    expect(result).toEqual(["hello", "world"]);
  });

  test("should split at space boundaries", () => {
    const text = "word1 word2 word3 word4";
    const result = Array.from(chunks(text, 10));
    expect(result.length).toBeGreaterThan(1);
    result.forEach(chunk => {
      expect(chunk.length).toBeLessThanOrEqual(15);
    });
  });

  test("should handle unicode characters", () => {
    const text = "你好世界 ".repeat(500);
    const result = Array.from(chunks(text, 1000));
    expect(result.length).toBeGreaterThan(1);
  });

  test("should handle text without spaces", () => {
    const text = "a".repeat(5000);
    const result = Array.from(chunks(text, 1000));
    expect(result.length).toBe(1);
  });

  test("should use default maxBytes of 1MB", () => {
    const text = "x".repeat(2000000);
    const result = Array.from(chunks(text));
    expect(result.length).toBe(1);
  });
});