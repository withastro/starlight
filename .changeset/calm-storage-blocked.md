---
'@astrojs/starlight': patch
---

Fixes the theme select and synced tabs throwing errors in browsers where accessing `localStorage` is blocked, for example when site data is blocked or when a site is embedded in a sandboxed `<iframe>`. The theme select now keeps working and falls back to the system color scheme, and tabs keep switching without persisting the selection.
