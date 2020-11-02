import { exists as _exists, join } from "./deps.ts";
import { cachedir } from "./directories.ts";
import { File, FileWrapper, Origin, Policy, RELOAD_POLICY } from "./file.ts";
import { toURL } from "./helpers.ts";

export type { File, Policy };
export { Origin, RELOAD_POLICY };

interface Options {
  directory: string | undefined;
}

export class Wrapper {
  #namespace?: string;

  constructor(ns?: string) {
    this.#namespace = ns;
  }

  async cache(url: string | URL, policy?: Policy): Promise<File> {
    return await cache(url, policy, this.#namespace);
  }

  async remove(url: string | URL): Promise<boolean> {
    return await remove(url, this.#namespace);
  }

  async exists(url: string | URL): Promise<boolean> {
    return await exists(url, this.#namespace);
  }

  async purge(): Promise<boolean> {
    return await purge(this.#namespace);
  }
}

export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CacheError";
    // this.stack = undefined;
  }
}

export function namespace(ns: string): Wrapper {
  return new Wrapper(ns);
}

export function global(): Wrapper {
  return new Wrapper();
}

export function configure(opts: Options): void {
  options = opts;
}

export function directory(): string {
  return options.directory ?? cachedir();
}

export async function cache(
  url: string | URL,
  policy?: Policy,
  ns?: string,
): Promise<File> {
  const wrapper = new FileWrapper(toURL(url), policy, ns);
  return await wrapper.get();
}

export async function exists(url: string | URL, ns?: string): Promise<boolean> {
  const wrapper = new FileWrapper(toURL(url), undefined, ns);
  return await wrapper.exists();
}

export async function remove(url: string | URL, ns?: string): Promise<boolean> {
  const wrapper = new FileWrapper(toURL(url), undefined, ns);
  if (!(await wrapper.exists())) return false;
  await wrapper.remove();
  return true;
}

export async function purge(ns?: string): Promise<boolean> {
  const dir = [directory()];
  if (ns) dir.push(ns);
  const path = join(...dir);
  if (!(await _exists(path))) return false;
  await Deno.remove(path, { recursive: true });
  return true;
}

export let options: Options = {
  directory: undefined,
};
