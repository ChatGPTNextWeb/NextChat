import { getClientConfig } from "../app/config/client";

describe("getClientConfig", () => {
  afterEach(() => {
    document.head
      .querySelectorAll("meta[name='config']")
      .forEach((m) => m.remove());
  });

  test("returns an empty object when no config meta tag is present", () => {
    expect(getClientConfig()).toEqual({});
  });

  test("parses the config meta tag content on the client", () => {
    const meta = document.createElement("meta");
    meta.name = "config";
    meta.content = JSON.stringify({ buildMode: "standalone", isApp: true });
    document.head.appendChild(meta);
    expect(getClientConfig()).toMatchObject({
      buildMode: "standalone",
      isApp: true,
    });
  });
});
