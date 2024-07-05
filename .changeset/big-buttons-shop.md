---
'@astrojs/starlight': minor
---

Removes the `/` search shortcut for [accessibility reasons](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html).

⚠️ **Potentially breaking change:** The `search.shortcutLabel` UI string has been removed. If you were using this string in your custom UI, you will need to update your code.
