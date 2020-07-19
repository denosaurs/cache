import { hash } from "./path.ts";

Deno.test({
  name: "ux",
  async fn(): Promise<void> {
    console.log(
      hash("https://deno.land/std@0.61.0/async/mux_async_iterator.ts"),
    );
  },
});
