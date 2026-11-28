import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import {
  ACCESS_CODE_PREFIX,
  MODELFOLD_ORIGIN,
  OpenaiPath,
  ServiceProvider,
} from "@/app/constant";
import { isModelNotavailableInServer } from "@/app/utils/model";

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  const isChat = req.method === "POST" && path === OpenaiPath.ChatPath;
  if (!isChat && !(req.method === "GET" && path === OpenaiPath.ListModelPath)) {
    return new Response(null, { status: 404 });
  }

  const config = getServerSideConfig();
  const key = req.headers
    .get("Authorization")
    ?.match(/^Bearer ([^\s,]+)$/i)?.[1];
  if (config.hideUserApiKey || !key || key.startsWith(ACCESS_CODE_PREFIX)) {
    return NextResponse.json(
      { error: "A user-supplied ModelFold key is required." },
      { status: 401 },
    );
  }

  let body: string | undefined;
  if (isChat) {
    body = await req.text();
    let model: unknown;
    try {
      model = JSON.parse(body)?.model;
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }
    if (typeof model !== "string" || !model)
      return new Response(null, { status: 400 });
    if (
      (config.customModels || process.env.DISABLE_GPT4 === "1") &&
      isModelNotavailableInServer(
        config.customModels || "",
        model,
        ServiceProvider.ModelFold,
      )
    ) {
      return NextResponse.json(
        { error: "Model not allowed." },
        { status: 403 },
      );
    }
  }

  try {
    const response = await fetch(`${MODELFOLD_ORIGIN}/${path}`, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body,
      signal: req.signal,
      redirect: "error",
      cache: "no-store",
    });
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "ModelFold is unavailable." },
      { status: 502 },
    );
  }
}
