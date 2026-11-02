---
'@astrojs/starlight': patch
---

Fixes search not loading when the search script runs after the page has finished loading, for example when a Content Security Policy requires scripts to be added dynamically
