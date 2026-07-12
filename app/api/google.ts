import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { getServerSideConfig } from "@/app/config/server";
import { ApiPath, GEMINI_BASE_URL, ModelProvider, ANTHROPIC_BASE_URL, Anthropic } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

// ===== 审核相关辅助函数 =====

async function readStreamToText(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // 解析SSE格式（Gemini的流式响应）
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const json = JSON.parse(line.slice(6));
          if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
            fullText += json.candidates[0].content.parts[0].text;
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }
  return fullText;
}

async function reviewWithClaude(
  fullHistory: string,
  geminiOutput: string,
  claudeApiKey: string,
  claudeModel: string,
  reviewPrompt: string,
): Promise<{ passed: boolean; corrected: string; rawReview: string }> {
  const baseUrl = serverConfig.anthropicUrl || ANTHROPIC_BASE_URL;

  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `${reviewPrompt}\n\n===完整对话历史===\n${fullHistory}\n\n===待审核内容===\n${geminiOutput}`,
        },
      ],
    },
  ];

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": claudeApiKey,
      "anthropic-version": Anthropic.Vision,
    },
    body: JSON.stringify({
      model: claudeModel,
      messages: messages,
      max_tokens: 4096,
    }),
  });

  const result = await response.json();
  const content = result.content?.[0]?.text || "";

  // 如果包含"通过"且不包含"违规"，则判定为通过
  if (content.includes("通过") && !content.includes("违规")) {
    return { passed: true, corrected: geminiOutput, rawReview: content };
  }

  // 提取修正版
  const correctedMatch = content.match(/修正版[：:]\s*([\s\S]*?)(?=---|$)/);
  const corrected = correctedMatch ? correctedMatch[1].trim() : geminiOutput;

  return { passed: false, corrected, rawReview: content };
}

export async function handle(
  req: NextRequest,
  { params }: { params: { provider: string; path: string[] } },
) {
  console.log("[Google Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = auth(req, ModelProvider.GeminiPro);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  const bearToken =
    req.headers.get("x-goog-api-key") || req.headers.get("Authorization") || "";
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();

  const apiKey = token ? token : serverConfig.googleApiKey;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: true,
        message: `missing GOOGLE_API_KEY in server env vars`,
      },
      {
        status: 401,
      },
    );
  }
  try {
    const response = await request(req, apiKey);
    return response;
  } catch (e) {
    console.error("[Google] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
export const preferredRegion = [
  "bom1",
  "cle1",
  "cpt1",
  "gru1",
  "hnd1",
  "iad1",
  "icn1",
  "kix1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
];

async function request(req: NextRequest, apiKey: string) {
  // ===== 调试日志：确认代码是否被执行 =====
  console.log("[Review] request() called, ENABLE_REVIEW =", process.env.ENABLE_REVIEW);
  console.log("[Review] ANTHROPIC_API_KEY =", process.env.ANTHROPIC_API_KEY ? "已设置" : "未设置");
  // ===== 调试日志结束 =====

  const controller = new AbortController();

  let baseUrl = serverConfig.googleUrl || GEMINI_BASE_URL;

  let path = `${req.nextUrl.pathname}`.replaceAll(ApiPath.Google, "");

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
  const fetchUrl = `${baseUrl}${path}${
    req?.nextUrl?.searchParams?.get("alt") === "sse" ? "?alt=sse" : ""
  }`;

  console.log("[Fetch Url] ", fetchUrl);
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "x-goog-api-key":
        req.headers.get("x-goog-api-key") ||
        (req.headers.get("Authorization") ?? "").replace("Bearer ", ""),
    },
    method: req.method,
    body: req.body,
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  try {
    const res = await fetch(fetchUrl, fetchOptions);

    if (!res.body) {
      return new Response(null, { status: 500, statusText: "No response body" });
    }

    // 判断是否需要审核
    const enableReview = process.env.ENABLE_REVIEW === "true";
    console.log("[Review] enableReview =", enableReview);
    
    if (!enableReview) {
      // 不启用审核，直接转发
      console.log("[Review] 审核未启用，直接转发");
      const newHeaders = new Headers(res.headers);
      newHeaders.delete("www-authenticate");
      newHeaders.set("X-Accel-Buffering", "no");
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders,
      });
    }

    // ===== 启用审核 =====
    console.log("[Review] 开始审核流程...");
    try {
      // 1. 读取完整响应内容
      const fullText = await readStreamToText(res.body);
      console.log("[Review] 读取Gemini响应完成，长度:", fullText.length);

      // 2. 获取必要参数（从环境变量读取）
      const claudeApiKey = process.env.ANTHROPIC_API_KEY || "";
      const claudeModel = process.env.REVIEW_MODEL || "[限时福利]claude-sonnet-5";
      const reviewPrompt = process.env.REVIEW_PROMPT || "你是一个严格的内容审核员...";

      console.log("[Review] claudeApiKey:", claudeApiKey ? "已设置" : "未设置");
      console.log("[Review] claudeModel:", claudeModel);

      // 3. 获取对话历史（从请求体中解析）
      let fullHistory = "";
      try {
        // 注意：req.body 可能已经被消费，需要重新构建
        const bodyText = await req.text();
        const bodyJson = JSON.parse(bodyText);
        if (bodyJson.messages) {
          fullHistory = bodyJson.messages.map((m: any) => `${m.role}: ${m.content}`).join("\n");
        }
      } catch (e) {
        console.error("[Review] Failed to parse history:", e);
      }

      // 4. 执行审核
      console.log("[Review] 调用Claude审核...");
      const reviewResult = await reviewWithClaude(
        fullHistory,
        fullText,
        claudeApiKey,
        claudeModel,
        reviewPrompt,
      );

      console.log("[Review] 审核完成, passed =", reviewResult.passed);

      // 5. 确定最终输出文本
      const finalText = reviewResult.passed ? fullText : reviewResult.corrected;

      // 6. 将最终文本重新构造成流式响应
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const data = {
            candidates: [
              {
                content: {
                  parts: [{ text: finalText }],
                },
              },
            ],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      const newHeaders = new Headers(res.headers);
      newHeaders.delete("www-authenticate");
      newHeaders.set("X-Accel-Buffering", "no");
      newHeaders.set("Content-Type", "text/event-stream");

      return new Response(stream, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders,
      });
    } catch (error) {
      console.error("[Review] Error:", error);
      // 出错时降级：直接返回原始响应
      const newHeaders = new Headers(res.headers);
      newHeaders.delete("www-authenticate");
      newHeaders.set("X-Accel-Buffering", "no");
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders,
      });
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
