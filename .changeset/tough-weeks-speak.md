---
'@astrojs/starlight': minor
---

Makes head entry parsing stricter in Starlight config and content frontmatter.

**⚠️ Potentially breaking change:** Previously Starlight would accept a head entry for a `meta` tag defining some `content` which generates invalid HTML as `<meta>` is a void elememt which cannot have any child nodes. Now, it is an error to define a `meta` tag including some `content`.

If you see errors after updating, look for head entries in the Starlight configuration in the `astro.config.mjs` file or in the frontmatter of your content files that include a `content` property for a `meta` tag. To fix the error, move the `content` property to the `attrs` object with at least an additional attribute to identify the kind of metadata it represents:

```diff
head: {
  tag: 'meta',
- content: 'foo',
  attrs: {
    name: 'my-meta',
+   content: 'foo',
  },
},
```
