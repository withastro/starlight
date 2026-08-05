---
'@astrojs/starlight': minor
'@astrojs/starlight-markdoc': minor
---

Adds support for icons in the title of `<LinkCard>` components.

You can now add one of [Starlight's built-in icons](https://starlight.astro.build/reference/icons/#all-icons) to the [`<LinkCard>` component](https://starlight.astro.build/components/link-cards/):

```diff lang="mdx"
<LinkCard
	title="Internationalization"
	href="/guides/i18n/"
	description="Configure Starlight to support multiple languages."
+	icon="translate"
+	iconPlacement="start"
/>
```

Read more about the new properties in the ["Add a link icon" guide](https://starlight.astro.build/components/link-cards/#add-a-link-icon).
