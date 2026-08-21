import { select } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html';
import { htmlToHast } from 'satteri';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';
import type { StarlightIcon } from '../components-internals/Icons';

interface Panel {
	panelId: string;
	tabId: string;
	label: string;
	icon?: StarlightIcon;
}

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
 * Process tab panel items to extract data for the tab links and format
 * each tab panel correctly.
 * @param html Inner HTML passed to the `<Tabs>` component.
 * @param index The index of the `<Tabs>` component on the page.
 */
export const processPanels = (html: string, index: number) => {
	const tree = htmlToHast(html, { fragment: true });
	const panels: Panel[] = [];
	let isFirst = true;
	let count = 0;
	const getIDs = () => {
		const id = count++;
		return {
			panelId: `tab-panel-${index}-${id}`,
			tabId: `tab-${index}-${id}`,
		};
	};

	visit(tree, 'element', (node) => {
		if (node.tagName !== TabItemTagname || !node.properties) {
			return CONTINUE;
		}

		const { dataLabel, dataIcon } = node.properties;
		const ids = getIDs();
		const panel: Panel = {
			...ids,
			label: String(dataLabel),
		};
		if (dataIcon) panel.icon = String(dataIcon) as StarlightIcon;
		panels.push(panel);

		// Remove `<TabItem>` props
		delete node.properties.dataLabel;
		delete node.properties.dataIcon;
		// Turn into `<div>` with required attributes
		node.tagName = 'div';
		node.properties.id = ids.panelId;
		node.properties['aria-labelledby'] = ids.tabId;
		node.properties.role = 'tabpanel';

		const focusableChild = select(focusableElementSelectors, node);
		// If the panel does not contain any focusable elements, include it in
		// the tab sequence of the page.
		if (!focusableChild) {
			node.properties.tabindex = 0;
		}

		// Hide all panels except the first
		// TODO: make initially visible tab configurable
		if (isFirst) {
			isFirst = false;
		} else {
			node.properties.hidden = true;
		}

		// Skip over the tab panel’s children.
		return SKIP;
	});

	return {
		/** Data for each tab panel. */
		panels,
		/** Processed HTML for the tab panels. */
		html: toHtml(tree),
	};
};
