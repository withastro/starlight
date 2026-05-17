---
'@astrojs/starlight': minor
---

Adds support for `blank` page template allowing for full control over the content panel of the page.

By default, the most basic page template is `splash` which is intended to be used for landing pages and other pages that don't require a sidebar. However it still renders things like the page title which can be annoying to hide in case you want to customize the entire page. The new `blank` template allows you to do just that, giving you a completely blank canvas to work with. You can use this template for any page where you want to have full control over the content panel.

When you use the `blank` template, you will be assigned a simple slot under a content panel:

```astro
<ContentPanel>
  <slot />
</ContentPanel>
```

You will then be responsible for rendering the page title and any other content you want to include in the page. This allows you to create custom layouts and designs for your pages without having to worry about the default page structure getting in the way.
