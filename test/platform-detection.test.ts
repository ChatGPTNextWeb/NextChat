import { isIOS, isFirefox, isMacOS } from "../app/utils";

function setUserAgent(ua: string) {
  Object.defineProperty(window.navigator, "userAgent", {
    value: ua,
    configurable: true,
  });
}

describe("platform detection", () => {
  const original = window.navigator.userAgent;
  afterEach(() => setUserAgent(original));

  test("isIOS matches iphone/ipad/ipod user agents", () => {
    setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)");
    expect(isIOS()).toBe(true);
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isIOS()).toBe(false);
  });

  test("isFirefox matches only firefox user agents", () => {
    setUserAgent("Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0");
    expect(isFirefox()).toBe(true);
    setUserAgent("Mozilla/5.0 (Windows NT 10.0) Chrome/120.0 Safari/537.36");
    expect(isFirefox()).toBe(false);
  });

  test("isMacOS matches macintosh and iOS-family user agents", () => {
    setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
    expect(isMacOS()).toBe(true);
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(isMacOS()).toBe(false);
  });
});
