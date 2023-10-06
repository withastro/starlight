---
'@astrojs/starlight': minor
---

Add support for overriding Starlight’s built-in components

⚠️ **BREAKING CHANGE** — The page footer is now included on pages with `template: splash` in their frontmatter. Previously, this was not the case. If you are using `template: splash` and want to continue to hide footer elements, disable them in your frontmatter:

```md
---
title: Landing page
template: splash
# Disable unwanted footer elements as needed
editUrl: false
lastUpdated: false
prev: false
next: false
---
```

⚠️ **BREAKING CHANGE** — This change involved refactoring the structure of some of Starlight’s built-in components slightly. If you were previously overriding these using other techniques, you may need to adjust your code.