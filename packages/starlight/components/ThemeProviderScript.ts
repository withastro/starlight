window.StarlightThemeProvider = (() => {
	const storedTheme =
		typeof localStorage !== 'undefined' && localStorage.getItem('starlight-theme');
	const theme =
		storedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
	document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
	return {
		updatePickers(theme = storedTheme || 'auto') {
			document.querySelectorAll('starlight-theme-select').forEach((picker) => {
				const select = picker.querySelector('select');
				if (select) select.value = theme;
				const template = document.querySelector<HTMLTemplateElement>(`#theme-icons`);
				const newIcon = template && template.content.querySelector('.' + theme);
				if (newIcon) {
					const oldIcon = picker.querySelector('svg.label-icon');
					if (oldIcon) {
						oldIcon.replaceChildren(...newIcon.cloneNode(true).childNodes);
					}
				}
			});
		},
	};
})();
