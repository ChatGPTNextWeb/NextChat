import { isMacOS, isFirefox, isIOS } from "../app/utils";

// These helpers read navigator.userAgent, so we temporarily override it and
// restore the original descriptor afterwards to keep the test side-effect free.
const originalUA = Object.getOwnPropertyDescriptor(
  window.navigator,
  "userAgent",
);

function setUserAgent(ua: string) {
  Object.defineProperty(window.navigator, "userAgent", {
    value: ua,
    configurable: true,
  });
}

afterAll(() => {
  if (originalUA) {
    Object.defineProperty(window.navigator, "userAgent", originalUA);
  }
});

describe("platform detection", () => {
  test("isMacOS is true for a Macintosh UA and false otherwise", () => {
    setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
    expect(isMacOS()).toBe(true);
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isMacOS()).toBe(false);
  });

  test("isIOS is true for iPhone/iPad UAs and false otherwise", () => {
    setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)");
    expect(isIOS()).toBe(true);
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isIOS()).toBe(false);
  });

  test("isFirefox is true only for a Firefox UA", () => {
    setUserAgent("Mozilla/5.0 (X11; Linux) Gecko/20100101 Firefox/120.0");
    expect(isFirefox()).toBe(true);
    setUserAgent("Mozilla/5.0 (Chrome/120) AppleWebKit/537.36");
    expect(isFirefox()).toBe(false);
  });
});
