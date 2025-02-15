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
		/**
		 * Starlight’s localization API, powered by i18next.
		 *
		 * @see https://starlight.astro.build/guides/i18n/#using-ui-translations
		 *
		 * @example
		 * // Render a UI string for the current locale.
		 * <p>{Astro.locals.t('404.text')}</p>
		 */
		t: import('./utils/createTranslationSystem').I18nT;

		/**
		 * Starlight’s data for the current route.
		 *
		 * @see https://starlight.astro.build/guides/route-data/
		 *
		 * @throws Will throw an error if accessed on non-Starlight routes.
		 *
		 * @example
		 * // Render the title for the current page
		 * <h1>{Astro.locals.starlightRoute.entry.data.title}</h1>
		 *
		 * @example
		 * // Check if the current page should render the sidebar
		 * const { hasSidebar } = Astro.locals.starlightRoute;
		 */
		starlightRoute: import('./utils/routing/types').StarlightRouteData;
	}
}
