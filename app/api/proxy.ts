import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/\.+$/, "");
}

function parseHttpUrl(raw: string | null): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function isOpenAIApiHost(baseUrl: string | null): boolean {
  const url = parseHttpUrl(baseUrl);
  if (!url) return false;
  return normalizeHostname(url.hostname) === "api.openai.com";
}

function ipv4Octets(host: string): [number, number, number, number] | null {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const octets: [number, number, number, number] = [
    Number(m[1]),
    Number(m[2]),
    Number(m[3]),
    Number(m[4]),
  ];
  if (octets.some((n) => n > 255)) return null;
  return octets;
}

function isBlockedIPv4(a: number, b: number): boolean {
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const host = normalizeHostname(hostname);

  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "metadata.google.internal" ||
    host.endsWith(".internal") ||
    host === "0.0.0.0"
  ) {
    return true;
  }

  const dotted = ipv4Octets(host);
  if (dotted) return isBlockedIPv4(dotted[0], dotted[1]);

  if (/^\d+$/.test(host)) {
    const n = Number(host);
    if (n >= 0 && n <= 0xffffffff) {
      return isBlockedIPv4((n >>> 24) & 255, (n >>> 16) & 255);
    }
  }

  if (host.includes(":")) {
    const h = host.replace(/^\[|\]$/g, "");
    if (h === "::1" || h === "0:0:0:0:0:0:0:1") return true;
    if (h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")) {
      return true;
    }
    const mapped = h.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
    if (mapped) {
      const d = ipv4Octets(mapped[1]);
      if (d) return isBlockedIPv4(d[0], d[1]);
    }
  }

  return false;
}

export function isBlockedProxyTarget(baseUrl: string | null): boolean {
  const url = parseHttpUrl(baseUrl);
  if (!url) return true;
  return isBlockedHostname(url.hostname);
}

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Proxy Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }
  const serverConfig = getServerSideConfig();

  // remove path params from searchParams
  req.nextUrl.searchParams.delete("path");
  req.nextUrl.searchParams.delete("provider");

  const parsedBase = parseHttpUrl(req.headers.get("x-base-url"));
  if (!parsedBase || isBlockedHostname(parsedBase.hostname)) {
    return NextResponse.json(
      { error: true, msg: "x-base-url target is not allowed" },
      { status: 400 },
    );
  }

  const base = `${parsedBase.origin}${parsedBase.pathname}`.replace(/\/$/, "");
  const subpath = params.path.join("/");
  const fetchUrl = `${base}/${subpath}?${req.nextUrl.searchParams.toString()}`;
  const skipHeaders = ["connection", "host", "origin", "referer", "cookie"];
  const headers = new Headers(
    Array.from(req.headers.entries()).filter((item) => {
      if (
        item[0].indexOf("x-") > -1 ||
        item[0].indexOf("sec-") > -1 ||
        skipHeaders.includes(item[0])
      ) {
        return false;
      }
      return true;
    }),
  );
  // Inject the server OpenAI key only when the hostname is api.openai.com.
  if (isOpenAIApiHost(parsedBase.origin)) {
    if (!serverConfig.apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }
    headers.set("Authorization", `Bearer ${serverConfig.apiKey}`);
  }

  const controller = new AbortController();
  const fetchOptions: RequestInit = {
    headers,
    method: req.method,
    body: req.body,
    // to fix #2485: https://stackoverflow.com/questions/55920957/cloudflare-worker-typeerror-one-time-use-body
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  try {
    const res = await fetch(fetchUrl, fetchOptions);
    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");

    // The latest version of the OpenAI API forced the content-encoding to be "br" in json response
    // So if the streaming is disabled, we need to remove the content-encoding header
    // Because Vercel uses gzip to compress the response, if we don't remove the content-encoding header
    // The browser will try to decode the response with brotli and fail
    newHeaders.delete("content-encoding");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
