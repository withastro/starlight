declare namespace App {
	type StarlightLocals = import('@astrojs/starlight').StarlightLocals;

	interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
	type UIStringsKeys = {
		[Key in keyof typeof import('./i18n').UIStrings.en]: string;
	};
	interface I18n extends UIStringsKeys {}
}
