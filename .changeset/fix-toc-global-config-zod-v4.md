---
'@astrojs/starlight': patch
---

Fixes global `tableOfContents` config being ignored due to a zod v4 behavior change where `.default().optional()` returns the default value for `undefined` input instead of `undefined` itself.
