import { collect } from "./collect.ts";
import { cachedir, tmpdir } from "./directories.ts";

interface File {
  url: string;
  info: Deno.FileInfo;
  path: string;
}

export interface Control {
  maxAge?: number;
  maxStale?: number;
  minFresh?: number;
}

export class Wrapper {
  namespace?: string;

  constructor(ns?: string) {
    this.namespace = ns;
  }

  async fetch(url: string, control?: Control): Promise<File> {
    return await fetch(url, control, this.namespace);
  }

  async remove(url: string): Promise<boolean> {
    return await remove(url, this.namespace);
  }

  async purge(): Promise<boolean> {
    return await purge(this.namespace);
  }
}

export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CacheError";
    this.stack = undefined;
  }
}

export function namespace(ns: string): Wrapper {
  return new Wrapper(ns);
}

export function global(): Wrapper {
  return new Wrapper();
}

export async function fetch(
  url: string,
  control?: Control,
  ns?: string,
): Promise<File> {
  return {
    url,
    info: Deno.lstatSync("README.md"),
    path: "a",
  };
}

export async function remove(url: string, ns?: string): Promise<boolean> {
  return true;
}

export async function purge(ns?: string): Promise<boolean> {
  return true;
}
