---
'@astrojs/starlight': minor
---

Fixes a potential list styling issue if the last element of a list item is a `<script>` tag.

⚠️ BREAKING CHANGE:

This release drops official support for Chromium-based browsers prior to version 105 (released 30 August 2022) and Firefox-based browsers prior to version 121 (released 19 December 2023). You can find a list of currently supported browsers and their versions using this [browserslist query](https://browsersl.ist/#q=%3E+0.5%25%2C+not+dead%2C+Chrome+%3E%3D+105%2C+Edge+%3E%3D+105%2C+Firefox+%3E%3D+121%2C+Safari+%3E%3D+15.4%2C+iOS+%3E%3D+15.4%2C+not+op_mini+all).

With this release, Starlight-generated sites will still work fine on those older browsers except for this small detail in list item styling, but future releases may introduce further breaking changes for impacted browsers, including in patch releases.
