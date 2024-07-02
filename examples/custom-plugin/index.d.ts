declare module 'starlight-custom-plugin' {
	export default function starlightCustomPlugin(): import('@astrojs/starlight/types').StarlightPlugin;
}

declare namespace StarlightApp {
	type UIStringsKeys = {
		[Key in keyof typeof import('./i18n').UIStrings.en]: string;
	};
	interface I18n extends UIStringsKeys {}
}
