# cache

[![Tags](https://img.shields.io/github/release/denosaurs/cache)](https://github.com/denosaurs/cache/releases)
[![CI Status](https://img.shields.io/github/workflow/status/denosaurs/cache/check)](https://github.com/denosaurs/cache/actions)
[![Dependencies](https://img.shields.io/github/workflow/status/denosaurs/cache/depsbot?label=dependencies)](https://github.com/denosaurs/depsbot)
[![License](https://img.shields.io/github/license/denosaurs/cache)](https://github.com/denosaurs/cache/blob/master/LICENSE)

Cache library, compatible with deno [module caching](https://deno.land/manual/linking_to_external_code).

```typescript
import { cache } from "https://deno.land/x/cache/mod.ts";

const file = await cache("https://example.com/file.json");

const text = await Deno.readTextFile(file.path);
console.log(text);
```

## Maintainers

- Filippo Rossi ([@qu4k](https://github.com/qu4k))
- Elias Sjögreen ([@eliassjogreen](https://github.com/eliassjogreen))

## Other

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt` and commit messages are done following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

### Licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
