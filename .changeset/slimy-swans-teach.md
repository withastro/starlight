---
'@astrojs/starlight': minor
---

Updates the default `line-height` from `1.8` to `1.75`. This change avoids having a line height with a fractional part which can cause scripts accessing dimensions involving the line height to get an inconsistent rounded value in various browsers.

If you want to preserve the previous `line-height`, you can add the following custom CSS to your site:

```css
:root {
  --sl-line-height: 1.8;
}
```
