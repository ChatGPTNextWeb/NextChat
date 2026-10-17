/** @jest-environment node */
import { jest as jestApi } from "@jest/globals";
import { getServerSideConfig } from "../app/config/server";

const jest = jestApi;

describe("Mistral server configuration", () => {
  const originalKey = process.env.MISTRAL_API_KEY;
  const originalUrl = process.env.MISTRAL_URL;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.MISTRAL_API_KEY;
    else process.env.MISTRAL_API_KEY = originalKey;
    if (originalUrl === undefined) delete process.env.MISTRAL_URL;
    else process.env.MISTRAL_URL = originalUrl;
    jest.restoreAllMocks();
  });

  test("reads deployment settings without logging credentials", () => {
    process.env.MISTRAL_API_KEY = "synthetic-mistral-config-key";
    process.env.MISTRAL_URL = "https://mistral.example.com";
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    expect(getServerSideConfig()).toMatchObject({
      isMistral: true,
      mistralApiKey: "synthetic-mistral-config-key",
      mistralUrl: "https://mistral.example.com",
    });
    expect(JSON.stringify(log.mock.calls)).not.toContain(
      "synthetic-mistral-config-key",
    );
  });
});
