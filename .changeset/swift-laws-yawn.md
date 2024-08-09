---
'@astrojs/starlight': minor
---

Adds a guideline to the last step of the `<Steps>` component.

If you want to preserve the previous behaviour and hide the guideline on final steps, you can add the following custom CSS to your site:

```css
/* Hide the guideline for the final step in <Steps> lists. */
.sl-steps > li:last-of-type::after {
  background: transparent;
}
```
