import { safeLocalStorage } from "../app/utils";

describe("safeLocalStorage", () => {
  const storage = safeLocalStorage();

  beforeEach(() => {
    storage.clear();
  });

  test("stores and retrieves a value by key", () => {
    storage.setItem("token", "abc123");
    expect(storage.getItem("token")).toBe("abc123");
  });

  test("returns null for a key that was never set", () => {
    expect(storage.getItem("missing")).toBeNull();
  });

  test("removes a single item without touching the others", () => {
    storage.setItem("a", "1");
    storage.setItem("b", "2");
    storage.removeItem("a");
    expect(storage.getItem("a")).toBeNull();
    expect(storage.getItem("b")).toBe("2");
  });

  test("clear() empties everything", () => {
    storage.setItem("a", "1");
    storage.setItem("b", "2");
    storage.clear();
    expect(storage.getItem("a")).toBeNull();
    expect(storage.getItem("b")).toBeNull();
  });

  test("overwrites the value when the same key is set twice", () => {
    storage.setItem("k", "first");
    storage.setItem("k", "second");
    expect(storage.getItem("k")).toBe("second");
  });
});
