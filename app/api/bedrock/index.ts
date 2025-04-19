import { ModelProvider, Bedrock as BedrockConfig } from "@/app/constant";
import { getServerSideConfig } from "@/app/config/server";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const ALLOWED_PATH = new Set([BedrockConfig.ChatPath]);

// Helper to get AWS Credentials
function getAwsCredentials() {
  const config = getServerSideConfig();
  if (!config.isBedrock) {
    throw new Error(
      "AWS Bedrock is not configured properly (ENABLE_AWS_BEDROCK is not true)",
    );
  }
  if (!config.bedrockAccessKeyId) {
    throw new Error("AWS Bedrock Access Key ID is missing or empty.");
  }
  if (!config.bedrockSecretAccessKey) {
    throw new Error("AWS Bedrock Secret Access Key is missing or empty.");
  }
  return {
    accessKeyId: config.bedrockAccessKeyId as string,
    secretAccessKey: config.bedrockSecretAccessKey as string,
  };
}

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Bedrock Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  if (!ALLOWED_PATH.has(subpath)) {
    console.log("[Bedrock Route] forbidden path ", subpath);
    return NextResponse.json(
      { error: true, msg: "you are not allowed to request " + subpath },
      { status: 403 },
    );
  }

  // Auth check specifically for Bedrock (might not need header API key)
  const authResult = auth(req, ModelProvider.Bedrock);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: 401 });
  }

  try {
    const config = getServerSideConfig();

    const bedrockRegion = config.bedrockRegion as string;
    const bedrockEndpoint = config.bedrockEndpoint;

    const client = new BedrockRuntimeClient({
      region: bedrockRegion,
      credentials: getAwsCredentials(),
      endpoint: bedrockEndpoint || undefined,
    });

    const body = await req.json();
    console.log(
      "[Bedrock] Request - Model:",
      body.model,
      "Stream:",
      body.stream,
      "Messages count:",
      body.messages.length,
    );

    const {
      messages,
      model,
      stream = false,
      temperature = 0.7,
      max_tokens,
    } = body;

    // --- Payload formatting for Claude on Bedrock ---
    const isClaudeModel = model.includes("anthropic.claude");
    if (!isClaudeModel) {
      return NextResponse.json(
        { error: true, msg: "Unsupported Bedrock model: " + model },
        { status: 400 },
      );
    }

    const systemPrompts = messages.filter((msg: any) => msg.role === "system");
    const userAssistantMessages = messages.filter(
      (msg: any) => msg.role !== "system",
    );

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: max_tokens || 4096,
      temperature: temperature,
      messages: userAssistantMessages.map((msg: any) => ({
        role: msg.role, // 'user' or 'assistant'
        content:
          typeof msg.content === "string"
            ? [{ type: "text", text: msg.content }]
            : msg.content, // Assuming MultimodalContent format is compatible
      })),
      ...(systemPrompts.length > 0 && {
        system: systemPrompts.map((msg: any) => msg.content).join("\n"),
      }),
    };
    // --- End Payload Formatting ---

    if (stream) {
      const command = new InvokeModelWithResponseStreamCommand({
        modelId: model,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      });
      const response = await client.send(command);

      if (!response.body) {
        throw new Error("Empty response stream from Bedrock");
      }
      const responseBody = response.body;

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of responseBody) {
              if (event.chunk?.bytes) {
                const chunkData = JSON.parse(decoder.decode(event.chunk.bytes));
                let responseText = "";
                let finishReason: string | null = null;

                if (
                  chunkData.type === "content_block_delta" &&
                  chunkData.delta.type === "text_delta"
                ) {
                  responseText = chunkData.delta.text || "";
                } else if (chunkData.type === "message_stop") {
                  finishReason =
                    chunkData["amazon-bedrock-invocationMetrics"]
                      ?.outputTokenCount > 0
                      ? "stop"
                      : "length"; // Example logic
                }

                // Format as OpenAI SSE chunk
                const sseData = {
                  id: `chatcmpl-${nanoid()}`,
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: model,
                  choices: [
                    {
                      index: 0,
                      delta: { content: responseText },
                      finish_reason: finishReason,
                    },
                  ],
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`),
                );

                if (finishReason) {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  break; // Exit loop after stop message
                }
              }
            }
          } catch (error) {
            console.error("[Bedrock] Streaming error:", error);
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Non-streaming response
      const command = new InvokeModelCommand({
        modelId: model,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      });
      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      // Format response to match OpenAI
      const formattedResponse = {
        id: `chatcmpl-${nanoid()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: responseBody.content?.[0]?.text ?? "",
            },
            finish_reason: "stop", // Assuming stop for non-streamed
          },
        ],
        usage: {
          prompt_tokens:
            responseBody["amazon-bedrock-invocationMetrics"]?.inputTokenCount ??
            -1,
          completion_tokens:
            responseBody["amazon-bedrock-invocationMetrics"]
              ?.outputTokenCount ?? -1,
          total_tokens:
            (responseBody["amazon-bedrock-invocationMetrics"]
              ?.inputTokenCount ?? 0) +
              (responseBody["amazon-bedrock-invocationMetrics"]
                ?.outputTokenCount ?? 0) || -1,
        },
      };
      return NextResponse.json(formattedResponse);
    }
  } catch (e) {
    console.error("[Bedrock] API Handler Error:", e);
    return NextResponse.json(prettyObject(e), { status: 500 });
  }
}

// Need nanoid for unique IDs
import { nanoid } from "nanoid";
