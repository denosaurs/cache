import { dirname, ensureDir, extname, join, resolve } from "./deps.ts";
import { exists, fetchFile } from "./file_fetcher.ts";
import { directory } from "./cache.ts";

export interface Policy {
  maxAge: number;
  strict?: boolean;
}

export const RELOAD_POLICY: Policy = {
  maxAge: -1,
};

function checkPolicy(file: File, policy: Policy): boolean {
  // birthtime is not available on all platforms.
  if (!file.lstat.birthtime && !policy.strict) return true;
  if (!file.lstat.birthtime) return false;
  if (policy.maxAge < 0) return false;

  const now = new Date();
  const then = file.lstat.birthtime;
  const delta = (now.getTime() - then.getTime()) / 1000;
  const stale = delta > policy.maxAge;
  return stale;
}

export enum Origin {
  CACHE = "cache",
  FETCH = "fetch",
}

interface IFile {
  url: URL;
  hash: string;
  path: string;
  metapath: string;
  meta: Metadata;
  lstat: Deno.FileInfo;
  origin: Origin;

  policy?: Policy;
  ns?: string;
}

export type File = Readonly<IFile>;

export interface Metadata {
  headers?: { [key: string]: string };
  url: string;
}

export class FileWrapper {
  metapath: string;

  static async create(
    url: URL,
    policy?: Policy,
    ns?: string,
  ): Promise<FileWrapper> {
    return new FileWrapper(
      url,
      await hash(url),
      await path(url, ns),
      policy,
      ns,
    );
  }

  constructor(
    public url: URL,
    public hash: string,
    public path: string,
    public policy?: Policy,
    public ns?: string,
  ) {
    this.metapath = metapath(url, ns);
  }

  async exists(): Promise<boolean> {
    return await exists(this.path);
  }

  async remove(): Promise<void> {
    await Deno.remove(this.path);
    await Deno.remove(this.metapath);
  }

  async ensure(): Promise<void> {
    return await ensureDir(dirname(this.path));
  }

  async read(): Promise<File> {
    const meta = await metaread(this.url, this.ns);
    return {
      ...this,
      lstat: await Deno.lstat(this.path),
      meta,
      origin: Origin.CACHE,
    };
  }

  async fetch(): Promise<File> {
    const meta = await fetchFile(this.url, this.path);
    await metasave(meta, this.url, this.ns);
    return {
      ...this,
      lstat: await Deno.lstat(this.path),
      meta,
      origin: Origin.FETCH,
    };
  }

  async get(): Promise<File> {
    await this.ensure();
    if (await this.exists()) {
      const file = await this.read();
      if (!this.policy) return file;
      if (checkPolicy(file, this.policy)) return file;
    }

    return await this.fetch();
  }
}

async function hash(url: URL): Promise<string> {
  const formatted = `${url.pathname}${url.search ? "?" + url.search : ""}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(formatted);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new TextDecoder().decode(hash);
}

async function path(url: URL, ns?: string): Promise<string> {
  let path = [directory()];
  if (ns) path.push(ns);
  path = path.concat([
    url.protocol.slice(0, -1),
    url.hostname,
    await hash(url),
  ]);
  return resolve(`${join(...path)}${extname(url.pathname)}`);
}

function metapath(url: URL, ns?: string) {
  return resolve(`${path(url, ns)}.metadata.json`);
}

async function metasave(meta: Metadata, url: URL, ns?: string): Promise<void> {
  await Deno.writeTextFile(metapath(url, ns), JSON.stringify(meta));
}

async function metaread(url: URL, ns?: string): Promise<Metadata> {
  const metadata = await Deno.readTextFile(metapath(url, ns));
  return JSON.parse(metadata) as Metadata;
}
