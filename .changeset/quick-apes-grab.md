---
"@astrojs/starlight": patch
---

Fixes invalid `<head>` output when configuration is missing:
- Omits `<meta property="og:description" />` if Starlight’s `description` option is unset
- Omits `<link rel="canonical" />` and `<meta property="og:url" />` if Astro’s `site` option is unset
