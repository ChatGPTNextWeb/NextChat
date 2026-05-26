import { getServerSideConfig } from "@/app/config/server";
import {
  HUAWEI_BASE_URL,
  ApiPath,
  ModelProvider,
  Huawei,
} from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";

const serverConfig = getServerSideConfig();

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Huawei Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = auth(req, ModelProvider.Huawei);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const response = await request(req);
    return response;
  } catch (e) {
    console.error("[Huawei] ", e);
    return NextResponse.json(prettyObject(e));
  }
}
async function request(req: NextRequest) {
  const controller = new AbortController();

  let path = `${req.nextUrl.pathname}`.replaceAll(ApiPath.Huawei, "");
  const bodyText = await req.text();
  const body = JSON.parse(bodyText);
  let modelName = body.model as string;

  // 先用原始 modelName 获取 charUrl
  let baseUrl: string;
  let endpoint = "";
  if (modelName === "DeepSeek-V3") {
    endpoint = "271c9332-4aa6-4ff5-95b3-0cf8bd94c394";
  }
  if (modelName === "DeepSeek-R1") {
    endpoint = "8a062fd4-7367-4ab4-a936-5eeb8fb821c4";
  }


  let charUrl = HUAWEI_BASE_URL.concat("/")
    .concat(endpoint)
    .concat("/v1/chat/completions")
    .replace(/(?<!:)\/+/g, "/"); // 只替换不在 :// 后面的多个斜杠
  console.log(`current charUrl name:${charUrl}`);
  baseUrl = charUrl;

  // 处理请求体：1. 移除 system role 消息 2. 修改 model 名称格式
  const modifiedBody = {
    messages: body.messages
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))
      .filter((msg: any) => msg.role !== "system"),
    model: modelName.replace(/^(DeepSeek-(?:R1|V3)).*$/, "$1"), // 只保留 DeepSeek-R1 或 DeepSeek-V3
    stream: body.stream,
    temperature: body.temperature,
    presence_penalty: body.presence_penalty,
    frequency_penalty: body.frequency_penalty,
    top_p: body.top_p,
  };
  const modifiedBodyText = JSON.stringify(modifiedBody);
  console.log("Modified request body:", modifiedBodyText);

  // if(!baseUrl){
  //     baseUrl = HUAWEI_BASE_URL
  // }
  // baseUrl = Huawei.ChatPath(modelName) || serverConfig.huaweiUrl || HUAWEI_BASE_URL;
  console.log(
    `current model name:${modelName},current api path:${baseUrl}.........`,
  );
  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  console.log("[Proxy] ", path);
  console.log("[Base Url]", baseUrl);

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  // 如果 baseUrl 来自 Huawei.ChatPath，则不需要再拼接 path
  let fetchUrl = baseUrl.includes(HUAWEI_BASE_URL)
    ? baseUrl
    : `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: req.headers.get("Authorization") ?? "",
    "X-Forwarded-For": req.headers.get("X-Forwarded-For") ?? "",
    "X-Real-IP": req.headers.get("X-Real-IP") ?? "",
    "User-Agent": req.headers.get("User-Agent") ?? "",
  };
  console.debug(`headers.Authorization:${headers.Authorization}`);
  console.debug("serverConfig.huaweiApiKey: *****");
  // 如果没有 Authorization header，使用系统配置的 API key

  headers.Authorization = `Bearer ${serverConfig.huaweiApiKey}`;

  // #1815 try to refuse some request to some models
  // if (serverConfig.customModels) {
  //     try {
  //         const jsonBody = JSON.parse(bodyText);  // 直接使用已解析的 body
  //
  //         if (
  //             isModelNotavailableInServer(
  //                 serverConfig.customModels,
  //                 jsonBody?.model as string,
  //                 ServiceProvider.Huawei as string,
  //             )
  //         ) {
  //             return NextResponse.json(
  //                 {
  //                     error: true,
  //                     message: `you are not allowed to use ${jsonBody?.model} model`,
  //                 },
  //                 {
  //                     status: 403,
  //                 },
  //             );
  //         }
  //     } catch (e) {
  //         console.error(`[Huawei] filter`, e);
  //     }
  // }
  try {
    const res = await fetch(fetchUrl, {
      headers,
      method: req.method,
      body: modifiedBodyText,
      redirect: "manual",
      // @ts-ignore
      duplex: "half",
      signal: controller.signal,
    });
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
export { Huawei };
