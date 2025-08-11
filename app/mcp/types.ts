// ref: https://spec.modelcontextprotocol.io/specification/basic/messages/

import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

export interface McpRequestMessage {
  jsonrpc?: "2.0";
  id?: string | number;
  method: "tools/call" | string;
  params?: {
    name?: string;
    [key: string]: unknown;
  };
}

export const McpRequestMessageSchema: z.ZodType<McpRequestMessage> = z.object({
  jsonrpc: z.literal("2.0").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  method: z.string(),
  params: z.record(z.unknown()).optional(),
});

export interface McpResponseMessage {
  jsonrpc?: "2.0";
  id?: string | number;
  result?: {
    [key: string]: unknown;
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export const McpResponseMessageSchema: z.ZodType<McpResponseMessage> = z.object(
  {
    jsonrpc: z.literal("2.0").optional(),
    id: z.union([z.string(), z.number()]).optional(),
    result: z.record(z.unknown()).optional(),
    error: z
      .object({
        code: z.number(),
        message: z.string(),
        data: z.unknown().optional(),
      })
      .optional(),
  },
);

export interface McpNotifications {
  jsonrpc?: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}

export const McpNotificationsSchema: z.ZodType<McpNotifications> = z.object({
  jsonrpc: z.literal("2.0").optional(),
  method: z.string(),
  params: z.record(z.unknown()).optional(),
});

////////////
// Next Chat
////////////
export interface ListToolsResponse {
  tools: ToolSchema[];
}

export interface ToolSchema {
  name?: string;
  description?: string;
  inputSchema?: object;
  [key: string]: any;
}

export type McpClientData =
  | McpActiveClient
  | McpErrorClient
  | McpInitializingClient;

interface McpInitializingClient {
  client: null;
  tools: null;
  errorMsg: null;
}

interface McpActiveClient {
  client: Client;
  tools: ListToolsResponse;
  errorMsg: null;
}

interface McpErrorClient {
  client: null;
  tools: null;
  errorMsg: string;
}

// 服务器状态类型
export type ServerStatus =
  | "undefined"
  | "active"
  | "paused"
  | "error"
  | "initializing";

export interface ServerStatusResponse {
  status: ServerStatus;
  errorMsg: string | null;
}

// MCP 服务器配置相关类型

export const isServerSseConfig = (c?: ServerConfig): c is ServerSseConfig =>
  c !== null && typeof c === "object" && c.type === "sse";
export const isStreamableSseConfig = (c?: ServerConfig): c is ServerSseConfig =>
  c !== null && typeof c === "object" && c.type === "streamable";
export const isServerStdioConfig = (c?: ServerConfig): c is ServerStdioConfig =>
  c !== null && typeof c === "object" && (!c.type || c.type === "stdio");

export type ServerConfig =
  | ServerStdioConfig
  | ServerSseConfig
  | ServerSteamableConfig;

export interface ServerStdioConfig {
  type?: "stdio";
  command: string;
  args: string[];
  env?: Record<string, string>;
  status?: "active" | "paused" | "error";
}

export interface ServerSseConfig {
  type: "sse";
  url: string;
  headers?: Record<string, string>;
  status?: "active" | "paused" | "error";
}

export interface ServerSteamableConfig {
  type: "streamable";
  url: string;
  headers?: Record<string, string>;
  status?: "active" | "paused" | "error";
}

export interface McpConfigData {
  enableMcp?: boolean;
  // MCP Server 的配置
  mcpServers: Record<string, ServerConfig>;
}

export const DEFAULT_MCP_CONFIG: McpConfigData = {
  mcpServers: {},
};

export interface ArgsMapping {
  // 参数映射的类型
  type: "spread" | "single" | "env";

  // 参数映射的位置
  position?: number;

  // 参数映射的 key
  key?: string;
}

export interface PresetServer {
  // MCP Server 的唯一标识，作为最终配置文件 Json 的 key
  id: string;

  // MCP Server 的显示名称
  name: string;

  // MCP Server 的描述
  description: string;

  // MCP Server 的仓库地址
  repo: string;

  // MCP Server 的标签
  tags: string[];

  // MCP Server 的命令
  command: string;

  // MCP Server 的参数
  baseArgs: string[];

  // MCP Server 是否需要配置
  configurable: boolean;

  // MCP Server 的配置 schema
  configSchema?: {
    properties: Record<
      string,
      {
        type: string;
        description?: string;
        required?: boolean;
        minItems?: number;
      }
    >;
  };

  // MCP Server 的参数映射
  argsMapping?: Record<string, ArgsMapping>;
}
