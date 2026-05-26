---
'@astrojs/starlight': patch
---

Keeps keyboard focus inside the mobile menu while it is open by marking the rest of the page `inert`. Focus containment now covers all interactive elements (including sidebar group `<summary>` toggles and any custom components) and is released automatically if the viewport grows past the mobile breakpoint.
