---
'@astrojs/starlight': patch
---

Prevent unwanted font-size adjustments on iOS after orientation changes by setting `-webkit-text-size-adjust: 100%` and `text-size-adjust: 100%`. This keeps text sizes consistent across rotations in iOS Safari and other WebKit-based browsers.
