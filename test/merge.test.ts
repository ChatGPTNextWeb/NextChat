import { merge } from "../app/utils/merge";

describe("merge", () => {
  test("adds flat properties from source into target", () => {
    const target: any = { a: 1 };
    merge(target, { b: 2 });
    expect(target).toEqual({ a: 1, b: 2 });
  });

  test("overwrites primitive values", () => {
    const target: any = { a: 1, b: "old" };
    merge(target, { b: "new" });
    expect(target).toEqual({ a: 1, b: "new" });
  });

  test("deep-merges nested objects instead of replacing them", () => {
    const target: any = { a: { x: 1 } };
    merge(target, { a: { y: 2 } });
    expect(target).toEqual({ a: { x: 1, y: 2 } });
  });

  test("creates missing nested targets", () => {
    const target: any = {};
    merge(target, { a: { b: { c: 3 } } });
    expect(target).toEqual({ a: { b: { c: 3 } } });
  });

  test("does not pollute Object.prototype via __proto__", () => {
    const source = JSON.parse('{"__proto__":{"polluted":true}}');
    const target: any = {};
    try {
      merge(target, source);
      expect(({} as any).polluted).toBeUndefined();
      expect(target).toEqual({});
    } finally {
      delete (Object.prototype as any).polluted;
    }
  });
});
