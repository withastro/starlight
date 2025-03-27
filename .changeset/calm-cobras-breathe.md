---
'@astrojs/starlight': minor
---

Fixes a potential list styling issue if the last element of a list item is a `<script>` tag.

⚠️ BREAKING CHANGE:

This change slightly reduces browser compatibility coverage by 0.8% by dropping support for Chromium-based browsers prior to version 105 and Firefox-based browsers prior to version 121. You can find a list of supported browsers and their versions using this [browserslist query](https://browsersl.ist/#q=%3E+0.5%25%2C+not+dead%2C+Chrome+%3E%3D+105%2C+Edge+%3E%3D+105%2C+Firefox+%3E%3D+121%2C+Safari+%3E%3D+15.4%2C+iOS+%3E%3D+15.4%2C+not+op_mini+all).
