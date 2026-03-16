---
'@astrojs/starlight': patch
---

Harden sidebar prerender fast-path behavior while preserving exported API isolation.

- Keep `getSidebar()` and `getSidebarFromConfig()` clone-based and isolated per call.
- Ensure clone-path sidebars always normalize current-link state before marking the active page.
- Add regression tests for mixed fast-path/clone-path usage and stronger `config.prerender` gate test cleanup.
