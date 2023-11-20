---
'@astrojs/starlight': minor
---

Respect the `trailingSlash` and `build.format` Astro options when creating Starlight navigation links.

⚠️ **Potentially breaking change:**
This change will cause small changes in link formatting for most sites.
These are unlikely to break anything, but if you care about link formatting, you may want to change some Astro settings.

If you want to preserve Starlight’s previous behavior, set `trailingSlash: 'always'` in your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  trailingSlash: 'always',
  integrations: [
    starlight({
      // ...
    }),
  ],
});
```