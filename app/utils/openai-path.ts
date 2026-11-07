/**
 * Join an OpenAI-compatible base URL with a NextChat request path.
 *
 * Chat, model, speech, and image paths are already versioned (`v1/...`).
 * Many OpenAI-compatible APIs document the base with that same `/v1`
 * suffix. Keep a single version segment so those bases do not become
 * `/v1/v1/...`. Paths outside `v1` (Azure deployment routes, billing
 * dashboard routes) are joined unchanged, including a `/v1` that is part
 * of a longer base such as a Cloudflare AI Gateway URL.
 */
export function joinOpenAIPath(baseUrl: string, path: string): string {
  let base = baseUrl.trim().replace(/\/+$/, "");
  const suffix = path.trim().replace(/^\/+/, "");

  const queryIndex = suffix.search(/[?#]/);
  const suffixPath = queryIndex === -1 ? suffix : suffix.slice(0, queryIndex);

  if (
    base.endsWith("/v1") &&
    (suffixPath === "v1" || suffixPath.startsWith("v1/"))
  ) {
    base = base.slice(0, -"/v1".length).replace(/\/+$/, "");
  }

  if (!suffix) return base;
  return `${base}/${suffix}`;
}
