import { Cache } from "./mod.ts";
import { assert, assertEquals } from "./test_deps.ts";

Deno.test({
  name: "cache | local",
  async fn(): Promise<void> {
    const url = "file://./README.md";

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
