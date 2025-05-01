---
"@astrojs/starlight": patch
---

Increased `maxBuffer` in `getAllNewestCommitDate`'s `spawnSync` usage.

This supports larger Git commit histories when using Starlight's [`lastUpdated`](https://starlight.astro.build/reference/configuration/#lastupdated) feature.
