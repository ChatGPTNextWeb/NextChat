import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import md5 from "spark-md5";
import { ACCESS_CODE_PREFIX, ModelProvider, OpenaiPath } from "../constant";
import {
  AccountError,
  refreshSession,
  usesAccountRelay,
  userInfo,
} from "./account/new-api";
import { readAccountSession, type AccountSession } from "./account/session";

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

function parseApiKey(bearToken: string) {
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();
  const isApiKey = !token.startsWith(ACCESS_CODE_PREFIX);

  return {
    accessCode: isApiKey ? "" : token.slice(ACCESS_CODE_PREFIX.length),
    apiKey: isApiKey ? token : "",
  };
}

type OpenAIAuth =
  | { error: true; msg: string; status: number; clearSession?: boolean }
  | { error: false; refreshedSession?: AccountSession };

export async function authOpenAI(
  req: NextRequest,
  subpath: string,
): Promise<OpenAIAuth> {
  const { apiKey } = parseApiKey(req.headers.get("Authorization") ?? "");
  if (
    !apiKey &&
    (subpath === OpenaiPath.ChatPath || subpath === OpenaiPath.ListModelPath) &&
    usesAccountRelay(getServerSideConfig().baseUrl)
  ) {
    const session = await readAccountSession(req);
    if (session) {
      try {
        const active = await refreshSession(session);
        const user = await userInfo(active.access);
        if (user.id !== active.id)
          throw new AccountError(401, "登录已过期，请重新登录。");
        req.headers.set("Authorization", "Bearer " + active.chatKey);
        return {
          error: false,
          refreshedSession: active === session ? undefined : active,
        };
      } catch (error) {
        const status = error instanceof AccountError ? error.status : 502;
        return {
          error: true,
          msg:
            status === 401 ? "登录已过期，请重新登录。" : "暂时无法验证账号。",
          status,
          clearSession: status === 401,
        };
      }
    }
  }
  const legacy = auth(req, ModelProvider.GPT);
  return legacy.error
    ? { error: true, msg: legacy.msg ?? "Unauthorized", status: 401 }
    : { error: false };
}

export function auth(req: NextRequest, modelProvider: ModelProvider) {
  const authToken = req.headers.get("Authorization") ?? "";

  // check if it is openai api key or user token
  const { accessCode, apiKey } = parseApiKey(authToken);

  const hashedCode = md5.hash(accessCode ?? "").trim();

  const serverConfig = getServerSideConfig();
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  if (serverConfig.needCode && !serverConfig.codes.has(hashedCode) && !apiKey) {
    return {
      error: true,
      msg: !accessCode ? "empty access code" : "wrong access code",
    };
  }

  if (serverConfig.hideUserApiKey && !!apiKey) {
    return {
      error: true,
      msg: "you are not allowed to access with your own api key",
    };
  }

  // if user does not provide an api key, inject system api key
  if (!apiKey) {
    const serverConfig = getServerSideConfig();

    // const systemApiKey =
    //   modelProvider === ModelProvider.GeminiPro
    //     ? serverConfig.googleApiKey
    //     : serverConfig.isAzure
    //     ? serverConfig.azureApiKey
    //     : serverConfig.apiKey;

    let systemApiKey: string | undefined;

    switch (modelProvider) {
      case ModelProvider.Stability:
        systemApiKey = serverConfig.stabilityApiKey;
        break;
      case ModelProvider.GeminiPro:
        systemApiKey = serverConfig.googleApiKey;
        break;
      case ModelProvider.Claude:
        systemApiKey = serverConfig.anthropicApiKey;
        break;
      case ModelProvider.Doubao:
        systemApiKey = serverConfig.bytedanceApiKey;
        break;
      case ModelProvider.Ernie:
        systemApiKey = serverConfig.baiduApiKey;
        break;
      case ModelProvider.Qwen:
        systemApiKey = serverConfig.alibabaApiKey;
        break;
      case ModelProvider.Moonshot:
        systemApiKey = serverConfig.moonshotApiKey;
        break;
      case ModelProvider.Iflytek:
        systemApiKey =
          serverConfig.iflytekApiKey + ":" + serverConfig.iflytekApiSecret;
        break;
      case ModelProvider.DeepSeek:
        systemApiKey = serverConfig.deepseekApiKey;
        break;
      case ModelProvider.XAI:
        systemApiKey = serverConfig.xaiApiKey;
        break;
      case ModelProvider.ChatGLM:
        systemApiKey = serverConfig.chatglmApiKey;
        break;
      case ModelProvider.SiliconFlow:
        systemApiKey = serverConfig.siliconFlowApiKey;
        break;
      case ModelProvider.GPT:
      default:
        if (req.nextUrl.pathname.includes("azure/deployments")) {
          systemApiKey = serverConfig.azureApiKey;
        } else {
          systemApiKey = serverConfig.apiKey;
        }
    }

    if (systemApiKey) {
      console.log("[Auth] use system api key");
      req.headers.set("Authorization", `Bearer ${systemApiKey}`);
    } else {
      console.log("[Auth] admin did not provide an api key");
    }
  } else {
    console.log("[Auth] use user api key");
  }

  return {
    error: false,
  };
}
