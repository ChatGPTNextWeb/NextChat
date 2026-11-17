import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PROMPT = 4000;
let busy = false;

function reject(status: number, error: string) {
  return NextResponse.json({ error }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function authorized(header: string | null, secret: string): boolean {
  if (!header || secret.length < 32) return false;
  const expected = Buffer.from("Bearer " + secret);
  const received = Buffer.from(header);
  return received.length === expected.length &&
    timingSafeEqual(received, expected);
}

// Restricted operator endpoint. Do not use this route from browser JavaScript.
// A future authenticated user gateway must provide sessions and persistent quotas.
export async function POST(request: NextRequest) {
  const operatorToken = process.env.TANDI_OPERATOR_TOKEN || "";
  const engineToken = process.env.TANDI_ENGINE_TOKEN || "";
  if (operatorToken.length < 32 || engineToken.length < 32) {
    return reject(503, "not_configured");
  }
  if (!authorized(request.headers.get("authorization"), operatorToken)) {
    return reject(401, "unauthorized");
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(contentLength) || contentLength > 16384) {
    return reject(413, "request_too_large");
  }
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return reject(400, "invalid_json");
  }
  const prompt = (input as { prompt?: unknown } | null)?.prompt;
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > MAX_PROMPT) {
    return reject(400, "invalid_prompt");
  }
  if (busy) return reject(429, "busy");
  busy = true;
  try {
    const response = await fetch("http://127.0.0.1:3211/v1/generate", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + engineToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(125000),
      cache: "no-store",
    });
    if (!response.ok) return reject(502, "engine_unavailable");
    const data = await response.json();
    return NextResponse.json({
      model: data.model,
      response: data.response,
      done: data.done,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return reject(502, "engine_unavailable");
  } finally {
    busy = false;
  }
}
