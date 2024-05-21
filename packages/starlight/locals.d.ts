declare module '@astrojs/starlight' {
	export default function StarlightIntegration(
		options: import('./utils/plugins').StarlightUserConfigWithPlugins
	): import('astro').AstroIntegration;
}

declare namespace StarlightApp {
	interface I18n {}
}

declare namespace App {
	interface Locals {
		t: import('./utils/createTranslationSystem').I18nT;
	}
}
