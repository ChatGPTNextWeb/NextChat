import { jest } from "@jest/globals";
import { TextDecoder, TextEncoder } from "util";
import type { SyncStore } from "../app/store/sync";
import { createUpstashClient } from "../app/utils/cloud/upstash";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

describe("Upstash sync", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const backupPrefix =
    '{"sessions":[{"messages":[{"role":"assistant","content":"';

  test.each([
    ["whitespace and Unicode", " Hello  world\n中文 😀 "],
    ["large space-free messages", "x".repeat(1_000_001)],
    [
      "multibyte chunk boundaries",
      "x".repeat(999_999 - backupPrefix.length) + "😀中文",
    ],
    [
      "byte-order marks at chunk boundaries",
      "x".repeat(1_000_000 - backupPrefix.length) + "\uFEFFtail",
    ],
  ])("preserves backups containing %s", async (_, content) => {
    const client = createUpstashClient({
      upstash: {
        username: "backup",
        endpoint: "https://example.org",
        apiKey: "test-key",
      },
      useProxy: false,
      proxyUrl: "",
    } as SyncStore);
    const stored = new Map<string, string>();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(client, "redisSet").mockImplementation(async (key, value) => {
      expect(new TextEncoder().encode(value).length).toBeLessThanOrEqual(
        1_000_000,
      );
      stored.set(key, value);
    });
    jest
      .spyOn(client, "redisGet")
      .mockImplementation(async (key) => stored.get(key) ?? "");
    const backup = JSON.stringify({
      sessions: [{ messages: [{ role: "assistant", content }] }],
    });

    await client.set("backup", backup);

    expect(await client.get()).toBe(backup);
  });
});
