// ActorAIchat Cloudflare Worker
// Static assets are served via [assets] in wrangler.toml
// This fallback handles SPA routing

export default {
  async fetch(request: Request): Promise<Response> {
    // All static files are handled by the [assets] binding.
    // This handler only receives requests for paths that don't match a file.
    const url = new URL(request.url);

    // For API paths that don't exist, return a helpful error
    if (url.pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({ error: "API not available in static mode" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // SPA fallback: serve index.html for any non-file path
    const index = await fetch(new URL("/index.html", request.url));
    return new Response(index.body, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
