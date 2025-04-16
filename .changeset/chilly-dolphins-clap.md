---
'@astrojs/starlight': minor
---

Removes default `attrs` and `content` values from head entries parsed using Starlight’s schema.

Previously when adding `head` metadata via frontmatter or user config, Starlight would automatically add values for `attrs` and `content` if not provided. Now, these properties are left `undefined`.

This makes it simpler to add tags in route middleware for example as you no longer need to provide empty values for `attrs` and `content`:

```diff
head.push({
  tag: 'style',
  content: 'div { color: red }'
- attrs: {},
});
head.push({
  tag: 'link',
- content: ''
  attrs: { rel: 'me', href: 'https://example.com' },
});
```

This is mostly an internal API but if you are overriding Starlight’s `Head` component or processing head entries in some way, you may wish to double check your handling of `Astro.locals.starlightRoute.head` is compatible with `attrs` and `content` potentially being `undefined`.
