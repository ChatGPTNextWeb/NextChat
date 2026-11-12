import { getVisTheme, isVisSyntax } from "../app/utils/vis";

describe("isVisSyntax", () => {
  test("accepts GPT-Vis syntax", () => {
    expect(isVisSyntax("vis line\ndata\n  - time 2020\n    value 1")).toBe(
      true,
    );
    expect(isVisSyntax("\n  vis pie\ndata")).toBe(true);
    expect(isVisSyntax("vis dual-axes\ncategories 2020")).toBe(true);
    expect(isVisSyntax("vis\tcolumn")).toBe(true);
  });

  test("rejects other content", () => {
    expect(isVisSyntax("")).toBe(false);
    expect(isVisSyntax("vis")).toBe(false);
    expect(isVisSyntax("vis \n")).toBe(false);
    expect(isVisSyntax("visual line")).toBe(false);
    expect(isVisSyntax("graph TD; A-->B")).toBe(false);
    expect(isVisSyntax('{"type": "line"}')).toBe(false);
  });
});

describe("getVisTheme", () => {
  test("follows an explicit app theme", () => {
    expect(getVisTheme("dark", false)).toBe("dark");
    expect(getVisTheme("light", true)).toBe("default");
  });

  test("follows the system preference in auto mode", () => {
    expect(getVisTheme("auto", true)).toBe("dark");
    expect(getVisTheme("auto", false)).toBe("default");
  });
});
