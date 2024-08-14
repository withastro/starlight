(() => {
	const openButton = document.querySelector<HTMLButtonElement>('button[data-open-modal]');
	const shortcut = openButton?.querySelector('kbd');
	if (!openButton || !(shortcut instanceof HTMLElement)) {
		return;
	}
	const platformKey = shortcut.querySelector('kbd');
	// Purposely using the deprecated `navigator.platform` property to detect Apple devices, as the
	// user agent is spoofed by some browsers when opening the devtools.
	if (platformKey && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
		platformKey.textContent = '⌘';
		openButton.setAttribute('aria-keyshortcuts', 'Meta+K');
	}
	shortcut.style.display = '';
})();
