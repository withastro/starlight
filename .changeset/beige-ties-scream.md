---
'@astrojs/starlight': minor
---

Fixes autocomplete for components exported from `@astrojs/starlight/components/*`

**⚠️ Potentially breaking change:** This change moves some files used in Starlight’s component internals out of the `components/` directory. Direct use of these files was not and is not officially supported. If you previously imported `TableOfContents/starlight-toc.ts`, `TableOfContents/TableOfContentsList.astro`, `Icons.ts`, or `SidebarPersistState.ts`, please review your code when updating.
