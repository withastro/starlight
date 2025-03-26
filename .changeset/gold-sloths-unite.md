---
'@astrojs/starlight': minor
---

Makes `social` configuration more flexible.

⚠️ **BREAKING CHANGE:** The `social` configuration option has changed syntax. You will need to update this in `astro.config.mjs` when upgrading.

Previously, a limited set of platforms were supported using a shorthand syntax with labels built in to Starlight. While convenient, this approach was less flexible and required dedicated code for each social platform added.

Now, you must specify the icon and label for each social link explicitly and you can use any of [Starlight’s built-in icons](https://starlight.astro.build/reference/icons/) for social links.

The following example shows updating the old `social` syntax to the new:

```diff
- social: {
-   github: 'https://github.com/withastro/starlight',
-   discord: 'https://astro.build/chat',
- },
+ social: [
+   { icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' },
+   { icon: 'discord', label: 'Discord', href: 'https://astro.build/chat' },
+ ],
```
