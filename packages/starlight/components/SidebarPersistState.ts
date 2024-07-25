// Collect required elements from the DOM.
const target = document.querySelector<HTMLElement>('sl-sidebar-state-persist');
const scroller = document.getElementById('starlight__sidebar');
const details = target?.querySelectorAll('details') || [];

/** Stores sidebar state as JSON in session storage. */
const storeState = () => {
	const state = {
		hash: target?.dataset.hash || '',
		open: [...details].map((element) => element.open),
		scroll: scroller?.scrollTop || 0,
	};
	sessionStorage.setItem('sl-sidebar-state', JSON.stringify(state));
};

// Store sidebar state before navigating. These will also store it on tab blur etc.,
// but avoid using the `beforeunload` event, which can cause issues with back/forward cache
// on some browsers.
addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'hidden') storeState();
});
addEventListener('pageHide', storeState);
