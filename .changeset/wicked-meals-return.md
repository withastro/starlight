---
'@astrojs/starlight': minor
---

Adds missing vertical spacing between Markdown content and UI Framework components using [client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives).

**⚠️ Potentially breaking change:** By default, Starlight applies some vertical spacing (`--sl-content-gap-y`) between Markdown content blocks. This change introduces similar spacing between Markdown content blocks and UI Framework components using client directives which was not present before.

If you were relying on the previous behavior, you can manually override the spacing by manually specifying the top margin on the component using [custom CSS](https://starlight.astro.build/guides/css-and-tailwind/#custom-css-styles), e.g. by relying on a CSS class to target the component.

```css
.my-custom-component {
  margin-top: 0;
}
