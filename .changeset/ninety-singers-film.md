---
'@astrojs/starlight': patch
---

Improve performance of computing the `lastUpdated` date from Git history.

Instead of executing `git` for each docs page, it is now executed twice regardless of the number of pages.
