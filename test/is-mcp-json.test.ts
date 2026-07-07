import { isMcpJson } from "../app/mcp/utils";

describe("isMcpJson", () => {
  test("matches a ```json:mcp fenced block and returns the match", () => {
    const content = '```json:mcp:client-1\n{"a":1}\n```';
    const match = isMcpJson(content);
    expect(match).toBeTruthy();
    expect(match![1]).toBe("client-1");
  });

  test("returns null for ordinary content and plain json blocks", () => {
    expect(isMcpJson("just some text")).toBeNull();
    expect(isMcpJson("```json\n{}\n```")).toBeNull();
  });
});
