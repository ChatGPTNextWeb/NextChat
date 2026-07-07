import { prettyObject } from "../app/utils/format";

describe("prettyObject", () => {
  test("wraps a plain string in a json code fence", () => {
    expect(prettyObject("hello")).toBe("```json\nhello\n```");
  });

  test("stringifies and wraps a non-empty object", () => {
    expect(prettyObject({ a: 1 })).toBe('```json\n{\n  "a": 1\n}\n```');
  });

  test("returns the original toString() for an empty object", () => {
    expect(prettyObject({})).toBe("[object Object]");
  });

  test("leaves an already fenced json string untouched", () => {
    const already = "```json\n{}\n```";
    expect(prettyObject(already)).toBe(already);
  });
});
