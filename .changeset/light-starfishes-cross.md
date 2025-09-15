---
'@astrojs/starlight': minor
---

Fixes styling of labels that wrap across multiple lines in `<Tabs>` component

⚠️ **Potentially breaking change:** Tab labels now have a narrower line-height and additional vertical padding. If you have custom CSS targetting the `<Tabs>` component, you may want to double check the visual appearance of your tabs when updating.

If you want to preserve the previous styling, you can add the following custom CSS to your site:

```css
.tab > [role='tab'] {
  line-height: var(--sl-line-height);
  padding-block: 0;
}
```
