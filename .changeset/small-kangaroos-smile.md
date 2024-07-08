---
'@astrojs/starlight': patch
---

Fixes an edge case in custom pagination link processing

Custom link values for `prev`/`next` in page frontmatter are now always used as authored.
Previously this was not the case in some edge cases such as for the first and final pages in the sidebar.
