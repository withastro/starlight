---
'@astrojs/starlight': patch
---

Make Starlight compaticle with server output mode.

Starlight pages are always prerendered, even when `output: 'server'`.
