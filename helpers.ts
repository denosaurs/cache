import { CacheError } from "./cache.ts";
import { join, resolve } from "./deps.ts";

export function protocol(protocol: string) {
  return protocol.slice(0, -1);
}

export function toURL(url: string | URL): URL {
  if (typeof url === "string") {
    try {
      try {
        if (url.startsWith("file://")) {
          url = resolveFileURL(url);
        } else {
          url = new URL(url);
        }
      } catch (error) {
        url = resolveFileURL(url);
      }
    } catch (error) {
      throw new CacheError(error.message);
    }
  } else if (url.protocol === "file:") {
    url = resolveFileURL(url);
  }

  return url;
}

export function resolveFileURL(url: URL | string): URL {
  let pathname;

  if (typeof url === "string") {
    pathname = resolve(url.replace("file://", ""));
  } else {
    pathname = resolve(join(url.host, url.pathname));
  }

  pathname = pathname.replace(/\\/g, "/"); // windows, grr

  while (pathname[0] !== "/") {
    pathname = pathname.substr(pathname.indexOf("/"));
  }

  return new URL(
    encodeURI(`file://${pathname}`).replace(/[?#]/g, encodeURIComponent),
  );
}
