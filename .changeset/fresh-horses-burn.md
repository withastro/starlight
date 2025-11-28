---
'@astrojs/starlight': minor
---

Fixes an issue where a vertical scrollbar could be displayed on the Starlight `<Tabs>` component when zooming the page

⚠️ **Potentially breaking change:** The `<Tabs>` component no longer uses `margin-bottom` and `border-bottom` to highlight the current tab. This is now done with a `box-shadow`. If you have custom styling for your tabs, you may need to update it.

If you want to preserve the previous styling, you can add the following custom CSS to your site:

```css
starlight-tabs .tab {
	margin-bottom: -2px;
}

starlight-tabs .tab > [role='tab'] {
	border-bottom: 2px solid var(--sl-color-gray-5);
	box-shadow: none;
}

starlight-tabs .tab [role='tab'][aria-selected='true'] {
	border-color: var(--sl-color-text-accent);
}
```
