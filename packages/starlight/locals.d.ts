/**
 * This namespace is reserved for Starlight (only used for i18n at the moment).
 * It can be extended by plugins using module augmentation and interface merging.
 * For an example, see: https://starlight.astro.build/reference/plugins/#injecttranslations
 */
declare namespace StarlightApp {
	interface I18n {}
}

/**
 * Extending Astro’s `App.Locals` interface registers types for the middleware added by Starlight.
 */
declare namespace App {
	interface Locals {
		t: import('./utils/createTranslationSystem').I18nT;
	}
}
