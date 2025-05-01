---
"@astrojs/starlight": patch
---

Increases `maxBuffer` for an internal `spawnSync()` call to support larger Git commit histories when using Starlight's [`lastUpdated`](https://starlight.astro.build/reference/configuration/#lastupdated) feature.
