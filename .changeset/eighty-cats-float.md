---
'@astrojs/starlight': minor
---

Tightens `line-height` on `<LinkCard>` titles to fix regression from original design

If you want to preserve the previous `line-height`, you can add the following custom CSS to your site:

```css
.sl-link-card a {
  line-height: 1.6;
}
```
