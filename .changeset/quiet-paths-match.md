---
"@astrojs/starlight": patch
---

Fixes using an Astro `i18n` configuration with `prefixDefaultLocale: true` where the default locale has a custom `path` different from its first code. Starlight used the locale code instead of the path as its default locale, which broke the sitemap, the `x-default` alternate link, and fallback pages.
