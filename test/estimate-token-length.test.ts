import { estimateTokenLength } from "../app/utils/token";

describe("estimateTokenLength", () => {
  test("counts latin letters as 0.25 each", () => {
    expect(estimateTokenLength("abcd")).toBeCloseTo(1);
    expect(estimateTokenLength("Hello")).toBeCloseTo(1.25);
  });

  test("counts other ASCII characters as 0.5 each", () => {
    expect(estimateTokenLength("1234")).toBeCloseTo(2);
    expect(estimateTokenLength("   ")).toBeCloseTo(1.5);
  });

  test("counts non-ASCII characters as 1.5 each", () => {
    expect(estimateTokenLength("你好")).toBeCloseTo(3);
  });

  test("returns 0 for an empty string", () => {
    expect(estimateTokenLength("")).toBe(0);
  });

  test("mixes character classes", () => {
    // c + a + f (0.25 each) + é (non-ASCII, 1.5) = 2.25
    expect(estimateTokenLength("café")).toBeCloseTo(2.25);
  });
});
