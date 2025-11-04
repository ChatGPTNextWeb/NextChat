import { deepClone, ensure } from "../../app/utils/clone";

describe("deepClone", () => {
  test("should clone simple object", () => {
    const obj = { a: 1, b: 2 };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  test("should clone nested object", () => {
    const obj = { a: { b: { c: 3 } } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.a).not.toBe(obj.a);
  });

  test("should clone array", () => {
    const arr = [1, 2, [3, 4]];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
  });

  test("should handle null", () => {
    const result = deepClone(null);
    expect(result).toBeNull();
  });

  test("should throw error for undefined", () => {
    expect(() => deepClone(undefined)).toThrow(SyntaxError);
  });

  test("should handle primitive types", () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone("test")).toBe("test");
    expect(deepClone(true)).toBe(true);
  });

  test("should clone object with mixed types", () => {
    const obj = {
      str: "hello",
      num: 123,
      bool: true,
      arr: [1, 2, 3],
      nested: { key: "value" },
    };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.nested).not.toBe(obj.nested);
  });

  test("should handle Date objects", () => {
    const date = new Date("2024-01-01");
    const obj = { date };
    const cloned = deepClone(obj);
    expect(cloned.date).toEqual(date.toISOString());
  });

  test("should not preserve functions", () => {
    const obj = { fn: () => "test", value: 1 };
    const cloned = deepClone(obj);
    expect(cloned.fn).toBeUndefined();
    expect(cloned.value).toBe(1);
  });
});

describe("ensure", () => {
  test("should return true when all keys exist with values", () => {
    const obj = { a: 1, b: "test", c: true };
    const result = ensure(obj, ["a", "b", "c"]);
    expect(result).toBe(true);
  });

  test("should return false when key is undefined", () => {
    const obj = { a: 1, b: undefined };
    const result = ensure(obj, ["a", "b"]);
    expect(result).toBe(false);
  });

  test("should return false when key is null", () => {
    const obj = { a: 1, b: null };
    const result = ensure(obj, ["a", "b"]);
    expect(result).toBe(false);
  });

  test("should return false when key is empty string", () => {
    const obj = { a: 1, b: "" };
    const result = ensure(obj, ["a", "b"]);
    expect(result).toBe(false);
  });

  test("should return true for empty keys array", () => {
    const obj = { a: 1 };
    const result = ensure(obj, []);
    expect(result).toBe(true);
  });

  test("should handle missing keys", () => {
    const obj = { a: 1 };
    const result = ensure(obj, ["a", "b" as keyof typeof obj]);
    expect(result).toBe(false);
  });

  test("should return true when value is 0", () => {
    const obj = { a: 0 };
    const result = ensure(obj, ["a"]);
    expect(result).toBe(true);
  });

  test("should return true when value is false", () => {
    const obj = { a: false };
    const result = ensure(obj, ["a"]);
    expect(result).toBe(true);
  });

  test("should handle nested objects", () => {
    const obj = { user: { name: "John" } };
    const result = ensure(obj, ["user"]);
    expect(result).toBe(true);
  });
});