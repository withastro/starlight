---
"@astrojs/starlight": minor
---

⚠️ **BREAKING CHANGE:** Adds support for any Astro [`scopedStyleStrategy`](https://docs.astro.build/en/reference/configuration-reference/#scopedstylestrategy) configuration.

Previously, Starlight forced the `"where"` strategy, resulting in CSS selectors like `:where(astro-HASH)`. Starlight now respects the strategy set in `astro.config.mjs` and will default to Astro’s default `"attribute"` strategy, resulting in attribute selectors like `[data-astro-cid-HASH]`.

The new default changes the specificity of Astro’s scoped styles, so we recommend checking for visual changes in your site when updating.

If you wish to continue using the previous scoping strategy in your site, set it explicitly in your Astro configuration file:

```diff
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
+ scopedStyleStrategy: "where",
  // ...
});
```