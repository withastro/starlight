---
'@astrojs/starlight': minor
---

Ensures that Starlight CSS layer order is predictable in custom pages using the `<StarlightPage>` component.

Previously, due to how [import order](https://docs.astro.build/en/guides/styling/#import-order) works in Astro, the `<StarlightPage>` component had to be the first import in custom pages to set up [cascade layers](https://starlight.astro.build/guides/css-and-tailwind/#cascade-layers) used internally by Starlight to manage the order of its styles.

With this change, this restriction no longer applies and Starlight’s styles will be applied correctly regardless of the import order of the `<StarlightPage>` component.
