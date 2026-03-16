---
"@astrojs/starlight": patch
---

fix: use region-specific translations for default locale

Fixed an issue where monolingual sites using a region-specific locale (e.g., `zh-TW`) as the default would incorrectly display base language translations (e.g., `zh` Simplified Chinese) instead of the region-specific ones (e.g., `zh-TW` Traditional Chinese).
