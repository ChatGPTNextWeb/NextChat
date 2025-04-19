"use client";

import { ApiPath, Bedrock } from "@/app/constant";
import { LLMApi, ChatOptions, LLMModel, LLMUsage, SpeechOptions } from "../api";
import { getHeaders } from "../api";
import { fetch } from "@/app/utils/stream";

export class BedrockApi implements LLMApi {
  path(path: string): string {
    // Route requests to our backend handler
    const apiPath = `${ApiPath.Bedrock}/${path}`;
    console.log("[BedrockApi] Constructed API path:", apiPath);
    return apiPath;
  }

  async chat(options: ChatOptions) {
    const messages = options.messages;
    const modelConfig = options.config;

    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const chatPath = this.path(Bedrock.ChatPath);
      console.log("[BedrockApi] Requesting path:", chatPath);

      const chatPayload = {
        method: "POST",
        body: JSON.stringify({
          model: modelConfig.model,
          messages,
          temperature: modelConfig.temperature,
          stream: !!modelConfig.stream,
          max_tokens: 4096, // Example: You might want to make this configurable
        }),
        signal: controller.signal,
        headers: getHeaders(), // getHeaders should handle Bedrock (no auth needed)
      };
      console.log("[BedrockApi] Request payload (excluding messages):", {
        model: modelConfig.model,
        temperature: modelConfig.temperature,
        stream: !!modelConfig.stream,
      });

      // Handle stream response
      if (modelConfig.stream) {
        const response = await fetch(chatPath, chatPayload);
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let messageBuffer = "";

        if (!reader) {
          throw new Error("Response body reader is not available");
        }

        while (true) {
          // Loop until stream is done
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true }); // Decode chunk
          const lines = text.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const jsonData = line.substring("data:".length).trim();
            if (jsonData === "[DONE]") break; // End of stream
            if (!jsonData) continue;

            try {
              const data = JSON.parse(jsonData);
              const content = data.choices?.[0]?.delta?.content ?? "";
              const finishReason = data.choices?.[0]?.finish_reason;

              if (content) {
                messageBuffer += content;
                options.onUpdate?.(messageBuffer, content);
              }
              if (finishReason) {
                // Potentially handle finish reason if needed
                console.log(
                  "[BedrockApi] Stream finished with reason:",
                  finishReason,
                );
                break; // Exit inner loop on finish signal within a chunk
              }
            } catch (e) {
              console.error(
                "[BedrockApi] Error parsing stream chunk:",
                jsonData,
                e,
              );
            }
          }
        }
        reader.releaseLock(); // Release reader lock
        options.onFinish(messageBuffer, response);
      } else {
        // Handle non-streaming response
        const response = await fetch(chatPath, chatPayload);
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            "[BedrockApi] Non-stream error response:",
            response.status,
            errorBody,
          );
          throw new Error(
            `Request failed with status ${response.status}: ${errorBody}`,
          );
        }
        const responseJson = await response.json();
        const content = responseJson.choices?.[0]?.message?.content ?? "";
        options.onFinish(content, response);
      }
    } catch (e) {
      console.error("[BedrockApi] Chat request failed:", e);
      options.onError?.(e as Error);
    }
  }

  async usage(): Promise<LLMUsage> {
    // Bedrock usage reporting might require separate implementation if available
    return {
      used: 0,
      total: Number.MAX_SAFE_INTEGER, // Indicate no limit or unknown
    };
  }

  async models(): Promise<LLMModel[]> {
    // Fetching models dynamically from Bedrock is complex and usually not needed
    // Rely on the hardcoded models in constant.ts
    return [];
  }

  async speech(options: SpeechOptions): Promise<ArrayBuffer> {
    // Implement if Bedrock TTS is needed
    throw new Error("Speech synthesis not supported for Bedrock yet");
  }
}
