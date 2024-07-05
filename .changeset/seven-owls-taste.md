---
'@astrojs/starlight': patch
---

Adds a new syntax for specifying sidebar link items for internal links

You can now specify an internal page using only its slug, either as a string, or as an object with a `slug` property:

```js
starlight({
  title: 'Docs with easier sidebars',
  sidebar: [
    'getting-started',
    { slug: 'guides/installation' },
  ],
})
```

Starlight will use the linked page’s frontmatter to configure the sidebar link.
