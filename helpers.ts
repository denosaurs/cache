import { fromFileUrl, resolve, toFileUrl } from "./deps.ts";

export function toURL(url: string | URL): URL {
  if (typeof url === "string") {
    if (
      url.startsWith("http:") || url.startsWith("https:") ||
      url.startsWith("file:")
    ) {
      url = new URL(url);
    } else {
      url = toFileUrl(resolve(url));
    }
  } else if (url.protocol === "file:") {
    url = toFileUrl(resolve(fromFileUrl(url)));
  }

  return url;
}
