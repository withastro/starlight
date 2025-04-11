---
'@astrojs/starlight': minor
---

Groups all of Starlight's CSS declarations into a single `starlight` [cascade layer](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers).

This change allows for easier customization of Starlight's CSS as any custom unlayered CSS will override the default styles. If you are using cascade layers in your custom CSS, you can use the [`@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) CSS at-rule to define the order of precedence for different layers including the ones used by Starlight.

We recommend checking your site’s appearance when upgrading to make sure there are no style regressions caused by this change.
