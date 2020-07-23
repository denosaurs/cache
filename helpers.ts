import { CacheError } from "./cache.ts";
import { join, resolve } from "./deps.ts";

export function protocol(protocol: string) {
  return protocol.slice(0, -1);
}

export function toURL(url: string | URL): URL {
  if (typeof url === "string") {
    try {
      try {
        url = new URL(url);
      } catch {
        url = toFileUrl(url as string);
      }
    } catch (error) {
      throw new CacheError(error.message);
    }
  }

  if (url.protocol === "file:") {
    const pathname = resolve(join(url.host, url.pathname));
    url = new URL(
      encodeURI(`file://${pathname}`).replace(/[?#]/g, encodeURIComponent),
    );
  }

  return url;
}

export function toFileUrl(url: string): URL {
  let pathname = url.replace(/\\/g, "/");

  if (pathname[0] !== "/") {
    pathname = "/" + pathname;
  }

  return new URL(
    encodeURI(`file://${pathname}`).replace(/[?#]/g, encodeURIComponent),
  );
}
