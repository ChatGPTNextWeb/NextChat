import { ProsodyOptions } from "../app/utils/ms_edge_tts";

describe("ProsodyOptions", () => {
  test("has sensible SSML defaults", () => {
    const options = new ProsodyOptions();
    expect(options.pitch).toBe("+0Hz");
    expect(options.rate).toBe(1.0);
    expect(options.volume).toBe(100.0);
  });

  test("allows overriding pitch, rate and volume", () => {
    const options = new ProsodyOptions();
    options.pitch = "+2st";
    options.rate = "+50%";
    options.volume = 50;
    expect(options.pitch).toBe("+2st");
    expect(options.rate).toBe("+50%");
    expect(options.volume).toBe(50);
  });

  test("keeps two instances independent", () => {
    const a = new ProsodyOptions();
    const b = new ProsodyOptions();
    a.rate = 2.0;
    expect(b.rate).toBe(1.0);
  });
});
