---
'@astrojs/starlight': patch
---

Fixes a routing bug for docs pages with a slug authored with non-normalized composition. This could occur for filenames containing diacritics in some circumstances, causing 404s.
