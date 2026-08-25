interface StarlightThemeProvider {
	updatePickers(theme?: string): void;
}

export declare global {
	var StarlightThemeProvider: StarlightThemeProvider;

	interface Window {
		StarlightThemeProvider: StarlightThemeProvider;
	}
}
