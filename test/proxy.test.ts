/**
 * @jest-environment node
 */
import { isBlockedProxyTarget, isOpenAIApiHost } from "../app/api/proxy";

describe("isOpenAIApiHost (hostname-only OpenAI key injection)", () => {
  test("injects the server key for the real OpenAI API host", () => {
    expect(isOpenAIApiHost("https://api.openai.com")).toBe(true);
    expect(isOpenAIApiHost("https://api.openai.com/v1")).toBe(true);
    expect(isOpenAIApiHost("https://API.OPENAI.COM")).toBe(true);
    expect(isOpenAIApiHost("https://api.openai.com.")).toBe(true);
  });

  test("does not inject when api.openai.com is only a query substring", () => {
    // Issue #6814 PoC: substring match leaked OPENAI_API_KEY to attacker hosts.
    expect(isOpenAIApiHost("http://attacker.example?q=api.openai.com")).toBe(
      false,
    );
  });

  test("does not inject when api.openai.com is only a path or fragment", () => {
    expect(
      isOpenAIApiHost("http://attacker.example/path/api.openai.com/anything"),
    ).toBe(false);
    expect(isOpenAIApiHost("http://attacker.example#api.openai.com")).toBe(
      false,
    );
  });

  test("does not inject for lookalike hostnames", () => {
    expect(isOpenAIApiHost("http://api.openai.com.evil.example")).toBe(false);
    expect(isOpenAIApiHost("http://evil-api.openai.com")).toBe(false);
    expect(isOpenAIApiHost("https://api.openai.com.attacker.example")).toBe(
      false,
    );
  });

  test("does not inject when api.openai.com is userinfo for another host", () => {
    expect(isOpenAIApiHost("https://api.openai.com@attacker.example")).toBe(
      false,
    );
  });

  test("does not inject for missing or invalid URLs", () => {
    expect(isOpenAIApiHost(null)).toBe(false);
    expect(isOpenAIApiHost("")).toBe(false);
    expect(isOpenAIApiHost("not a url")).toBe(false);
  });
});

describe("isBlockedProxyTarget (private / metadata SSRF)", () => {
  test("blocks cloud metadata and link-local addresses", () => {
    // Issue #6813 PoC: x-base-url http://169.254.169.254
    expect(isBlockedProxyTarget("http://169.254.169.254")).toBe(true);
    expect(
      isBlockedProxyTarget(
        "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
      ),
    ).toBe(true);
    expect(isBlockedProxyTarget("http://metadata.google.internal")).toBe(true);
  });

  test("blocks loopback and localhost", () => {
    expect(isBlockedProxyTarget("http://127.0.0.1")).toBe(true);
    expect(isBlockedProxyTarget("http://127.0.0.2/admin")).toBe(true);
    expect(isBlockedProxyTarget("http://localhost")).toBe(true);
    expect(isBlockedProxyTarget("http://localhost:8080/anypath")).toBe(true);
    expect(isBlockedProxyTarget("http://[::1]/")).toBe(true);
    expect(isBlockedProxyTarget("http://0.0.0.0")).toBe(true);
  });

  test("blocks RFC1918 and CGNAT addresses", () => {
    expect(isBlockedProxyTarget("http://10.0.0.1")).toBe(true);
    expect(isBlockedProxyTarget("http://192.168.1.1")).toBe(true);
    expect(isBlockedProxyTarget("http://172.16.0.1")).toBe(true);
    expect(isBlockedProxyTarget("http://172.31.255.255")).toBe(true);
    expect(isBlockedProxyTarget("http://100.64.0.1")).toBe(true);
  });

  test("blocks non-http(s) schemes and missing URLs", () => {
    expect(isBlockedProxyTarget(null)).toBe(true);
    expect(isBlockedProxyTarget("")).toBe(true);
    expect(isBlockedProxyTarget("file:///etc/passwd")).toBe(true);
    expect(isBlockedProxyTarget("not a url")).toBe(true);
  });

  test("allows public https hosts used by plugins and OpenAI", () => {
    expect(isBlockedProxyTarget("https://api.openai.com")).toBe(false);
    expect(isBlockedProxyTarget("https://api.openai.com/v1")).toBe(false);
    expect(isBlockedProxyTarget("https://example.com/openapi.json")).toBe(
      false,
    );
    expect(
      isBlockedProxyTarget("http://attacker.example?q=api.openai.com"),
    ).toBe(false);
  });
});
