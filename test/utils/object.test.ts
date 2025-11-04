import { omit, pick } from "../../app/utils/object";

describe("omit", () => {
  test("should omit single key", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, "b");
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test("should omit multiple keys", () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const result = omit(obj, "b", "d");
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test("should return copy when no keys to omit", () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj);
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj);
  });

  test("should handle omitting non-existent keys", () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, "c" as any);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test("should handle empty object", () => {
    const obj = {};
    const result = omit(obj, "a" as never);
    expect(result).toEqual({});
  });

  test("should not mutate original object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, "b");
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test("should handle nested objects", () => {
    const obj = { a: 1, b: { nested: true }, c: 3 };
    const result = omit(obj, "b");
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test("should handle arrays as values", () => {
    const obj = { a: [1, 2], b: [3, 4], c: 5 };
    const result = omit(obj, "b");
    expect(result).toEqual({ a: [1, 2], c: 5 });
  });
});

describe("pick", () => {
  test("should pick single key", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, "b");
    expect(result).toEqual({ b: 2 });
  });

  test("should pick multiple keys", () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const result = pick(obj, "a", "c");
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test("should return empty object when no keys to pick", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj);
    expect(result).toEqual({});
  });

  test("should handle picking non-existent keys", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, "c" as any);
    expect(result).toEqual({ c: undefined });
  });

  test("should handle empty object", () => {
    const obj = {};
    const result = pick(obj, "a" as never);
    expect(result).toEqual({ a: undefined });
  });

  test("should not mutate original object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, "a", "b");
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test("should handle nested objects", () => {
    const obj = { a: 1, b: { nested: true }, c: 3 };
    const result = pick(obj, "b");
    expect(result).toEqual({ b: { nested: true } });
  });

  test("should handle null values", () => {
    const obj = { a: null, b: 2, c: 3 };
    const result = pick(obj, "a", "b");
    expect(result).toEqual({ a: null, b: 2 });
  });

  test("should handle undefined values", () => {
    const obj = { a: undefined, b: 2, c: 3 };
    const result = pick(obj, "a", "b");
    expect(result).toEqual({ a: undefined, b: 2 });
  });
});