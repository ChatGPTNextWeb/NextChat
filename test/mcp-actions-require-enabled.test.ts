import {
  isMcpEnabled,
  getClientsStatus,
  getClientTools,
  getAvailableClientsCount,
  getAllTools,
  initializeMcpSystem,
  addMcpServer,
  pauseMcpServer,
  resumeMcpServer,
  removeMcpServer,
  restartAllClients,
  executeMcpAction,
  getMcpConfigFromFile,
} from "../app/mcp/actions";

// Regression coverage for the unauthenticated MCP server actions: every one of
// these functions is a Next.js Server Action, callable directly over HTTP with
// no session or auth check. addMcpServer in particular spawns a child process
// using a caller-supplied command, so leaving these ungated is remote code
// execution regardless of whether MCP was ever turned on (ENABLE_MCP unset,
// which is the default, is exactly the case exercised below).
describe("MCP server actions require MCP to be enabled", () => {
  const ORIGINAL_ENABLE_MCP = process.env.ENABLE_MCP;

  afterEach(() => {
    if (ORIGINAL_ENABLE_MCP === undefined) {
      delete process.env.ENABLE_MCP;
    } else {
      process.env.ENABLE_MCP = ORIGINAL_ENABLE_MCP;
    }
  });

  describe("when ENABLE_MCP is unset (the default)", () => {
    beforeEach(() => {
      delete process.env.ENABLE_MCP;
    });

    test.each<[string, () => Promise<unknown>]>([
      ["getClientsStatus", () => getClientsStatus()],
      ["getClientTools", () => getClientTools("x")],
      ["getAvailableClientsCount", () => getAvailableClientsCount()],
      ["getAllTools", () => getAllTools()],
      ["initializeMcpSystem", () => initializeMcpSystem()],
      [
        "addMcpServer",
        () =>
          addMcpServer("attack", {
            command: "touch",
            args: ["/tmp/pwned"],
          } as any),
      ],
      ["pauseMcpServer", () => pauseMcpServer("x")],
      ["resumeMcpServer", () => resumeMcpServer("x")],
      ["removeMcpServer", () => removeMcpServer("x")],
      ["restartAllClients", () => restartAllClients()],
      ["executeMcpAction", () => executeMcpAction("x", {} as any)],
      ["getMcpConfigFromFile", () => getMcpConfigFromFile()],
    ])("%s rejects instead of running", async (_name, callAction) => {
      await expect(callAction()).rejects.toThrow("MCP is not enabled");
    });
  });

  describe("when ENABLE_MCP=true", () => {
    beforeEach(() => {
      process.env.ENABLE_MCP = "true";
    });

    test("isMcpEnabled reports enabled", async () => {
      expect(await isMcpEnabled()).toBe(true);
    });

    test("getMcpConfigFromFile proceeds instead of rejecting", async () => {
      await expect(getMcpConfigFromFile()).resolves.toBeDefined();
    });
  });
});
