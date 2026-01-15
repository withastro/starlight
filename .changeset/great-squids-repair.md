---
"@astrojs/starlight": patch
---

Fixes support for running builds when `npx` is unavailable.

Previously, Starlight would spawn a process to run the Pagefind search indexing binary using `npx`. On platforms where `npx` isn’t available, this could cause issues. Starlight now runs Pagefind using its Node.js API to avoid a separate process. As a side effect, you may notice that logging during builds is now less verbose.
