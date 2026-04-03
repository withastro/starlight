---
'@astrojs/starlight': minor
---

Avoids the risk of layout shift when users expand and collapse sidebar groups

This release can introduce additional padding to the site sidebar on certain devices to reserve space for scrollbars. You may wish to inspect your site sidebar visually when upgrading.

If you would prefer to keep the previous styling, you can add the following custom CSS to your site:

```css
.sidebar-pane {
  scrollbar-gutter: auto;
}
```
