---
'@astrojs/starlight': patch
---

Dedupes sitemap link tags in the head.

When [enabling sitemap](https://starlight.astro.build/guides/customization/#enable-sitemap) in Starlight, a `<link rel="sitemap" href="/sitemap-index.xml">` tag is automatically added to the head of each page. Manually specifying sitemap link tags using the Starlight [`head` configuration option](https://starlight.astro.build/reference/configuration/#head) or the [`head` frontmatter field](https://starlight.astro.build/reference/frontmatter/#head) will now override the default sitemap link tag added by Starlight.

This change ensures that users manually adding the `@astrojs/sitemap` integration to the Astro `integrations` array for more fine-grained control over sitemap generation and also using the [`filenameBase` integration option](https://docs.astro.build/en/guides/integrations-guide/sitemap/#filenamebase) can customize the sitemap link tag in the head.
