---
'@astrojs/starlight': minor
---

Excludes banner content from search results

Previously, content set in [`banner`](https://starlight.astro.build/reference/frontmatter/#banner) in page frontmatter was indexed by Starlight’s default search provider Pagefind. This could cause unexpected search results, especially for sites setting a common banner content on multiple pages. Starlight’s default `Banner` component is now excluded from search indexing.

This change does not impact `Banner` overrides using custom components.
