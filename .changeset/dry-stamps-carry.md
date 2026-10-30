---
"@astrojs/starlight": minor
---

Removes the `search.cancelLabel`, `pagefind.load_more`, `pagefind.filters_label`, `pagefind.alt_search`, and `pagefind.search_suggestion` UI strings.

**⚠️ Potentially breaking change:** These UI strings are no longer used by Starlight search modal and have been removed. If you were using these strings in a custom UI, you can [extend the translation schema](https://starlight.astro.build/guides/i18n/#extend-translation-schema) to define your own strings and provide translations for them.
