---
'@astrojs/starlight': minor
---

Adds a new [`markdown.processedDirs`](https://starlight.astro.build/reference/configuration/#processeddirs) configuration option to specify additional directories where files should be processed by Starlight’s Markdown pipeline.

By default, Starlight’s processing only applies to Markdown and MDX content loaded using Starlight’s `docsLoader()`. This new option allows to extend this processing to other directories, which can be useful if you are rendering content from a custom content collection using the `<StarlightPage>` component and expect Starlight’s Markdown processing to be applied to that content as well.
