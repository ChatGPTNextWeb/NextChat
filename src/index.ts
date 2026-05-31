// ActorAIchat Cloudflare Worker
// Static assets in out/ are served automatically via [assets] in wrangler.toml
// This handler only receives requests for paths that don't match a static file

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // API paths are not available in static mode
    if (url.pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({ error: "API not available in static mode" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // SPA fallback: redirect to root, HashRouter handles the rest
    return Response.redirect(url.origin + "/#" + url.pathname, 302);
  },
};
