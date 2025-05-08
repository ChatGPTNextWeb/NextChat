import { McpRequestMessage, ServerConfig } from "./types";

let actionsHost: typeof import("./actions.base") | undefined;

const actions = async () => {
  if (!actionsHost) {
    if (EXPORT_MODE) {
      actionsHost = await import("./actions.client");
    } else {
      actionsHost = await import("./actions.server");
    }
  }

  return actionsHost;
};

export const getAvailableClientsCount = async () => {
  return (await actions()).getAvailableClientsCount();
};
export const isMcpEnabled = async () => {
  return (await actions()).isMcpEnabled();
};
export const initializeMcpSystem = async () => {
  return (await actions()).initializeMcpSystem();
};
export const addMcpServer = async (clientId: string, config: ServerConfig) => {
  return (await actions()).addMcpServer(clientId, config);
};

export const getClientsStatus = async () => {
  return (await actions()).getClientsStatus();
};
export const getClientTools = async (clientId: string) => {
  return (await actions()).getClientTools(clientId);
};
export const getMcpConfigFromFile = async () => {
  return (await actions()).getMcpConfigFromFile();
};
export const pauseMcpServer = async (clientId: string) => {
  return (await actions()).pauseMcpServer(clientId);
};
export const restartAllClients = async () => {
  return (await actions()).restartAllClients();
};
export const resumeMcpServer = async (clientId: string) => {
  return (await actions()).resumeMcpServer(clientId);
};
export const executeMcpAction = async (
  clientId: string,
  request: McpRequestMessage,
) => {
  return (await actions()).executeMcpAction(clientId, request);
};
export const getAllTools = async () => {
  return (await actions()).getAllTools();
};
