import { ApiPath } from "@/app/constant";
import { NextRequest } from "next/server";
import { handle as openaiHandler } from "../../openai";
import { handle as azureHandler } from "../../azure";
import { handle as googleHandler } from "../../google";
import { handle as moonshotHandler } from "../../moonshot";
import { handle as stabilityHandler } from "../../stability";
import { handle as deepseekHandler } from "../../deepseek";
import { handle as xaiHandler } from "../../xai";
import { handle as proxyHandler } from "../../proxy";
import { handle as ai302Handler } from "../../302ai";

async function handle(
  req: NextRequest,
  { params }: { params: { provider: string; path: string[] } },
) {
  const apiPath = `/api/${params.provider}`;
  console.log(`[${params.provider} Route] params `, params);
  switch (apiPath) {
    case ApiPath.Azure:
      return azureHandler(req, { params });
    case ApiPath.Google:
      return googleHandler(req, { params });
    case ApiPath.Moonshot:
      return moonshotHandler(req, { params });
    case ApiPath.Stability:
      return stabilityHandler(req, { params });
    case ApiPath.DeepSeek:
      return deepseekHandler(req, { params });
    case ApiPath.XAI:
      return xaiHandler(req, { params });
    case ApiPath.OpenAI:
      return openaiHandler(req, { params });
    case ApiPath["302.AI"]:
      return ai302Handler(req, { params });
    default:
      return proxyHandler(req, { params });
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
export const preferredRegion = [
  "arn1",
  "bom1",
  "cdg1",
  "cle1",
  "cpt1",
  "dub1",
  "fra1",
  "gru1",
  "hnd1",
  "iad1",
  "icn1",
  "kix1",
  "lhr1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
];
