---
"@astrojs/starlight": minor
---

Refactors Starlight’s theme select menu to reduce its JavaScript use

⚠️ **Potentially breaking change:** If your project or theme plugin overrides the `ThemeSelect` component, check that it still works after updating. The global API previously used by theme select components has been removed and calling `StarlightThemeProvider.updatePickers()` will no longer work.

See [`ThemeProvider.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/src/components/ThemeProvider.astro), [`ThemeSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/src/components/ThemeSelect.astro), and [`LanguageSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/src/components/LanguageSelect.astro) on GitHub for the full source code of the updated components.
