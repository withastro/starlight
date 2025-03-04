---
'@astrojs/starlight': patch
---

Fixes an issue where overriding the [canonical URL](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#canonical) of a page using the [`head` configuration option](https://starlight.astro.build/reference/configuration/#head) or [`head` frontmatter field](https://starlight.astro.build/reference/frontmatter/#head) would strip any other `<link>` tags from the `<head>`.
