---
'@astrojs/starlight': minor
---

Makes hover styles consistent in Starlight’s navigation bar

Previously, the social icon links and language/theme switchers in Starlight’s navigation bar, dimmed on hover.
After this change, they now increase in contrast on hover instead.
This matches hover behavior elsewhere, for example in the sidebar, table of contents, or search button.

⚠️ **Potentially breaking change:** this is a subtle change to the hover style colors.
If you want to preserve the previous styling, you can add the following [custom CSS](https://starlight.astro.build/guides/css-and-tailwind/#custom-css-styles) to your site:

```css
starlight-theme-select label,
starlight-lang-select label {
  color: var(--sl-color-gray-1);

  &:hover {
    color: var(--sl-color-white);
  }
}

.social-icons a:hover {
  color: var(--sl-color-text-accent);
  opacity: 0.66;
}
```
