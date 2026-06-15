---
'@astrojs/starlight': minor
---

Adds support for Astro v7, drops support for Astro v6.

#### Upgrade Astro and dependencies

⚠️ **BREAKING CHANGE:** Astro v6 is no longer supported. Make sure you [update Astro](https://docs.astro.build/en/guides/upgrade-to/v7/) and any other official integrations at the same time as updating Starlight:

```sh
npx @astrojs/upgrade
```

_Community Starlight plugins and Astro integrations may also need to be manually updated to work with Astro v7. If you encounter any issues, please reach out to the plugin or integration author to see if it is a known issue or if an updated version is being worked on._

⚠️ **BREAKING CHANGE:** This release drops official support for Chromium-based browsers prior to version 111 (released 07 March 2023) and Safari-based browsers prior to version 16.4 (released 27 March 2023). You can find a list of currently supported browsers and their versions using this [browserslist query](https://browsersl.ist/#q=%3E+0.5%25%2C+not+dead%2C+Chrome+%3E%3D+111%2C+Edge+%3E%3D+111%2C+Firefox+%3E%3D+121%2C+Safari+%3E%3D+16.4%2C+iOS+%3E%3D+16.4%2C+not+op_mini+all).
