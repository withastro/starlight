---
"@astrojs/starlight": minor
---

Removes the `search.cancelLabel` UI string

**⚠️ Potentially breaking change:** The `search.cancelLabel` UI string is no longer used by Starlight search modal and has been removed. If you were using this string in a custom UI, you can [extend the translation schema](https://starlight.astro.build/guides/i18n/#extend-translation-schema) to define your own string and provide translations for it.
