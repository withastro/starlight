---
"@astrojs/starlight": patch
---

Fixes a potential page freeze due to table of contents highlighting when a [`<PageTitle>` component](https://starlight.astro.build/reference/overrides/#pagetitle) override does not render a heading with the required `id="_top"`.
