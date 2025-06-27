import { getServerSideConfig } from "@/app/config/server";
import { ALIBABA_BASE_URL, ApiPath, ModelProvider } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";

const serverConfig = getServerSideConfig();

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  // console.log("[Alibaba Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = auth(req, ModelProvider.Qwen);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const response = await request(req);
    return response;
  } catch (e) {
    console.error("[Alibaba] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

async function request(req: NextRequest) {
  const controller = new AbortController();

  // alibaba use base url or just remove the path
  let path = `${req.nextUrl.pathname}`
    .replaceAll(ApiPath.Alibaba, "")
    .replace("/api", "");

  let baseUrl = serverConfig.alibabaUrl || ALIBABA_BASE_URL;

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

  console.log("[Alibaba] fetchUrl", fetchUrl);

  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("Authorization") ?? "",
      "X-DashScope-SSE": req.headers.get("X-DashScope-SSE") ?? "disable",
    },
    method: req.method,
    body: req.body,
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  console.log("[Proxy] Alibaba options: ", fetchOptions);

  // #1815 try to refuse some request to some models
  if (serverConfig.customModels && req.body) {
    try {
      const clonedBody = await req.text();
      let jsonBody: any = {};

      try {
        jsonBody = JSON.parse(clonedBody);

        // Move input.messages to messages at the root level if present
        if (jsonBody.input && Array.isArray(jsonBody.input.messages)) {
          jsonBody.messages = jsonBody.input.messages;

          // Remove input.messages to avoid duplication
          delete jsonBody.input;

          jsonBody.stream = true;
        }

        const current_model = jsonBody?.model;
        console.log("[Alibaba] custom models", current_model);

        //kiem tra xem model co phai la qwen-vl hay khong (vision model)
        if (current_model && current_model.startsWith("qwen-vl")) {
          console.log("[Alibaba] current model is qwen-vl");
          console.log("xu ly hinh anh trong message");

          // Reformat image objects in messages
          if (Array.isArray(jsonBody.messages)) {
            jsonBody.messages = jsonBody.messages.map((msg: any) => {
              if (Array.isArray(msg.content)) {
                msg.content = msg.content.map((item: any) => {
                  if (item && typeof item === "object" && "image" in item) {
                    return {
                      type: "image_url",
                      image_url: {
                        url: item.image,
                      },
                    };
                  }
                  return item;
                });
              }
              return msg;
            });
          }
        }

        // console.log("[Alibaba] request body json", jsonBody);

        fetchOptions.body = JSON.stringify(jsonBody);
      } catch (e) {
        fetchOptions.body = clonedBody; // fallback if not JSON
      }

      // console.log("[Alibaba] request body", fetchOptions.body);

      // not undefined and is false
      // if (
      //   isModelNotavailableInServer(
      //     serverConfig.customModels,
      //     jsonBody?.model as string,
      //     ServiceProvider.Alibaba as string,
      //   )
      // ) {
      //   return NextResponse.json(
      //     {
      //       error: true,
      //       message: `you are not allowed to use ${jsonBody?.model} model`,
      //     },
      //     {
      //       status: 403,
      //     },
      //   );
      // }
    } catch (e) {
      console.error(`[Alibaba] filter`, e);
    }
  }
  try {
    const res = await fetch(fetchUrl, fetchOptions);

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
  } finally {
    clearTimeout(timeoutId);
  }
}
