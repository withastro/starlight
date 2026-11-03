---
'@astrojs/starlight-docsearch': patch
---

Fixes DocSearch not loading when its script runs after the page has finished loading, for example when a Content Security Policy requires scripts to be added dynamically
