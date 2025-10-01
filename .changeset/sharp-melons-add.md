---
'@astrojs/starlight': minor
---

Disables the [DarkReader](https://darkreader.org/) extension for Starlight sites by adding a new meta tag: `<meta name="darkreader-lock" />`.

⚠️ **Potentially breaking change:** If you were relying on this behaviour or you want the DarkReader extension to modify Starlight's built in dark mode, you can [add this middleware](https://starlight.astro.build/guides/route-data/#how-to-customize-route-data) to remove the new meta tag:

```ts
import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware((context) => {
  const { head } = context.locals.starlightRoute;
  const filteredHead = head.filter((entry) => !entry.attrs || entry.attrs["name"] !== "darkreader-lock");
  context.locals.starlightRoute.head = filteredHead;
});
```
