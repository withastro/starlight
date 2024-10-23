// Collect required elements from the DOM.
const scroller = document.getElementById('starlight__sidebar');
const target = scroller?.querySelector<HTMLElement>('sl-sidebar-state-persist');

/** Starlight uses this key to store sidebar state in `sessionStorage`. */
const storageKey = 'sl-sidebar-state';

/** The shape used to persist sidebar state across a user’s session. */
interface SidebarState {
	hash: string;
	open: Array<boolean | null>;
	scroll: number;
}

/**
 * Get the current sidebar state.
 *
 * The `open` state is loaded from session storage when the sidebar hashes match, while `scroll`
 * and `hash` are read from the current page.
 */
const getState = (): SidebarState => {
	let open = [];
	const hash = target?.dataset.hash || '';
	try {
		const rawStoredState = sessionStorage.getItem(storageKey);
		const storedState = JSON.parse(rawStoredState || '{}');
		if (Array.isArray(storedState.open) && storedState.hash === hash) open = storedState.open;
	} catch {}
	return {
		hash,
		open,
		scroll: scroller?.scrollTop || 0,
	};
};

/** Store the passed sidebar state in session storage. */
const storeState = (state: SidebarState): void => {
	try {
		sessionStorage.setItem(storageKey, JSON.stringify(state));
	} catch {}
};

/** Updates sidebar state in session storage without modifying `open` state. */
const updateState = (): void => storeState(getState());

/** Updates sidebar state in session storage to include a new value for a specific `<details>` element. */
const setToggleState = (open: boolean, detailsIndex: number): void => {
	const state = getState();
	state.open[detailsIndex] = open;
	storeState(state);
};

// Store the current `open` state whenever a user interacts with one of the `<details>` groups.
target?.addEventListener('click', (event) => {
	if (!(event.target instanceof Element)) return;
	// Query for the nearest `<summary>` and then its parent `<details>`.
	// This excludes clicks outside of the `<summary>`, which don’t trigger toggles.
	const toggledDetails = event.target.closest('summary')?.closest('details');
	if (!toggledDetails) return;
	const restoreElement = toggledDetails.querySelector<HTMLElement>('sl-sidebar-restore');
	const index = parseInt(restoreElement?.dataset.index || '');
	if (isNaN(index)) return;
	setToggleState(!toggledDetails.open, index);
});

// Store sidebar state before navigating. These will also store it on tab blur etc.,
// but avoid using the `beforeunload` event, which can cause issues with back/forward cache
// on some browsers.
addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'hidden') updateState();
});
addEventListener('pageHide', updateState);
