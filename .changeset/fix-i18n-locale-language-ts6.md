---
'@astrojs/starlight': patch
---

Fix a TypeScript 6 narrowing regression in `getLocaleDir`: the fallback branch that reads `(locale as Intl.Locale).language` was rejected by TS 6 because the narrowed type no longer contains the `language` property. Cast through `Intl.Locale` explicitly so the fallback still compiles.
