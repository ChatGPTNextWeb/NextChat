import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { MCPClientLogger } from "./logger";
import { ListToolsResponse, McpRequestMessage, ServerConfig } from "./types";
import { z } from "zod";

const logger = new MCPClientLogger();

export async function createClient(
  id: string,
  config: ServerConfig,
): Promise<Client> {
  logger.info(`Creating client for ${id}...`);

  let transport;

  if (config.type === "sse") {
    const { SSEClientTransport } = await import(
      "@modelcontextprotocol/sdk/client/sse.js"
    );
    transport = new SSEClientTransport(new URL(config.url));
  } else if (config.type === "streamable") {
    const { StreamableHTTPClientTransport } = await import(
      "@modelcontextprotocol/sdk/client/streamableHttp.js"
    );
    transport = new StreamableHTTPClientTransport(new URL(config.url));
  } else {
    if (EXPORT_MODE) {
      throw new Error(
        "Cannot use stdio transport in export mode. Please use SSE transport configuration instead.",
      );
    } else {
      const { StdioClientTransport } = await import(
        "@modelcontextprotocol/sdk/client/stdio.js"
      );
      transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: {
          ...Object.fromEntries(
            Object.entries(process.env)
              .filter(([_, v]) => v !== undefined)
              .map(([k, v]) => [k, v as string]),
          ),
          ...(config.env || {}),
        },
      });
    }
  }

  const client = new Client(
    {
      name: `nextchat-mcp-client-${id}`,
      version: "1.0.0",
    },
    {
      capabilities: {},
    },
  );
  await client.connect(transport);
  return client;
}

export async function removeClient(client: Client) {
  logger.info(`Removing client...`);
  await client.close();
}

export async function listTools(client: Client): Promise<ListToolsResponse> {
  return client.listTools();
}

export async function executeRequest(
  client: Client,
  request: McpRequestMessage,
) {
  return client.request(request, z.any());
}
