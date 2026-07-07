import { extractMcpJson } from "../app/mcp/utils";

describe("extractMcpJson", () => {
  test("extracts the client id and parsed mcp payload", () => {
    const content = '```json:mcp:client-1\n{"tool":"x"}\n```';
    expect(extractMcpJson(content)).toEqual({
      clientId: "client-1",
      mcp: { tool: "x" },
    });
  });

  test("returns null when there is no mcp block", () => {
    expect(extractMcpJson("no mcp here")).toBeNull();
  });
});
