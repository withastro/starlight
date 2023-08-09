---
'@astrojs/starlight': minor
---

Drop support for the `--sl-hue-accent` CSS custom property.

⚠️ **BREAKING CHANGE** — In previous Starlight versions you could control the accent color by setting the `--sl-hue-accent` custom property. This could result in inaccessible color contrast and unpredictable results.

You must now set accent colors directly. If you relied on setting `--sl-hue-accent`, migrate by setting light and dark mode colors in your custom CSS:

```css
:root {
	--sl-hue-accent: 234;
	--sl-color-accent-low: hsl(var(--sl-hue-accent), 54%, 20%);
	--sl-color-accent: hsl(var(--sl-hue-accent), 100%, 60%);
	--sl-color-accent-high: hsl(var(--sl-hue-accent), 100%, 87%);
}

:root[data-theme="light"] {
  --sl-color-accent-high: hsl(var(--sl-hue-accent), 80%, 30%);
	--sl-color-accent: hsl(var(--sl-hue-accent), 90%, 60%);
	--sl-color-accent-low: hsl(var(--sl-hue-accent), 88%, 90%);
}
```

The [new color theme editor](https://starlight.astro.build/guides/css-and-tailwind/#color-theme-editor) might help if you’d prefer to set a new color scheme.