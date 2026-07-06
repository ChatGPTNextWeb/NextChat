import { getClientConfig } from "../app/config/client";

describe("getClientConfig (client side)", () => {
  afterEach(() => {
    document
      .querySelectorAll("meta[name='config']")
      .forEach((meta) => meta.remove());
  });

  test("returns an empty object when no config meta tag is present", () => {
    expect(getClientConfig()).toEqual({});
  });

  test("parses the JSON payload from the config meta tag", () => {
    const meta = document.createElement("meta");
    meta.name = "config";
    meta.content = JSON.stringify({ buildMode: "standalone", isApp: false });
    document.head.appendChild(meta);

    expect(getClientConfig()).toEqual({
      buildMode: "standalone",
      isApp: false,
    });
  });
});
