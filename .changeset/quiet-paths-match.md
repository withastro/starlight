---
'@astrojs/starlight': patch
---

Fixes missing last updated dates in production builds for pages with non-ASCII or double-quote characters in their file path when the `lastUpdated` option is enabled.
