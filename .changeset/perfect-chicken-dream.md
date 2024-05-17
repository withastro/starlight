---
'@astrojs/starlight': minor
---

Updates `@astrojs/mdx` to v3 and enables MDX optimization by default

⚠️ **Potentially breaking change:** MDX optimization speeds up builds (Starlight’s docs are building ~40% faster for example), but restricts some advanced MDX features. See full details in the [MDX optimization documentation](https://docs.astro.build/en/guides/integrations-guide/mdx/#optimize).

Most Starlight users should be unaffected, but if you are using MDX files outside of Starlight pages with the `components` prop, you may see issues. You can disable optimization by adding MDX manually to your `integrations` array in `astro.config.mjs`:

```diff
import { defineConfig } from 'astro/config';
+ import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My docs',
			// ...
		}),
+		mdx(),
	],
});
```
