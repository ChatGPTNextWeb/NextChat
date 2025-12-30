import { getServerSideConfig } from "@/app/config/server";
import {
  BAICHUAN_BASE_URL,
  ApiPath,
  ModelProvider,
  ServiceProvider,
} from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";
import { isModelNotavailableInServer } from "@/app/utils/model";

const serverConfig = getServerSideConfig();

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Baichuan Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = auth(req, ModelProvider.Baichuan);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const response = await request(req);
    return response;
  } catch (e) {
    console.error("[Baichuan] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

async function request(req: NextRequest) {
  const controller = new AbortController();

  let path = `${req.nextUrl.pathname}`.replaceAll(ApiPath.Baichuan, "");

  let baseUrl = serverConfig.baichuanUrl || BAICHUAN_BASE_URL;

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

  const fetchUrl = `${baseUrl}${path}`;
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("Authorization") ?? "",
    },
    method: req.method,
    body: req.body,
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  // #1815 try to refuse some request to some models
  if (serverConfig.customModels && req.body) {
    try {
      const clonedBody = await req.text();
      fetchOptions.body = clonedBody;

      const jsonBody = JSON.parse(clonedBody) as { model?: string };

      // not undefined and is false
      if (
        isModelNotavailableInServer(
          serverConfig.customModels,
          jsonBody?.model as string,
          ServiceProvider.Baichuan as string,
        )
      ) {
        return NextResponse.json(
          {
            error: true,
            message: `you are not allowed to use ${jsonBody?.model} model`,
          },
          {
            status: 403,
          },
        );
      }
    } catch (e) {
      console.error(`[Baichuan] filter`, e);
    }
  }
  try {
    const res = await fetch(fetchUrl, fetchOptions);

    // 检查响应状态
    if (!res.ok) {
      let errorMessage = `Baichuan API Error: ${res.status} ${res.statusText}`;
      try {
        const errorBody = await res.text();
        if (errorBody) {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
        }
      } catch (e) {
        console.error("[Baichuan] Failed to parse error response:", e);
      }
      
      return NextResponse.json(
        {
          error: true,
          message: errorMessage,
        },
        {
          status: res.status,
        },
      );
    }

    // 检查响应体是否为空
    if (!res.body) {
      console.error("[Baichuan] Empty response body from server");
      return NextResponse.json(
        {
          error: true,
          message: "Empty response from Baichuan API",
        },
        {
          status: 500,
        },
      );
    }

    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } catch (fetchError: any) {
    console.error("[Baichuan] Fetch error:", fetchError);
    clearTimeout(timeoutId);
    
    // 处理各种网络错误
    let errorMessage = "Network error";
    if (fetchError.name === "AbortError") {
      errorMessage = "Request timeout";
    } else if (fetchError.message) {
      errorMessage = fetchError.message;
    }
    
    return NextResponse.json(
      {
        error: true,
        message: `Baichuan API request failed: ${errorMessage}`,
      },
      {
        status: 500,
      },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

