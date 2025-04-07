---
'@astrojs/starlight': patch
---

Fixes an issue where generated [canonical URLs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#canonical) would include a trailing slash when using the [`trailingSlash` Astro option](https://docs.astro.build/en/reference/configuration-reference/#trailingslash) is set to `'never'`.
