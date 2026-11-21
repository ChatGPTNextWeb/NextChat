import { z } from "zod";
import { nowSeconds, type AccountSession } from "./session";

const tokenName = "geyoujie-web-default";
const models = ["deepseek-flash", "deepseek-v4-pro"];
const refreshCookie = "new_api_refresh";
const quotaPerDollar = 500_000;
const pendingTokens = new Map<number, Promise<string>>();

const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  quota: z.number().int(),
});
const authSchema = z.object({
  access_token: z.string().min(1),
  access_expires_at: z.number().int(),
  session: z.object({ sid: z.string().min(1), expires_at: z.number().int() }),
});
const tokenSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  status: z.number(),
  expired_time: z.number(),
  unlimited_quota: z.boolean(),
  model_limits_enabled: z.boolean(),
  model_limits: z.string(),
  allow_user_quota_query: z.boolean(),
});
const tokenPage = z.object({
  items: z.array(tokenSchema),
  total: z.number().int().nonnegative(),
});
const envelope = z.object({ success: z.boolean(), data: z.unknown() });

export type AccountUser = z.infer<typeof userSchema>;
type AuthData = Omit<AccountSession, "chatKey" | "id" | "username">;

export class AccountError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function apiOrigin() {
  return new URL(
    process.env.NEW_API_ACCOUNT_ORIGIN || "https://api.geyoujie.com",
  ).origin;
}

export function usesAccountRelay(baseUrl?: string) {
  if (!baseUrl) return false;
  try {
    const url = new URL(
      baseUrl.startsWith("http") ? baseUrl : "https://" + baseUrl,
    );
    return (
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.origin === apiOrigin() &&
      (url.pathname === "/" || url.pathname.replace(/\/$/, "") === "/v1")
    );
  } catch {
    return false;
  }
}

