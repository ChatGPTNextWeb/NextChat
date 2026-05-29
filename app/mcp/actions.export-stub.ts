import {
  DEFAULT_MCP_CONFIG,
  McpConfigData,
  McpRequestMessage,
  ServerConfig,
} from "./types";

export async function getClientsStatus(): Promise<Record<string, unknown>> {
  return {};
}

export async function getClientTools(_clientId: string) {
  return null;
}

export async function getAvailableClientsCount() {
  return 0;
}

export async function getAllTools() {
  return [];
}

export async function initializeMcpSystem() {
  return undefined;
}

export async function addMcpServer(_clientId: string, _config: ServerConfig) {
  return DEFAULT_MCP_CONFIG;
}

export async function pauseMcpServer(_clientId: string) {
  return DEFAULT_MCP_CONFIG;
}

export async function resumeMcpServer(_clientId: string): Promise<void> {}

export async function removeMcpServer(_clientId: string) {
  return DEFAULT_MCP_CONFIG;
}

export async function restartAllClients() {
  return DEFAULT_MCP_CONFIG;
}

export async function executeMcpAction(
  _clientId: string,
  _request: McpRequestMessage,
) {
  return null;
}

export async function getMcpConfigFromFile(): Promise<McpConfigData> {
  return DEFAULT_MCP_CONFIG;
}

export async function isMcpEnabled() {
  return false;
}
