import { z } from 'astro/zod';

/**
 * Schema for the Algolia DocSearch component’s strings.
 *
 * Add this to your `src/content/config.ts`:
 *
 * ```js
 * import { defineCollection } from 'astro:content';
 * import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
 * import { docSearchI18nSchema } from '@astrojs/starlight-docsearch/schema';
 *
 * export const collections = {
 * 		docs: defineCollection({ schema: docsSchema() }),
 * 		i18n: defineCollection({
 * 			type: 'data',
 * 			schema: i18nSchema({ extend: docSearchI18nSchema() }),
 * 		}),
 * };
 * ```
 *
 * DocSearch uses a nested object structure.
 * This schema is a flattened version of the DocSearch structure.
 *
 * For example, customizing DocSearch labels looks like this
 * when using the component from JavaScript:
 *
 * ```js
 * {
 *    button: {
 *      buttonText: 'Search',
 *    },
 *    modal: {
 *      footer: {
 *        selectKeyAriaLabel: 'Return key',
 *      },
 *    },
 * },
 * ```
 *
 * In your Starlight translation files, set this using the full object path
 * as the key for each string, prefixed with `docsearch`:
 *
 * ```json
 * {
 *   "docsearch.button.buttonText": "Search",
 *   "docsearch.modal.footer.selectKeyAriaLabel": "Return key"
 * }
 * ```
 *
 * @see https://docsearch.algolia.com/docs/api/#translations
 */
export const docSearchI18nSchema = () =>
	z
		.object({
			// BUTTON
			/** Default: `Search` */
			'docsearch.button.buttonText': z.string(),
			/** Default: `Search` */
			'docsearch.button.buttonAriaLabel': z.string(),

			// MODAL - SEARCH BOX
			/** Default: `Clear the query` */
			'docsearch.modal.searchBox.resetButtonTitle': z.string(),
			/** Default: `Clear the query` */
			'docsearch.modal.searchBox.resetButtonAriaLabel': z.string(),
			/** Default: `Cancel` */
			'docsearch.modal.searchBox.cancelButtonText': z.string(),
			/** Default: `Cancel` */
			'docsearch.modal.searchBox.cancelButtonAriaLabel': z.string(),

			// MODAL - START SCREEN
			/** Default: `Recent` */
			'docsearch.modal.startScreen.recentSearchesTitle': z.string(),
			/** Default: `No recent searches` */
			'docsearch.modal.startScreen.noRecentSearchesText': z.string(),
			/** Default: `Save this search` */
			'docsearch.modal.startScreen.saveRecentSearchButtonTitle': z.string(),
			/** Default: `Remove this search from history` */
			'docsearch.modal.startScreen.removeRecentSearchButtonTitle': z.string(),
			/** Default: `Favorite` */
			'docsearch.modal.startScreen.favoriteSearchesTitle': z.string(),
			/** Default: `Remove this search from favorites` */
			'docsearch.modal.startScreen.removeFavoriteSearchButtonTitle': z.string(),

			// MODAL - ERROR SCREEN
			/** Default: `Unable to fetch results` */
			'docsearch.modal.errorScreen.titleText': z.string(),
			/** Default: `You might want to check your network connection.` */
			'docsearch.modal.errorScreen.helpText': z.string(),

			// MODAL - FOOTER
			/** Default: `to select` */
			'docsearch.modal.footer.selectText': z.string(),
			/** Default: `Enter key` */
			'docsearch.modal.footer.selectKeyAriaLabel': z.string(),
			/** Default: `to navigate` */
			'docsearch.modal.footer.navigateText': z.string(),
			/** Default: `Arrow up` */
			'docsearch.modal.footer.navigateUpKeyAriaLabel': z.string(),
			/** Default: `Arrow down` */
			'docsearch.modal.footer.navigateDownKeyAriaLabel': z.string(),
			/** Default: `to close` */
			'docsearch.modal.footer.closeText': z.string(),
			/** Default: `Escape key` */
			'docsearch.modal.footer.closeKeyAriaLabel': z.string(),
			/** Default: `Search by` */
			'docsearch.modal.footer.searchByText': z.string(),

			// MODAL - NO RESULTS SCREEN
			/** Default: `No results for` */
			'docsearch.modal.noResultsScreen.noResultsText': z.string(),
			/** Default: `Try searching for` */
			'docsearch.modal.noResultsScreen.suggestedQueryText': z.string(),
			/** Default: `Believe this query should return results?` */
			'docsearch.modal.noResultsScreen.reportMissingResultsText': z.string(),
			/** Default: `Let us know.` */
			'docsearch.modal.noResultsScreen.reportMissingResultsLinkText': z.string(),
		})
		.partial();
