"use client";

/**
 * Tandi NEO Local text runtime.
 *
 * Runs a compact text model in the visitor's browser through WebGPU.
 * This module does not provide image/video generation or CPU fallback.
 * It downloads a third-party open-weight model on first use.
 */
import type {
  ChatOptions,
  LLMApi,
  LLMModel,
  LLMUsage,
  SpeechOptions,
} from "../api";

export const NEO_MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const WEBLLM_URL = "https://esm.sh/@mlc-ai/web-llm@0.2.81";
type Engine = {
  chat: {
    completions: {
      create: (options: Record<string, unknown>) => Promise<any>;
    };
  };
};
let activeEngine: Promise<Engine> | undefined;
let hasConsent = false;

async function loadEngine(): Promise<Engine> {
  if (typeof window === "undefined" || !(navigator as Navigator & { gpu?: unknown }).gpu) {
    throw new Error(
      "Tandi NEO Local requer WebGPU. Este aparelho ou navegador não oferece suporte; não há fallback CPU nesta versão.",
    );
  }
  if (!hasConsent) {
    const approved = window.confirm(
      "Tandi NEO vai baixar um modelo de IA (pode ocupar centenas de MB ou mais) e executar o processamento neste dispositivo. O download utiliza servidores externos, mas o texto da conversa é processado localmente. Deseja continuar?",
    );
    if (!approved) throw new Error("Download do modelo não autorizado.");
    hasConsent = true;
  }
  if (!activeEngine) {
    activeEngine = (async () => {
      // This URL is a runtime module hosted by a third party; review its license
      // and pin/substitute with a self-hosted trusted artifact before production.
      const source: string = WEBLLM_URL;
      const webllm = await import(/* webpackIgnore: true */ source);
      return (await webllm.CreateMLCEngine(NEO_MODEL, {
        initProgressCallback: (state: { text?: string }) => {
          if (state?.text) console.info("[Tandi NEO]", state.text);
        },
      })) as Engine;
    })().catch((err) => {
      activeEngine = undefined;
      throw err;
    });
  }
  return activeEngine;
}

function asText(value: ChatOptions["messages"][number]["content"]): string {
  if (typeof value === "string") return value;
  // Current local model is text-only; don't pretend to understand images.
  if (value.some((item) => item.type === "image_url")) {
    throw new Error("O modelo local atual ainda não interpreta imagens.");
  }
  return value.map((item) => item.text ?? "").join("\n");
}

export class TandiNeoApi implements LLMApi {
  async chat(options: ChatOptions): Promise<void> {
    try {
      const engine = await loadEngine();
      const messages = options.messages.map((item) => ({
        role: item.role,
        content: asText(item.content),
      }));
      const controller = new AbortController();
      options.onController?.(controller);
      const stream = await engine.chat.completions.create({
        messages,
        stream: true,
        temperature: Math.min(1.5, Math.max(0, options.config.temperature ?? 0.6)),
        max_tokens: 256,
      });
      let text = "";
      for await (const part of stream) {
        if (controller.signal.aborted) throw new Error("Geração cancelada.");
        const delta = part.choices?.[0]?.delta?.content ?? "";
        text += delta;
        if (delta) options.onUpdate?.(text, delta);
      }
      options.onFinish(text, new Response(null, { status: 200 }));
    } catch (error) {
      options.onError?.(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  async speech(_options: SpeechOptions): Promise<ArrayBuffer> {
    throw new Error("Síntese de voz local ainda não implementada.");
  }

  async usage(): Promise<LLMUsage> {
    return { used: 0, total: 0 };
  }

  async models(): Promise<LLMModel[]> {
    return [{
      name: NEO_MODEL,
      displayName: "Tandi NEO Local (texto)",
      available: true,
      sorted: 0,
      provider: {
        id: "tandineo",
        providerName: "Tandi NEO",
        providerType: "local",
        sorted: 0,
      },
    }];
  }
}
