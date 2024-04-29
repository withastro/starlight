---
'@astrojs/starlight': minor
---

Changes the hero component action button default [variant](https://starlight.astro.build/reference/frontmatter/#heroconfig) from `minimal` to `primary`.

If you want to preserve the previous behavior, hero component action button previously declared without a `variant` will need to be updated to include the `variant` property with the value `minimal`.

```diff
hero:
  actions:
    - text: View on GitHub
      link: https://github.com/astronaut/my-project
      icon: external
+     variant: minimal
```
