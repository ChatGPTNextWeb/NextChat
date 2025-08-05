"use client";
import {
  ApiPath,
  Alibaba,
  ALIBABA_BASE_URL,
  REQUEST_TIMEOUT_MS,
} from "@/app/constant";
import {
  useAccessStore,
  useAppConfig,
  useChatStore,
  ChatMessageTool,
  usePluginStore,
  FunctionToolItem,
} from "@/app/store";
import {
  preProcessImageContentForAlibabaDashScope,
  streamWithThink,
} from "@/app/utils/chat";
import {
  ChatOptions,
  getHeaders,
  LLMApi,
  LLMModel,
  SpeechOptions,
  MultimodalContent,
  MultimodalContentForAlibaba,
} from "../api";
import { getClientConfig } from "@/app/config/client";
import {
  getMessageTextContent,
  getMessageTextContentWithoutThinking,
  getTimeoutMSByModel,
  isVisionModel,
} from "@/app/utils";
import { fetch } from "@/app/utils/stream";

export interface OpenAIListModelResponse {
  object: string;
  data: Array<{
    id: string;
    object: string;
    root: string;
  }>;
}

interface RequestInput {
  messages: {
    role: "system" | "user" | "assistant";
    content: string | MultimodalContent[];
  }[];
}
interface RequestParam {
  result_format: string;
  incremental_output?: boolean;
  temperature: number;
  repetition_penalty?: number;
  top_p: number;
  max_tokens?: number;
  tools?: FunctionToolItem[];
  enable_search?: boolean;
}
interface RequestPayload {
  model: string;
  input: RequestInput;
  parameters: RequestParam;
}

