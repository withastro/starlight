// Inline script to restore sidebar state as soon as possible.
// - On smaller viewports, restoring state is skipped as the sidebar is collapsed inside a menu.
// - The state is parsed from session storage and restored.
// - This is a progressive enhancement, so any errors are swallowed silently.

(() => {
	try {
		if (!matchMedia('(min-width: 50em)').matches) return;
		const scroller = document.getElementById('starlight__sidebar');
		const target = document.querySelector<HTMLElement>('sl-sidebar-state-persist');
		const state = JSON.parse(sessionStorage.getItem('sl-sidebar-state') || '0');
		if (!scroller || !target || !state || target.dataset.hash !== state.hash) return;
		target
			.querySelectorAll('details')
			.forEach((el, idx) => typeof state.open[idx] === 'boolean' && (el.open = state.open[idx]));
		scroller.scrollTop = state.scroll;
	} catch {}
})();
