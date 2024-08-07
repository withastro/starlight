// Collect required elements from the DOM.
const target = document.querySelector<HTMLElement>('sl-sidebar-state-persist');
const scroller = document.getElementById('starlight__sidebar');
const details = target?.querySelectorAll('details') || [];
const hash = target?.dataset.hash || '';

/** Load the stored state from session storage. */
const loadState = (): { open: Array<boolean | null> } => {
	const rawStoredState = sessionStorage.getItem('sl-sidebar-state');
	return rawStoredState ? JSON.parse(rawStoredState) : { open: [] };
};

/** Store the sidebar state to session storage.  */
const storeState = ({ open }: { open: Array<boolean | null> }) => {
	const state = { hash, open, scroll: scroller?.scrollTop || 0 };
	sessionStorage.setItem('sl-sidebar-state', JSON.stringify(state));
};

/** Updates sidebar state in session storage without modifying `open` state. */
const updateState = () => storeState(loadState());

// Store the current `open` state whenever a user interacts with one of the `<details>` groups.
details.forEach((el, index) =>
	el.addEventListener('toggle', function () {
		const state = loadState();
		state.open[index] = this.open;
		storeState(state);
	})
);

// Store sidebar state before navigating. These will also store it on tab blur etc.,
// but avoid using the `beforeunload` event, which can cause issues with back/forward cache
// on some browsers.
addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'hidden') updateState();
});
addEventListener('pageHide', updateState);
