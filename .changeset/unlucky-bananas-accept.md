---
'@astrojs/starlight': minor
---

Fixes an issue where some Starlight remark and rehype plugins were transforming Markdown and MDX content in non-Starlight pages.

⚠️ **BREAKING CHANGE:**

Previously, some of Starlight’s remark and rehype plugins, most notably the plugin transforming Starlight's custom Markdown syntax for [rendering asides](https://starlight.astro.build/guides/authoring-content/#asides), were applied to all Markdown and MDX content. This included content from [individual Markdown pages](https://docs.astro.build/en/guides/markdown-content/#individual-markdown-pages) and content from [content collections](https://docs.astro.build/en/guides/content-collections/) other than the `docs` collection used by Starlight.

This change restricts the application of Starlight’s remark and rehype plugins to only Markdown and MDX content loaded using Starlight's [`docsLoader()`](https://starlight.astro.build/reference/configuration/#docsloader). If you were relying on this behavior, please let us know about your use case in the dedicated `#starlight` channel in the [Astro Discord](https://astro.build/chat/) or by [opening an issue](https://github.com/withastro/starlight/issues/new?template=---01-bug-report.yml).
