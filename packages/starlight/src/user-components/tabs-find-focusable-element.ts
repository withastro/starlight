import { select } from 'hast-util-select';
import { htmlToHast } from 'satteri';

export const TabItemTagname = 'starlight-tab-item';

// https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/focus/src/FocusScope.tsx#L256-L275
const focusableElementSelectors = [
	'input:not([disabled]):not([type=hidden])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'button:not([disabled])',
	'a[href]',
	'area[href]',
	'summary',
	'iframe',
	'object',
	'embed',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]',
	'[tabindex]:not([disabled])',
]
	.map((selector) => `${selector}:not([hidden]):not([tabindex="-1"])`)
	.join(',');

/**
 * Check if an HTML string contains a focusable element.
 * @param html Inner HTML passed to the `<TabItem>` component.
 */
export const containsFocusableElement = (html: string): boolean => {
	const tree = htmlToHast(html, { fragment: true });
	return !!select(focusableElementSelectors, tree);
};
