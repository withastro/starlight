---
'@astrojs/starlight': minor
---

Adds support for translating the site title

⚠️ **Potentially breaking change:** The shape of the `title` field on Starlight’s internal config object has changed. This used to be a string, but is now an object.

If you are relying on `config.title` (for example in a custom `<SiteTitle>` or `<Head>` component), you will need to update your code. We recommend using the new [`siteTitle` prop](https://starlight.astro.build/reference/overrides/#sitetitle) available to component overrides:

```astro
---
import type { Props } from '@astrojs/starlight/props';

// The site title for this page’s language:
const { siteTitle } = Astro.props;
---
```
