---
"@astrojs/starlight": patch
---

Fixes an issue where monolingual sites using a region-specific locale (e.g., `zh-TW`) as the default would incorrectly display base language translations (e.g., `zh` Simplified Chinese) instead of the region-specific ones (e.g., `zh-TW` Traditional Chinese).
