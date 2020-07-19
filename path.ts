import { createHash } from "./deps.ts";

export function hash(value: string) {
  const url = new URL(value);
  const formatted = `${url.pathname}${url.search ? "?" + url.search : ""}`;
  return createHash("sha256").update(formatted).toString();
}
