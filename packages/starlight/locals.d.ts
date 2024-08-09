declare module '@astrojs/starlight' {
	export default function StarlightIntegration(
		options: import('./utils/plugins').StarlightUserConfigWithPlugins
	): import('astro').AstroIntegration;

	export interface StarlightLocals {
		t: import('./utils/createTranslationSystem').I18nT;
	}
}

declare namespace StarlightApp {
	interface I18n {}
}

declare namespace App {
	interface Locals {
		t: import('./utils/createTranslationSystem').I18nT;
	}
}