export class QwenApi implements LLMApi {
  private audioContext?: AudioContext;
  path(path: string): string {
    const accessStore = useAccessStore.getState();

    let baseUrl = "";

    if (accessStore.useCustomConfig) {
      baseUrl = accessStore.alibabaUrl;
    }

    if (baseUrl.length === 0) {
      const isApp = !!getClientConfig()?.isApp;
      baseUrl = isApp ? ALIBABA_BASE_URL : ApiPath.Alibaba;
    }

    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, baseUrl.length - 1);
    }
    if (!baseUrl.startsWith("http") && !baseUrl.startsWith(ApiPath.Alibaba)) {
      baseUrl = "https://" + baseUrl;
    }

    console.log("[Proxy Endpoint] ", baseUrl, path);

    return [baseUrl, path].join("/");
  }

  extractMessage(res: any) {
    return res?.output?.choices?.at(0)?.message?.content ?? "";
  }

  async speech(options: SpeechOptions): Promise<ArrayBuffer> {
    throw new Error("Method not implemented.");
  }

  async *streamSpeech(options: SpeechOptions): AsyncGenerator<AudioBuffer> {
    const requestPayload = {
      model: options.model,
      input: {
        text: options.input,
        voice: options.voice,
      },
      speed: options.speed,
      response_format: options.response_format,
    };
    const controller = new AbortController();
    options.onController?.(controller);
    try {
      const speechPath = this.path(Alibaba.SpeechPath);
      const speechPayload = {
        method: "POST",
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: {
          ...getHeaders(),
          "X-DashScope-SSE": "enable",
        },
      };

      // make a fetch request
      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      const res = await fetch(speechPath, speechPayload);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = line.slice(5);
            const json = JSON.parse(data);
            if (json.output.audio.data) {
              yield this.PCMBase64ToAudioBuffer(json.output.audio.data);
            }
          }
        }
      }
      clearTimeout(requestTimeoutId);
      reader.releaseLock();
    } catch (e) {
      console.log("[Request] failed to make a speech request", e);
      throw e;
    }
  }

  async chat(options: ChatOptions) {
    const modelConfig = {
      ...useAppConfig.getState().modelConfig,
      ...useChatStore.getState().currentSession().mask.modelConfig,
      ...{
        model: options.config.model,
      },
    };

    const visionModel = isVisionModel(options.config.model);

    const messages: ChatOptions["messages"] = [];
    for (const v of options.messages) {
      const content = (
        visionModel
          ? await preProcessImageContentForAlibabaDashScope(v.content)
          : v.role === "assistant"
          ? getMessageTextContentWithoutThinking(v)
          : getMessageTextContent(v)
      ) as any;

      messages.push({ role: v.role, content });
    }

    const shouldStream = !!options.config.stream;
    const requestPayload: RequestPayload = {
      model: modelConfig.model,
      input: {
        messages,
      },
      parameters: {
        result_format: "message",
        incremental_output: shouldStream,
        temperature: modelConfig.temperature,
        // max_tokens: modelConfig.max_tokens,
        top_p: modelConfig.top_p === 1 ? 0.99 : modelConfig.top_p, // qwen top_p is should be < 1
        enable_search: modelConfig.enableNetWork,
      },
    };

    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const headers = {
        ...getHeaders(),
        "X-DashScope-SSE": shouldStream ? "enable" : "disable",
      };

      const chatPath = this.path(Alibaba.ChatPath(modelConfig.model));
      const chatPayload = {
        method: "POST",
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: headers,
      };

      // make a fetch request
      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        getTimeoutMSByModel(options.config.model),
      );

      if (shouldStream) {
        const [tools, funcs] = usePluginStore
          .getState()
          .getAsTools(
            useChatStore.getState().currentSession().mask?.plugin || [],
          );
        // console.log("getAsTools", tools, funcs);
        const _tools = tools as unknown as FunctionToolItem[];
        if (_tools && _tools.length > 0) {
          requestPayload.parameters.tools = _tools;
        }
        return streamWithThink(
          chatPath,
          requestPayload,
          headers,
          [],
          funcs,
          controller,
          // parseSSE
          (text: string, runTools: ChatMessageTool[]) => {
            // console.log("parseSSE", text, runTools);
            const json = JSON.parse(text);
            const choices = json.output.choices as Array<{
              message: {
                content: string | null | MultimodalContentForAlibaba[];
                tool_calls: ChatMessageTool[];
                reasoning_content: string | null;
              };
            }>;

            if (!choices?.length) return { isThinking: false, content: "" };

            const tool_calls = choices[0]?.message?.tool_calls;
            if (tool_calls?.length > 0) {
              const index = tool_calls[0]?.index;
              const id = tool_calls[0]?.id;
              const args = tool_calls[0]?.function?.arguments;
              if (id) {
                runTools.push({
                  id,
                  type: tool_calls[0]?.type,
                  function: {
                    name: tool_calls[0]?.function?.name as string,
                    arguments: args,
                  },
                });
              } else {
                // @ts-ignore
                runTools[index]["function"]["arguments"] += args || "";
              }
            }

            const reasoning = choices[0]?.message?.reasoning_content;
            const content = choices[0]?.message?.content;

            // Skip if both content and reasoning_content are empty or null
            if (
              (!reasoning || reasoning.length === 0) &&
              (!content || content.length === 0)
            ) {
              return {
                isThinking: false,
                content: "",
              };
            }

            if (reasoning && reasoning.length > 0) {
              return {
                isThinking: true,
                content: reasoning,
              };
            } else if (content && content.length > 0) {
              return {
                isThinking: false,
                content: Array.isArray(content)
                  ? content.map((item) => item.text).join(",")
                  : content,
              };
            }

            return {
              isThinking: false,
              content: "",
            };
          },
          // processToolMessage, include tool_calls message and tool call results
          (
            requestPayload: RequestPayload,
            toolCallMessage: any,
            toolCallResult: any[],
          ) => {
            requestPayload?.input?.messages?.splice(
              requestPayload?.input?.messages?.length,
              0,
              toolCallMessage,
              ...toolCallResult,
            );
          },
          options,
        );
      } else {
        const res = await fetch(chatPath, chatPayload);
        clearTimeout(requestTimeoutId);

        const resJson = await res.json();
        const message = this.extractMessage(resJson);
        options.onFinish(message, res);
      }
    } catch (e) {
      console.log("[Request] failed to make a chat request", e);
      options.onError?.(e as Error);
    }
  }
  async usage() {
    return {
      used: 0,
      total: 0,
    };
  }

  async models(): Promise<LLMModel[]> {
    return [];
  }

  // 播放 PCM base64 数据
  private async PCMBase64ToAudioBuffer(base64Data: string) {
    try {
      // 解码 base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 转换为 AudioBuffer
      const audioBuffer = await this.convertToAudioBuffer(bytes);

      return audioBuffer;
    } catch (error) {
      console.error("播放 PCM 数据失败:", error);
      throw error;
    }
  }

  // 将 PCM 字节数据转换为 AudioBuffer
  private convertToAudioBuffer(pcmData: Uint8Array) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    const audioContext = this.audioContext;
    const channels = 1;
    const sampleRate = 24000;
    return new Promise<AudioBuffer>((resolve, reject) => {
      try {
        let float32Array;
        // 16位 PCM 转换为 32位浮点数
        float32Array = this.pcm16ToFloat32(pcmData);

        // 创建 AudioBuffer
        const audioBuffer = audioContext.createBuffer(
          channels,
          float32Array.length / channels,
          sampleRate,
        );

        // 复制数据到 AudioBuffer
        for (let channel = 0; channel < channels; channel++) {
          const channelData = audioBuffer.getChannelData(channel);
          for (let i = 0; i < channelData.length; i++) {
            channelData[i] = float32Array[i * channels + channel];
          }
        }

        resolve(audioBuffer);
      } catch (error) {
        reject(error);
      }
    });
  }
  // 16位 PCM 转 32位浮点数
  private pcm16ToFloat32(pcmData: Uint8Array) {
    const length = pcmData.length / 2;
    const float32Array = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      const int16 = (pcmData[i * 2 + 1] << 8) | pcmData[i * 2];
      const int16Signed = int16 > 32767 ? int16 - 65536 : int16;
      float32Array[i] = int16Signed / 32768;
    }

    return float32Array;
  }
}
export { Alibaba };
