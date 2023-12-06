---
'@astrojs/starlight': minor
---

Enables link prefetching on hover by default

Astro v4’s [prefetch](https://docs.astro.build/en/guides/prefetch) support is now enabled by default. If `prefetch` is not set in `astro.config.mjs`, Starlight will use `prefetch: { prefetchAll: true, defaultStrategy: 'hover' }` by default.

If you want to preserve previous behaviour, disable link prefetching in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  // Disable link prefetching:
  prefetch: false,

  integrations: [
    starlight({
      // ...
    }),
  ],
});
