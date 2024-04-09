---
'@astrojs/starlight': patch
---

Fixes accessibility by using `aria-selected="false"` for inactive tabs instead of removing `aria-selected="true"` in the tablist of Starlight’s `<Tabs>` component
