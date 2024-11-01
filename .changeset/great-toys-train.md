---
'@astrojs/starlight': patch
---

Fixes a URL localization edge case. In projects without a root locale configured, slugs without a locale prefix did not fall back to the default locale as expected.
