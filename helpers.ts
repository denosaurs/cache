import { CacheError } from "./cache.ts";

export function protocol(protocol: string) {
  return protocol.slice(0, -1);
}

export function toURL(url: string | URL): URL {
  if (typeof url === "string") {
    try {
      url = new URL(url);
    } catch (error) {
      throw new CacheError(error.message);
    }
  }
  return url;
}
