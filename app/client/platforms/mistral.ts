"use client";

import {
  ApiPath,
  DEFAULT_MODELS,
  MISTRAL_BASE_URL,
  OpenaiPath,
  ServiceProvider,
} from "@/app/constant";
import {
  ChatMessageTool,
  useAccessStore,
  useAppConfig,
  useChatStore,
  usePluginStore,
} from "@/app/store";
import { getClientConfig } from "@/app/config/client";
import { getMessageTextContent, getTimeoutMSByModel } from "@/app/utils";
import { stream } from "@/app/utils/chat";
import { fetch } from "@/app/utils/stream";
import {
  ChatOptions,
  getHeaders,
  LLMApi,
  LLMModel,
  SpeechOptions,
} from "../api";
import type { RequestPayload } from "./openai";

type Content = string | { type: string; text?: string }[] | null;

function getText(content?: Content): string {
  return typeof content === "string"
    ? content
    : content
        ?.filter((chunk) => chunk.type === "text")
        .map((chunk) => chunk.text ?? "")
        .join("") ?? "";
}

export class MistralApi implements LLMApi {
  path(path: string): string {
    const access = useAccessStore.getState();
    let baseUrl = access.useCustomConfig ? access.mistralUrl.trim() : "";
    if (!baseUrl) {
      baseUrl = getClientConfig()?.isApp ? MISTRAL_BASE_URL : ApiPath.Mistral;
    }
    if (!/^https?:\/\//.test(baseUrl) && !baseUrl.startsWith("/")) {
      baseUrl = `https://${baseUrl}`;
    }
    return `${baseUrl.replace(/\/+$/, "")}/${path}`;
  }

  extractMessage(res: { choices?: { message?: { content?: Content } }[] }) {
    return getText(res.choices?.[0]?.message?.content);
  }

  async chat(options: ChatOptions) {
    const modelConfig = {
      ...useAppConfig.getState().modelConfig,
      ...useChatStore.getState().currentSession().mask.modelConfig,
    };
    const requestPayload: RequestPayload = {
      model: options.config.model,
      messages: options.messages.map((message) => ({
        role: message.role,
        content: getMessageTextContent(message),
      })),
      stream: options.config.stream,
      // Mistral accepts at most 1.5; the shared settings allow up to 2.
      temperature: Math.min(modelConfig.temperature, 1.5),
      top_p: modelConfig.top_p,
      presence_penalty: modelConfig.presence_penalty,
      frequency_penalty: modelConfig.frequency_penalty,
      max_tokens: modelConfig.max_tokens,
    };
    const controller = new AbortController();
    options.onController?.(controller);
    const chatPath = this.path(OpenaiPath.ChatPath);
    const headers = getHeaders();

    try {
      if (options.config.stream) {
        const [tools, funcs] = usePluginStore
          .getState()
          .getAsTools(
            useChatStore.getState().currentSession().mask.plugin || [],
          );
        const toolCalls = new Map<number, ChatMessageTool>();
        return stream(
          chatPath,
          requestPayload,
          headers,
          tools as any[],
          funcs as Record<string, Function>,
          controller,
          (text, runTools) => {
            const delta = JSON.parse(text).choices?.[0]?.delta;
            for (const call of delta?.tool_calls ?? []) {
              let tool = toolCalls.get(call.index);
              if (!tool && call.id) {
                tool = {
                  id: call.id,
                  type: call.type,
                  function: {
                    name: call.function?.name ?? "",
                    arguments: "",
                  },
                };
                toolCalls.set(call.index, tool);
                runTools.push(tool);
              }
              if (tool?.function) {
                tool.function.arguments += call.function?.arguments ?? "";
              }
            }
            return getText(delta?.content);
          },
          (payload, toolCallMessage, toolCallResults) => {
            toolCalls.clear();
            payload.messages.push(toolCallMessage, ...toolCallResults);
          },
          options,
        );
      }

      const timeout = setTimeout(
        () => controller.abort(),
        getTimeoutMSByModel(options.config.model),
      );
      try {
        const response = await fetch(chatPath, {
          method: "POST",
          headers,
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.error?.message ??
              result.message ??
              `Mistral request failed (${response.status})`,
          );
        }
        options.onFinish(this.extractMessage(result), response);
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      options.onError?.(error as Error);
    }
  }

  async speech(_options: SpeechOptions): Promise<ArrayBuffer> {
    throw new Error("Mistral speech is not supported by this provider.");
  }

  async usage() {
    return { used: 0, total: 0 };
  }

  async models(): Promise<LLMModel[]> {
    return DEFAULT_MODELS.filter(
      (model) => model.provider.providerName === ServiceProvider.Mistral,
    );
  }
}
