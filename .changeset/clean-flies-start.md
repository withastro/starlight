---
'@astrojs/starlight': minor
---

Simplifies markup for Starlight’s mobile menu toggle

**⚠️ Potentially breaking change:** If you use a theme plugin, custom styles, or component overrides targeting the `MobileMenuToggle` button or `PageFrame` components, you may need to adjust these for the new markup. The button is no longer wrapped in a `<starlight-menu-button>` custom element and no longer uses the `aria-expanded` attribute. Instead, you can use the `.sl-menu-button` class name to target the button and the `:popover-open` pseudo-class to style the menu open state specifically.

In the following example, custom styles for the menu button are updated for the new approach:

```diff
- starlight-menu-button button {
+ .sl-menu-button {
  color: var(--sl-color-text);
}

- [aria-expanded='true'] starlight-menu-button button {
+ .sl-menu-button:has(~ :popover-open) {
  color: var(--sl-color-text-accent-high);
}
```

See [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro) and [`PageFrame.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageFrame.astro) on GitHub for the full source code of the updated components.
