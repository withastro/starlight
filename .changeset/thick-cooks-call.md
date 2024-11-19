---
'@astrojs/starlight': patch
---

Fixes an edge case to correctly avoid a trailing slash when navigating from a root locale homepage to another language via Starlight’s language switcher when `trailingSlash: 'never'` is set
