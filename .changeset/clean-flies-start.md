---
'@astrojs/starlight': minor
---

Simplifies markup for Starlight’s mobile menu toggle

**⚠️ Potentially breaking change:** If you use a theme plugin, custom styles, or component overrides targeting the mobile menu toggle button, you may need to adjust these for the new button markup. The button is no longer wrapped in a `<starlight-menu-button>` custom element and no longer uses the `aria-expanded` attribute. Instead, you can use `button[popovertarget="starlight__sidebar"]` to target the button and the `:popover-open` pseudo-class to style the menu open state specifically.

In the following example, custom styles for the menu button are updated for the new approach:

```diff
- starlight-menu-button button {
+ button[popovertarget="starlight__sidebar"] {
  color: var(--sl-color-text);
}

- [aria-expanded='true'] starlight-menu-button button {
+ button[popovertarget="starlight__sidebar"]:has(~ :popover-open) {
  color: var(--sl-color-text-accent-high);
}
```

See [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro) on GitHub for the full source code of the updated button.
