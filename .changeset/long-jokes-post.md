---
'@astrojs/starlight': minor
---

Refactors Starlight’s mobile menu toggle to work when JavaScript fails or is disabled

⚠️ **BREAKING CHANGE:** This release drops official support for Chromium-based browsers prior to version 116 (released August 2023), Safari-based browsers prior to version 17.0 (released September 2023), and Firefox prior to version 125 (released April 2024). You can find a list of currently supported browsers and their versions using this [browserslist query](https://browsersl.ist/#q=%3E+0.5%25%2C+not+dead%2C+Chrome+%3E%3D+116%2C+Edge+%3E%3D+111%2C+Firefox+%3E%3D+125%2C+Safari+%3E%3D+17.0%2C+iOS+%3E%3D+17.0%2C+not+op_mini+all).

If you still need to support older browsers, you can avoid upgrading or use a polyfill for the Popover API such as [`@oddbird/popover-polyfill`](https://github.com/oddbird/popover-polyfill). Note however that future Starlight releases may depend on additional browser features covered by our current browser support range without mentioning it explicitly in changelogs.
