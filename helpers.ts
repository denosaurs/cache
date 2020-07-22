import { CacheError } from "./cache.ts";

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
  return url;
}

export function toFileUrl(url: string): URL {
  let pathName = url.replace(/\\/g, "/");

  if (pathName[0] !== "/") {
    pathName = "/" + pathName;
  }

  return new URL(
    encodeURI(`file://${pathName}`).replace(/[?#]/g, encodeURIComponent),
  );
}
