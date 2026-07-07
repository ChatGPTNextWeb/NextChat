import { omit, pick } from "../app/utils/object";
import { deepClone, ensure } from "../app/utils/clone";

describe("omit", () => {
  test("returns a copy without the given keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, "b")).toEqual({ a: 1, c: 3 });
    expect(omit(obj, "a", "c")).toEqual({ b: 2 });
  });

  test("does not mutate the original object", () => {
    const obj = { a: 1, b: 2 };
    omit(obj, "a");
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});

describe("pick", () => {
  test("keeps only the given keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, "a", "c")).toEqual({ a: 1, c: 3 });
  });

  test("does not mutate the original object", () => {
    const obj = { a: 1, b: 2 };
    pick(obj, "a");
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});

describe("deepClone", () => {
  test("clones nested structures by value", () => {
    const original = { a: 1, nested: { b: 2 }, list: [1, 2] };
    const copy = deepClone(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);

    copy.nested.b = 99;
    copy.list.push(3);
    expect(original.nested.b).toBe(2);
    expect(original.list).toEqual([1, 2]);
  });
});

describe("ensure", () => {
  test("returns true only when all keys have non-empty values", () => {
    expect(ensure({ a: 1, b: "x" }, ["a", "b"])).toBe(true);
  });

  test("returns false when any key is undefined, null or empty", () => {
    expect(ensure({ a: 1, b: "" }, ["a", "b"])).toBe(false);
    expect(ensure({ a: 1, b: null } as any, ["a", "b"])).toBe(false);
    expect(ensure({ a: 1 } as any, ["a", "b"])).toBe(false);
  });
});