async function call(
  path: string,
  options: { body?: object; access?: string; session?: AuthData } = {},
) {
  const headers = new Headers({ Accept: "application/json" });
  if (options.body) headers.set("Content-Type", "application/json");
  if (options.access) headers.set("Authorization", "Bearer " + options.access);
  if (options.session) {
    headers.set("Cookie", refreshCookie + "=" + options.session.refresh);
    headers.set("X-Auth-Session", options.session.sid);
    headers.set("Origin", apiOrigin());
  }
  try {
    const response = await fetch(apiOrigin() + path, {
      method: options.body ? "POST" : "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 429)
      throw new AccountError(429, "操作过于频繁，请稍后再试。");
    if (response.status === 401 || response.status === 403)
      return { response, data: undefined, success: false };
    if (!response.ok) throw new Error("Unsuccessful upstream response");
    return { response, ...envelope.parse(await response.json()) };
  } catch (error) {
    if (error instanceof AccountError) throw error;
    throw new AccountError(502, "账号服务暂时不可用，请稍后重试。");
  }
}

function authData(response: Response, value: unknown): AuthData {
  const result = authSchema.safeParse(value);
  const cookie = response.headers.get("set-cookie") ?? "";
  const refresh = cookie.match(
    /(?:^|,\s*)new_api_refresh=([A-Za-z0-9_.-]+)/,
  )?.[1];
  if (!result.success || !refresh)
    throw new AccountError(401, "登录未完成，请核对账号、密码和验证要求。");
  const data = result.data;
  return {
    sid: data.session.sid,
    access: data.access_token,
    refresh,
    accessExpires: data.access_expires_at,
    expires: data.session.expires_at,
  };
}

export function publicAccount(user: AccountUser) {
  return { username: user.username, balanceUsd: user.quota / quotaPerDollar };
}

export async function sendCode(email: string) {
  const result = await call(
    "/api/verification?email=" + encodeURIComponent(email),
  );
  if (!result.success)
    throw new AccountError(400, "验证码发送失败，请检查邮箱或稍后重试。");
}

export async function register(body: {
  username: string;
  password: string;
  email: string;
  verification: string;
}) {
  const { verification, ...credentials } = body;
  const result = await call("/api/user/register", {
    body: { ...credentials, verification_code: verification },
  });
  if (!result.success)
    throw new AccountError(400, "注册失败，请检查验证码、邮箱和用户名。");
}

export async function userInfo(access: string) {
  const result = await call("/api/user/self", { access });
  if (!result.success) throw new AccountError(401, "登录已过期，请重新登录。");
  return userSchema.parse(result.data);
}

async function findDefaultToken(access: string) {
  let oldest: z.infer<typeof tokenSchema> | undefined;
  const pageSize = 100;
  for (let page = 1; page <= 50; page++) {
    const result = await call(
      "/api/token/?p=" + page + "&page_size=" + pageSize,
      {
        access,
      },
    );
    if (!result.success) throw new AccountError(401, "无法读取个人令牌。");
    const { items, total } = tokenPage.parse(result.data);
    for (const token of items) {
      if (
        token.name === tokenName &&
        token.status === 1 &&
        token.expired_time === -1 &&
        token.unlimited_quota &&
        token.model_limits_enabled &&
        !token.allow_user_quota_query &&
        token.model_limits.split(",").sort().join(",") === models.join(",") &&
        (!oldest || token.id < oldest.id)
      ) {
        oldest = token;
      }
    }
    if (!items.length || page * pageSize >= total) return oldest?.id;
  }
  throw new AccountError(409, "账号的令牌过多，无法建立聊天会话。");
}

async function issueChatKey(access: string) {
  let id = await findDefaultToken(access);
  if (!id) {
    await call("/api/token/", {
      access,
      body: {
        name: tokenName,
        expired_time: -1,
        remain_quota: 0,
        unlimited_quota: true,
        model_limits_enabled: true,
        model_limits: models.join(","),
        allow_user_quota_query: false,
      },
    });
    id = await findDefaultToken(access);
    if (!id) throw new AccountError(502, "无法建立个人聊天令牌。");
  }
  const result = await call("/api/token/" + id + "/key", { access, body: {} });
  if (!result.success) throw new AccountError(502, "无法读取个人聊天令牌。");
  const { key } = z
    .object({ key: z.string().regex(/^[A-Za-z0-9_-]+$/) })
    .parse(result.data);
  return key.startsWith("sk-") ? key : "sk-" + key;
}

function defaultChatKey(userId: number, access: string) {
  const pending = pendingTokens.get(userId);
  if (pending) return pending;
  const operation = issueChatKey(access).finally(() =>
    pendingTokens.delete(userId),
  );
  pendingTokens.set(userId, operation);
  return operation;
}

export async function login(username: string, password: string) {
  const result = await call("/api/user/login", {
    body: { username, password },
  });
  if (!result.success) throw new AccountError(401, "账号或密码不正确。");
  const auth = authData(result.response, result.data);
  try {
    const user = await userInfo(auth.access);
    const chatKey = await defaultChatKey(user.id, auth.access);
    return {
      user,
      session: { ...auth, id: user.id, username: user.username, chatKey },
    };
  } catch (error) {
    await logout(auth).catch(() => undefined);
    throw error;
  }
}

export async function refreshSession(session: AccountSession) {
  if (session.accessExpires > nowSeconds() + 30) return session;
  const result = await call("/api/user/auth/refresh", { body: {}, session });
  if (!result.success) throw new AccountError(401, "登录已过期，请重新登录。");
  const updated = authData(result.response, result.data);
  if (updated.sid !== session.sid)
    throw new AccountError(401, "登录状态异常，请重新登录。");
  return { ...session, ...updated };
}

export async function redeem(access: string, key: string) {
  const result = await call("/api/user/topup", { access, body: { key } });
  if (result.response.status === 401 || result.response.status === 403)
    throw new AccountError(401, "登录已过期，请重新登录。");
  if (!result.success)
    throw new AccountError(400, "兑换码无效、已使用或已过期。");
  return z.number().int().positive().parse(result.data);
}

export async function logout(session: AuthData) {
  const result = await call("/api/user/auth/logout", {
    access: session.access,
    body: {},
    session,
  });
  if (!result.success && result.response.status !== 401)
    throw new AccountError(502, "账号服务暂时无法完成退出，请重试。");
}
