---
'@astrojs/starlight': patch
---

Ensures invalid sidebar group configurations using the `attrs` option are properly reported as a type error.

Previously, invalid sidebar group configurations using the `attrs` option were not reported as a type error but only surfaced at runtime. This change is only a type-level change and does not affect the runtime behavior of Starlight which does not support the `attrs` option for sidebar groups.
