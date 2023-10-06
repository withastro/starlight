---
'@astrojs/starlight': minor
---

Add `titleDelimiter` configuration option and include site title in page `<title>` tags

⚠️ **BREAKING CHANGE** — Previously, every page’s `<title>` only included its individual frontmatter title.
Now, `<title>` tags include the page title, a delimiter character (`|` by default), and the site title.
For example, in the Startlight docs, `<title>Configuration Reference</title>` is now `<title>Configuration Reference | Starlight</title>`.

If you have a page where you need to override this new behaviour, set a custom title using the `head` frontmatter property:


```md
---
title: My Page
head:
  - tag: title
    content: Custom Title
---
```