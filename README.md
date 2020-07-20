# cache 

Cache library, compatible with deno [module caching](https://deno.land/manual/linking_to_external_code).  

---
> ⚠️ Work in progress. Expect breaking changes.
---

```typescript
import { Cache } from "https://deno.land/x/cache/mod.ts";

let file = Cache.fetch("https://example.com/file.json");

const text = await Deno.readTextFile(file.path);
console.log(text);
```

## other

### contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt` and commit messages are done following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

### licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.