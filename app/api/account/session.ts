import type { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cookieName = "__Host-geyoujie-account";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const sessionSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  sid: z.string().min(1),
  access: z.string().min(1),
  refresh: z.string().regex(/^[A-Za-z0-9_.-]+$/),
  accessExpires: z.number().int().positive(),
  expires: z.number().int().positive(),
  chatKey: z.string().regex(/^sk-[A-Za-z0-9_-]+$/),
});

export type AccountSession = z.infer<typeof sessionSchema>;

function encode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function decode(value: string) {
  return Uint8Array.from(
    atob(value.replaceAll("-", "+").replaceAll("_", "/")),
    (character) => character.charCodeAt(0),
  );
}

function secret() {
  const value = process.env.ACCOUNT_SESSION_SECRET;
  return value && /^[A-Fa-f0-9]{64}$/.test(value) ? value : undefined;
}

export function accountEnabled() {
  return !!secret();
}

async function sessionKey() {
  const value = secret();
  if (!value) throw new Error("Account sessions are not configured");
  const bytes = Uint8Array.from(value.match(/../g)!, (pair) =>
    Number.parseInt(pair, 16),
  );
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

export function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

export async function readAccountSession(req: NextRequest) {
  const token = req.cookies.get(cookieName)?.value;
  if (!token || token.length > 3900 || !accountEnabled()) return null;
  try {
    const [version, iv, ciphertext, extra] = token.split(".");
    if (version !== "1" || !iv || !ciphertext || extra !== undefined)
      return null;
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: decode(iv),
        additionalData: encoder.encode(cookieName),
      },
      await sessionKey(),
      decode(ciphertext),
    );
    const session = sessionSchema.parse(JSON.parse(decoder.decode(plaintext)));
    return session.expires > nowSeconds() ? session : null;
  } catch {
    return null;
  }
}

export async function writeAccountSession(
  response: NextResponse,
  session: AccountSession | null,
) {
  let value = "";
  if (session) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: encoder.encode(cookieName) },
      await sessionKey(),
      encoder.encode(JSON.stringify(sessionSchema.parse(session))),
    );
    value = `1.${encode(iv)}.${encode(new Uint8Array(ciphertext))}`;
    if (value.length > 3900) throw new Error("Account session is too large");
  }
  response.cookies.set(cookieName, value, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: session ? Math.max(0, session.expires - nowSeconds()) : 0,
  });
  return response;
}
