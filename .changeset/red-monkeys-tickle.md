---
'@astrojs/starlight': minor
---

⚠️ **BREAKING CHANGE:** Ensures that the `<Badge>` and `<Icon>` components no longer render with a trailing space.

In Astro, components that include styles render with a trailing space which can prevent some use cases from working as expected, e.g. when using such components inlined with text. This change ensures that the `<Badge>` and `<Icon>` components no longer render with a trailing space.

If you were previously relying on that implementation detail, you may need to update your code to account for this change. For example, considering the following code:

```mdx
<Badge text="New" />Feature
```

The rendered text would previously include a space between the badge and the text due to the trailing space automatically added by the component:

```
New Feature
```

Such code will now render the badge and text without a space:

```
NewFeature
```

To fix this, you can add a space between the badge and the text:

```mdx
<Badge text="New" /> Feature
```
