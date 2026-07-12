import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ANTHROPIC_BASE_URL, Anthropic } from "@/app/constant";

const serverConfig = getServerSideConfig();

export async function POST(req: NextRequest) {
  try {
    const { content, history } = await req.json();

    const claudeApiKey = serverConfig.anthropicApiKey || process.env.ANTHROPIC_API_KEY || "";
    const claudeModel = process.env.REVIEW_MODEL || "[限时福利]claude-sonnet-5";
    const reviewPrompt = process.env.REVIEW_PROMPT || "你是一个内容审核专家...";

    const baseUrl = serverConfig.anthropicUrl || ANTHROPIC_BASE_URL;

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${reviewPrompt}\n\n===完整对话历史===\n${history}\n\n===待审核内容===\n${content}`,
          },
        ],
      },
    ];

    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeApiKey || "",
        "anthropic-version": Anthropic.Vision,
      },
      body: JSON.stringify({
        model: claudeModel,
        messages: messages,
        max_tokens: 4096,
      }),
    });

    const result = await response.json();
    const claudeContent = result.content?.[0]?.text || "";

    const passed = claudeContent.includes("通过") && !claudeContent.includes("违规");
    let corrected = "";
    if (!passed) {
      const correctedMatch = claudeContent.match(/修正版[：:]\s*([\s\S]*?)(?=---|$)/);
      corrected = correctedMatch ? correctedMatch[1].trim() : content;
    }

    return NextResponse.json({
      passed,
      corrected: passed ? content : corrected,
      rawReview: claudeContent,
    });
  } catch (error) {
    console.error("[Review API] Error:", error);
    return NextResponse.json(
      { error: "审核失败" },
      { status: 500 }
    );
  }
}
