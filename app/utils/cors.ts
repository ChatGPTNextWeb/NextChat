import { getClientConfig } from "../config/client";
import { ApiPath, DEFAULT_API_HOST } from "../constant";

export function corsPath(path: string) {
  const baseUrl = getClientConfig()?.isApp ? `${DEFAULT_API_HOST}` : "";

  if (baseUrl === "" && path === "") {
    return "";
  }
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  if (!path.endsWith("/")) {
    path += "/";
  }

  return `${baseUrl}${path}`;
}
