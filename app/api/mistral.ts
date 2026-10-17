import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import {
  ACCESS_CODE_PREFIX,
  MISTRAL_BASE_URL,
  ModelProvider,
  OpenaiPath,
  ServiceProvider,
} from "@/app/constant";
import { isModelNotavailableInServer } from "@/app/utils/model";
import { auth } from "./auth";

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (req.method !== "POST" || params.path.join("/") !== OpenaiPath.ChatPath) {
    return NextResponse.json(
      { error: "Unsupported Mistral path" },
      { status: 404 },
    );
  }
  const authResult = auth(req, ModelProvider.Mistral);
  if (authResult.error) {
    return NextResponse.json(authResult, { status: 401 });
  }
  const authorization = req.headers.get("Authorization") ?? "";
  const apiKey = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!apiKey || apiKey.startsWith(ACCESS_CODE_PREFIX)) {
    return NextResponse.json(
      { error: "Mistral API key is not configured" },
      { status: 401 },
    );
  }

  let body: string;
  let model: string;
  try {
    body = await req.text();
    const payload = JSON.parse(body);
    if (
      !payload ||
      typeof payload.model !== "string" ||
      !payload.model.trim()
    ) {
      throw new Error("Missing model");
    }
    model = payload.model;
  } catch {
    return NextResponse.json(
      { error: "Invalid Mistral chat request" },
      { status: 400 },
    );
  }
  const serverConfig = getServerSideConfig();
  if (
    serverConfig.customModels &&
    isModelNotavailableInServer(
      serverConfig.customModels,
      model,
      ServiceProvider.Mistral,
    )
  ) {
    return NextResponse.json(
      { error: `You are not allowed to use ${model} model` },
      { status: 403 },
    );
  }

  let baseUrl = (serverConfig.mistralUrl || MISTRAL_BASE_URL)
    .trim()
    .replace(/\/+$/, "");
  if (!/^https?:\/\//.test(baseUrl)) {
    baseUrl = `https://${baseUrl}`;
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  req.signal.addEventListener("abort", abort, { once: true });
  if (req.signal.aborted) abort();
  const timeout = setTimeout(abort, 10 * 60 * 1000);
  const cleanup = () => {
    clearTimeout(timeout);
    req.signal.removeEventListener("abort", abort);
  };
  try {
    const response = await fetch(`${baseUrl}/${OpenaiPath.ChatPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body,
      signal: controller.signal,
      redirect: "manual",
    });
    clearTimeout(timeout);
    const headers = new Headers(response.headers);
    headers.delete("www-authenticate");
    // Fetch decodes the upstream body; these headers may no longer describe it.
    headers.delete("content-encoding");
    headers.delete("content-length");
    headers.set("X-Accel-Buffering", "no");
    const reader = response.body?.getReader();
    if (!reader) cleanup();
    const responseBody = reader
      ? new ReadableStream({
          async pull(streamController) {
            try {
              const { done, value } = await reader.read();
              if (done) {
                cleanup();
                streamController.close();
              } else {
                streamController.enqueue(value);
              }
            } catch (error) {
              cleanup();
              streamController.error(error);
            }
          },
          cancel(reason) {
            cleanup();
            controller.abort();
            return reader.cancel(reason);
          },
        })
      : null;
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    cleanup();
    return NextResponse.json(
      { error: "Failed to contact Mistral" },
      { status: controller.signal.aborted ? 504 : 502 },
    );
  }
}
