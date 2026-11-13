---
'@astrojs/starlight': patch
---

Fixes asides accepting custom icon names that match `Object.prototype` properties, such as `constructor` or `toString`, instead of reporting an invalid icon
