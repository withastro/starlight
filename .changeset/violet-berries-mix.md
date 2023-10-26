---
'@astrojs/starlight': minor
---

Support light & dark variants of the hero image.

⚠️ **Potentially breaking change:** The `hero.image` schema is now slightly stricter than previously.

The `hero.image.html` property can no longer be used alongside the `hero.image.alt` or `hero.image.file` properties.
Previously, `html` was ignored when used with `file` and `alt` was ignored when used with `html`.
Now, those combinations will throw errors.
If you encounter errors, remove the `image.hero` property that is not in use.