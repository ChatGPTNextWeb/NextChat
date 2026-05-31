// ActorAIchat Cloudflare Worker
// Serves static assets from out/ directory via [assets] binding

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Try to serve the request from static assets
    let response = await env.ASSETS.fetch(request);

    // If the asset was found, return it
    if (response.status !== 404) {
      return response;
    }

    // SPA fallback: serve index.html for any path that doesn't match a static file
    const indexRequest = new Request(new URL("/index.html", request.url));
    return env.ASSETS.fetch(indexRequest);
  },
};
