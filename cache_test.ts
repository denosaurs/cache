import { Cache } from "./mod.ts";
import { assert, assertEquals, resolve } from "./test_deps.ts";

Deno.test({
  name: "cache | local | relative",
  async fn(): Promise<void> {
    const url = "./README.md";

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("local");
    await local.purge();

    assert(!await local.exists(url));

    const file = await local.fetch(url);
    assertEquals(file.origin, Cache.Origin.FETCH);

    assert(await local.exists(url));

    await local.remove(url);
    assert(!await local.exists(url));
  },
});
Deno.test({
  name: "cache | local | abs/rel",
  async fn(): Promise<void> {
    const abs = `${resolve("./README.md")}`;
    const rel = `./README.md`;

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("local");
    await local.purge();

    assert(!await local.exists(abs));
    assert(!await local.exists(rel));

    const fileABS = await local.fetch(abs);
    const fileREL = await local.fetch(rel);

    assertEquals(fileREL.meta.url, fileABS.meta.url);

    assertEquals(fileABS.origin, Cache.Origin.FETCH);
    assertEquals(fileREL.origin, Cache.Origin.CACHE);

    assert(await local.exists(abs));
    assert(await local.exists(rel));

    await local.remove(abs);
    assert(!await local.exists(rel));
  },
});

Deno.test({
  name: "cache | remote",
  async fn(): Promise<void> {
    const url = "https://deno.land/std/version.ts";

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("remote");
    await local.purge();

    assert(!await local.exists(url));

    const file = await local.fetch(url);
    assertEquals(file.origin, Cache.Origin.FETCH);

    assert(await local.exists(url));

    await local.remove(url);
    assert(!await local.exists(url));
  },
});
