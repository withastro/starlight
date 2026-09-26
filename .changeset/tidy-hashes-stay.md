---
"@astrojs/starlight": patch
---

Fixes sidebar links containing a hash or query string when using Astro’s [`trailingSlash`](https://docs.astro.build/en/reference/configuration-reference/#trailingslash) or [`build.format: 'file'`](https://docs.astro.build/en/reference/configuration-reference/#buildformat) options. For example, a `/reference/configuration/#sidebar` link was output as `/reference/configuration/#sidebar/` or `/reference/configuration/#sidebar.html`.
