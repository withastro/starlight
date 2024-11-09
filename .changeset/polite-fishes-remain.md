---
'@astrojs/starlight': minor
---

Deprecates the Starlight plugin `setup` hook in favor of the new `config:setup` hook which provides the same functionality.

⚠️ **BREAKING CHANGE:**

The Starlight plugin `setup` hook is now deprecated and will be removed in a future release. Please update your plugins to use the new `config:setup` hook instead.

```diff
export default {
  name: 'plugin-with-translations',
  hooks: {
-   'setup'({ config }) {
+   'config:setup'({ config }) {
      // Your plugin configuration setup code
    },
  },
};
```
