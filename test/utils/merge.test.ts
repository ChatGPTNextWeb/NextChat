import { merge } from "../../app/utils/merge";

describe("merge", () => {
  test("should merge simple objects", () => {
    const target = { a: 1 };
    const source = { b: 2 };
    merge(target, source);
    expect(target).toEqual({ a: 1, b: 2 });
  });

  test("should overwrite existing properties", () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3 };
    merge(target, source);
    expect(target).toEqual({ a: 1, b: 3 });
  });

  test("should merge nested objects", () => {
    const target = { a: { x: 1 } };
    const source = { a: { y: 2 } };
    merge(target, source);
    expect(target).toEqual({ a: { x: 1, y: 2 } });
  });

  test("should handle deep nesting", () => {
    const target = { a: { b: { c: 1 } } };
    const source = { a: { b: { d: 2 } } };
    merge(target, source);
    expect(target).toEqual({ a: { b: { c: 1, d: 2 } } });
  });

  test("should not merge __proto__", () => {
    const target = {};
    const source = { __proto__: { polluted: true } };
    merge(target, source);
    expect((target as any).polluted).toBeUndefined();
  });

  test("should not merge constructor", () => {
    const target = {};
    const source = { constructor: { polluted: true } };
    merge(target, source);
    expect(target.constructor).toBeInstanceOf(Function);
  });

  test("should handle null source values", () => {
    const target = { a: 1 };
    const source = { b: null };
    merge(target, source);
    expect(target).toEqual({ a: 1, b: null });
  });

  test("should handle undefined source values", () => {
    const target = { a: 1 };
    const source = { b: undefined };
    merge(target, source);
    expect(target).toEqual({ a: 1, b: undefined });
  });

  test("should handle empty source", () => {
    const target = { a: 1 };
    const source = {};
    merge(target, source);
    expect(target).toEqual({ a: 1 });
  });

  test("should handle empty target", () => {
    const target = {};
    const source = { a: 1, b: 2 };
    merge(target, source);
    expect(target).toEqual({ a: 1, b: 2 });
  });

  test("should create nested objects if target doesn't have them", () => {
    const target = {};
    const source = { a: { b: { c: 1 } } };
    merge(target, source);
    expect(target).toEqual({ a: { b: { c: 1 } } });
  });

  test("should handle arrays as values", () => {
    const target = { a: [1, 2] };
    const source = { a: [3, 4] };
    merge(target, source);
    expect(target.a).toEqual([3, 4]);
  });

  /*
  TODO: Check this test case, with current merge.ts this test case fails
    -   "d": Array [
    -     1,
    -     2,
    -   ],
    +   "d": Object {
    +     "0": 1,
    +     "1": 2,
    +   },
  */
  test("should handle mixed types", () => {
    const target = { a: 1, b: "test", c: true };
    const source = { d: [1, 2], e: { nested: true } };
    merge(target, source);
    expect(target).toEqual({
      a: 1,
      b: "test",
      c: true,
      d: [1, 2],
      e: { nested: true },
    });
  });

  test("should not merge inherited properties", () => {
    const parent = { inherited: true };
    const source = Object.create(parent);
    source.own = true;
    const target = {};
    merge(target, source);
    expect(target).toEqual({ own: true });
    expect((target as any).inherited).toBeUndefined();
  });

  test("should handle functions as values", () => {
    const fn = () => "test";
    const target = {};
    const source = { fn };
    merge(target, source);
    expect((target as any).fn).toBe(fn);
  });
});