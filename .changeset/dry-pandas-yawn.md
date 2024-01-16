---
'@astrojs/starlight': minor
---

Fixes sidebar auto-generation issue when a file and a directory, located at the same level, have identical names.

For example, `src/content/docs/guides.md` and `src/content/docs/guides/example.md` will now both be included and `src/content/docs/guides.md` is treated in the same way a `src/content/docs/guides/index.md` file would be.
