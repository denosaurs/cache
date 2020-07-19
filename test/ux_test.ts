import { Cache } from "../mod.ts";

Deno.test({
  name: "ux",
  async fn(): Promise<void> {
    let cache = Cache.namespace("plug_plugins");
    cache.fetch("file://./README.md");
  },
});
