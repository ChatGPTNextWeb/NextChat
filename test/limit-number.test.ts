// app/store/config.ts participates in an import cycle, so a static import can
// hit a temporal-dead-zone error. Load it dynamically in beforeAll instead.
let limitNumber: (x: number, min: number, max: number, def: number) => number;

beforeAll(async () => {
  // Warm up the import cycle in a working order before loading the target.
  await import("../app/client/api");
  ({ limitNumber } = await import("../app/store/config"));
});

describe("limitNumber", () => {
  test("returns the default value for NaN input", () => {
    expect(limitNumber(NaN, 0, 10, 5)).toBe(5);
  });

  test("clamps values below the minimum up to the minimum", () => {
    expect(limitNumber(-3, 0, 10, 5)).toBe(0);
  });

  test("clamps values above the maximum down to the maximum", () => {
    expect(limitNumber(99, 0, 10, 5)).toBe(10);
  });

  test("returns the value unchanged when it is within range", () => {
    expect(limitNumber(7, 0, 10, 5)).toBe(7);
  });

  test("treats the min and max boundaries as inclusive", () => {
    expect(limitNumber(0, 0, 10, 5)).toBe(0);
    expect(limitNumber(10, 0, 10, 5)).toBe(10);
  });
});
