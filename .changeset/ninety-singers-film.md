---
'@astrojs/starlight': patch
---

Improves performance of computing the last updated times from Git history.

Instead of executing `git` for each docs page, it is now executed twice regardless of the number of pages.
