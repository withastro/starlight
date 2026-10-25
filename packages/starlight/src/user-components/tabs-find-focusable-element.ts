export const TabItemTagname = 'starlight-tab-item';

// https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/focus/src/FocusScope.tsx#L256-L275
const focusableElementsRegEx = new RegExp(
	[
		'<',
		// :not([hidden]) and :not([tabindex="-1"]) apply to every selector
		String.raw`(?![^>]*\shidden(?=[\s=/>]))`,
		String.raw`(?![^>]*\stabindex=["']?-1["']?[\s/>])`,
		'(?:',
		[
			// input (not hidden/disabled)
			String.raw`input(?=[\s/>])(?![^>]*\s(?:disabled[\s=/>]|type=["']?hidden["']?[\s/>]))`,
			// select, textarea, button (not disabled)
			String.raw`(?:select|textarea|button)(?=[\s/>])(?![^>]*\sdisabled[\s=/>])`,
			// a[href], area[href]
			String.raw`(?:a|area)(?=\s)(?=[^>]*\shref[\s=/>])`,
			// always focusable
			String.raw`(?:summary|iframe|object|embed)(?=[\s/>])`,
			// audio/video[controls]
			String.raw`(?:audio|video)(?=\s)(?=[^>]*\scontrols[\s=/>])`,
			// [contenteditable] on any element
			String.raw`[a-z][^\s/>]*(?=\s)(?=[^>]*\scontenteditable[\s=/>])`,
			// [tabindex]:not([disabled]) on any element
			String.raw`[a-z][^\s/>]*(?=\s)(?=[^>]*\stabindex[\s=/>])(?![^>]*\sdisabled[\s=/>])`,
		].join('|'),
		')',
	].join(''),
	'i'
);

/**
 * Check if an HTML string contains a focusable element.
 * @param html Inner HTML passed to the `<TabItem>` component.
 */
export const containsFocusableElement = (html: string): boolean => {
	return focusableElementsRegEx.test(html);
};
