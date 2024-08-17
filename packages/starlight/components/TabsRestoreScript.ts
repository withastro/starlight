(() => {
	class StarlightTabsRestore extends HTMLElement {
		connectedCallback() {
			const starlightTabs = this.closest('starlight-tabs');
			if (!(starlightTabs instanceof HTMLElement) || typeof localStorage === 'undefined') return;
			const syncKey = starlightTabs.dataset.syncKey;
			if (!syncKey) return;
			const label = localStorage.getItem(`starlight-synced-tabs__${syncKey}`);
			if (!label) return;
			const tabs = [...starlightTabs?.querySelectorAll('[role="tab"]')];
			const tabIndexToRestore = tabs.findIndex(
				(tab) => tab instanceof HTMLAnchorElement && tab.textContent?.trim() === label
			);
			const panels = starlightTabs?.querySelectorAll('[role="tabpanel"]');
			const newTab = tabs[tabIndexToRestore];
			const newPanel = panels[tabIndexToRestore];
			if (tabIndexToRestore < 1 || !newTab || !newPanel) return;
			tabs[0]?.setAttribute('aria-selected', 'false');
			tabs[0]?.setAttribute('tabindex', '-1');
			panels?.[0]?.setAttribute('hidden', 'true');
			newTab.removeAttribute('tabindex');
			newTab.setAttribute('aria-selected', 'true');
			newPanel.removeAttribute('hidden');
		}
	}
	customElements.define('starlight-tabs-restore', StarlightTabsRestore);
})();
