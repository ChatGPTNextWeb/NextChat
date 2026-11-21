import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  AccountError,
  login,
  logout,
  publicAccount,
  redeem,
  refreshSession,
  register,
  sendCode,
  userInfo,
} from "../new-api";
import {
  accountEnabled,
  readAccountSession,
  writeAccountSession,
} from "../session";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Context = { params: { action: string } };
const identity = z.string().trim().min(1).max(254);
const password = z.string().min(1).max(128);
const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());
const loginPayload = z.object({ username: identity, password });
const registration = loginPayload.extend({
  username: z.string().trim().min(1).max(20),
  password: z.string().min(8).max(128),
  email,
  verification: z.string().trim().min(1).max(32),
});

function json(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function failure(error: unknown) {
  if (error instanceof AccountError)
    return json({ error: error.message }, error.status);
  return json({ error: "账号服务暂时不可用，请稍后重试。" }, 502);
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    const parsed = new URL(origin);
    const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    return parsed.host === host && (parsed.protocol === "https:" || isLocal);
  } catch {
    return false;
  }
}

async function payload<T>(req: NextRequest, schema: z.ZodType<T>) {
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    throw new AccountError(415, "请发送 JSON 格式的数据。");
  const length = 4096;
  if (Number(req.headers.get("content-length")) > length)
    throw new AccountError(413, "请求内容过长。");
  try {
    const raw = await req.text();
    if (raw.length > length) throw new Error("Request too long");
    return schema.parse(JSON.parse(raw));
  } catch {
    throw new AccountError(400, "输入有误，请检查后重试。");
  }
}

export async function GET(req: NextRequest, { params }: Context) {
  if (!accountEnabled() || params.action !== "me") return json({}, 404);
  const session = await readAccountSession(req);
  if (!session) return json({ user: null }, 401);
  try {
    const active = await refreshSession(session);
    const user = await userInfo(active.access);
    const response = json({ user: publicAccount(user) });
    return active === session
      ? response
      : writeAccountSession(response, active);
  } catch (error) {
    const response = failure(error);
    return response.status === 401
      ? writeAccountSession(response, null)
      : response;
  }
}

export async function POST(req: NextRequest, { params }: Context) {
  if (!accountEnabled()) return json({}, 404);
  if (!sameOrigin(req)) return json({ error: "请求来源无效。" }, 403);
  try {
    switch (params.action) {
      case "send-code": {
        const body = await payload(req, z.object({ email }));
        await sendCode(body.email);
        return json({ success: true });
      }
      case "register": {
        const body = await payload(req, registration);
        await register(body);
        try {
          const { user, session } = await login(body.username, body.password);
          return writeAccountSession(
            json({ user: publicAccount(user) }),
            session,
          );
        } catch {
          return json({ error: "账号已注册，请切换到登录后重试。" }, 409);
        }
      }
      case "login": {
        const body = await payload(req, loginPayload);
        const { user, session } = await login(body.username, body.password);
        return writeAccountSession(
          json({ user: publicAccount(user) }),
          session,
        );
      }
      case "redeem": {
        const before = await readAccountSession(req);
        if (!before) throw new AccountError(401, "请先登录。");
        const body = await payload(
          req,
          z.object({ key: z.string().trim().min(1).max(128) }),
        );
        const session = await refreshSession(before);
        try {
          await redeem(session.access, body.key);
        } catch (error) {
          const response = failure(error);
          if (response.status === 401)
            return writeAccountSession(response, null);
          return session === before
            ? response
            : writeAccountSession(response, session);
        }
        // A failed balance lookup must not invite a retry of a successful redemption.
        const user = await userInfo(session.access).catch(() => null);
        const response = json({
          success: true,
          user: user ? publicAccount(user) : null,
        });
        return session === before
          ? response
          : writeAccountSession(response, session);
      }
      case "logout": {
        const session = await readAccountSession(req);
        if (session) await logout(session);
        return writeAccountSession(json({ success: true }), null);
      }
      default:
        return json({}, 404);
    }
  } catch (error) {
    return failure(error);
  }
}
