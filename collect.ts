import { exists, resolve } from "./deps.ts";
import { CacheError } from "./cache.ts";

async function file(url: string, path: string) {
  url = resolve(url);
  if (!exists(url)) {
    throw new CacheError(`${path} does not exist on the local system.`);
  }
  await Deno.copyFile(url, path);
}

async function http(url: string, path: string) {
  const download = await fetch(url);
  if (!download.ok) throw new CacheError(download.statusText);

  const source = await download.arrayBuffer();
  await Deno.writeFile(path, new Uint8Array(source));
}

export async function collect(url: URL, path: string) {
  switch (url.protocol) {
    case "file":
      return file(url.href, path);

    case "http":
    case "https":
      return http(url.href, path);
  }
}
