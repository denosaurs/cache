import * as Cache from "./mod.ts";
import { assert, assertEquals, resolve, toFileUrl } from "./test_deps.ts";

Deno.test({
  name: "cache | local | relative",
  async fn(): Promise<void> {
    const url = "./README.md";

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("local");
    await local.purge();

    assert(!(await local.exists(url)));

    const file = await local.cache(url);
    assertEquals(file.origin, Cache.Origin.FETCH);

    assert(await local.exists(url));

    await local.remove(url);
    assert(!(await local.exists(url)));
  },
});

Deno.test({
  name: "cache | local | abs/rel",
  async fn(): Promise<void> {
    const abs = resolve("./README.md");
    const rel = `./README.md`;

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("local");
    await local.purge();

    assert(!(await local.exists(abs)));
    assert(!(await local.exists(rel)));

    const fileABS = await local.cache(abs);
    const fileREL = await local.cache(rel);

    assertEquals(fileREL.meta.url, fileABS.meta.url);

    assertEquals(fileABS.origin, Cache.Origin.FETCH);
    assertEquals(fileREL.origin, Cache.Origin.CACHE);

    assert(await local.exists(abs));
    assert(await local.exists(rel));

    await local.remove(abs);
    assert(!(await local.exists(rel)));
  },
});

Deno.test({
  name: "cache | local | file://",
  async fn(): Promise<void> {
    const url = toFileUrl(resolve("./README.md"));

    Cache.configure({
      directory: "cache",
    });
    const local = Cache.namespace("local");
    await local.purge();

    assert(!(await local.exists(url)));

    const file = await local.cache(url);
    assertEquals(file.origin, Cache.Origin.FETCH);

    assert(await local.exists(url));

    await local.remove(url);
    assert(!(await local.exists(url)));
  },
});

Deno.test({
  name: "cache | remote",
  async fn(): Promise<void> {
    const url = "https://deno.land/std/version.ts";

    Cache.configure({
      directory: "cache",
    });
    const remote = Cache.namespace("remote");
    await remote.purge();

    assert(!(await remote.exists(url)));

    const file = await remote.cache(url);
    assertEquals(file.origin, Cache.Origin.FETCH);

    assert(await remote.exists(url));

    await remote.remove(url);
    assert(!(await remote.exists(url)));
  },
});
