// ActorAIchat Cloudflare Worker
// Static files served automatically via [assets] with SPA fallback.
// This handler only runs for paths that don't match assets (API, etc).

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API routes return 404 (not available in static mode)
    if (url.pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({ error: "API not available in static mode" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Delegate to assets binding (SPA fallback handled by platform)
    return env.ASSETS.fetch(request);
  },
};
