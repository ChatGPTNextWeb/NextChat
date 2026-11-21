/** @jest-environment node */

import { jest } from "@jest/globals";
import { register, usesAccountRelay } from "../app/api/account/new-api";

describe("New API account contract", () => {
  it("sends the upstream verification_code field", async () => {
    const request = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ success: true }));
    try {
      await register({
        username: "sample-user",
        email: "sample@example.com",
        password: "fixture-password",
        verification: "example",
      });
      const [url, options] = request.mock.calls[0];
      expect(String(url)).toMatch(/\/api\/user\/register$/);
      expect(JSON.parse(String(options?.body))).toEqual({
        username: "sample-user",
        email: "sample@example.com",
        password: "fixture-password",
        verification_code: "example",
      });
    } finally {
      request.mockRestore();
    }
  });

  it("accepts the configured relay root and rejects other upstream hosts", () => {
    const before = process.env.NEW_API_ACCOUNT_ORIGIN;
    process.env.NEW_API_ACCOUNT_ORIGIN = "https://relay.example.com";
    try {
      expect(usesAccountRelay("https://relay.example.com")).toBe(true);
      expect(usesAccountRelay("https://relay.example.com/v1/")).toBe(true);
      expect(usesAccountRelay("https://other.example.com")).toBe(false);
      expect(usesAccountRelay("https://relay.example.com/unrelated")).toBe(false);
    } finally {
      if (before === undefined) delete process.env.NEW_API_ACCOUNT_ORIGIN;
      else process.env.NEW_API_ACCOUNT_ORIGIN = before;
    }
  });
});
