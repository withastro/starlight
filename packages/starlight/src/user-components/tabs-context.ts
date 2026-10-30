import { AsyncLocalStorage } from 'node:async_hooks';
import type { StarlightIcon } from '../components-internals/Icons';

interface Panel {
	panelId: string;
	tabId: string;
	label: string;
	icon?: StarlightIcon | undefined;
}

export interface TabsContext {
	getIDs: () => {
		panelId: string;
		tabId: string;
	};
	panels: Panel[];
}

/**
 * An instance of `AsyncLocalStorage` used to store a shared context for the `<Tabs>` component and
 * its `<TabItem>` descendants.
 */
export const tabsContext = new AsyncLocalStorage<TabsContext>();

/**
 * Error message used when a `<TabItem>` is rendered without access to a `<Tabs>` component context.
 * This can happen in MDX where Astro pre-emptively renders slotted content before the parent calls
 * render.
 */
export const tabsContextMissingError = 'Error: TabItem must be used inside the Tabs component.';
