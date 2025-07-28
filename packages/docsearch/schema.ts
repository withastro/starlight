import { z } from 'astro/zod';

/**
 * Schema for the Algolia DocSearch modal’s strings.
 *
 * Add this to your `src/content.config.ts`:
 *
 * ```js
 * import { defineCollection } from 'astro:content';
 * import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
 * import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
 * import { docSearchI18nSchema } from '@astrojs/starlight-docsearch/schema';
 *
 * export const collections = {
 * 		docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
 * 		i18n: defineCollection({
 * 			loader: i18nLoader(),
 * 			schema: i18nSchema({ extend: docSearchI18nSchema() }),
 * 		}),
 * };
 * ```
 *
 * DocSearch uses a nested object structure.
 * This schema is a flattened version of DocSearch’s `modal` translations.
 *
 * For example, customizing DocSearch labels looks like this
 * when using the component from JavaScript:
 *
 * ```js
 * {
 *    modal: {
 *      footer: {
 *        selectKeyAriaLabel: 'Return key',
 *      },
 *    },
 * },
 * ```
 *
 * In your Starlight translation files, set this using the object path inside `modal`
 * as the key for each string, prefixed with `docsearch`:
 *
 * ```json
 * {
 *   "docsearch.footer.selectKeyAriaLabel": "Return key"
 * }
 * ```
 *
 * @see https://docsearch.algolia.com/docs/api/#translations
 */
export const docSearchI18nSchema = () =>
	z
		.object({
			// SEARCH BOX
			/** Default: `Clear the query` */
			'docsearch.searchBox.clearButtonTitle': z.string(),
			'docsearch.searchBox.clearButtonAriaLabel': z.string(),
			/** Default: `Close` */
			'docsearch.searchBox.closeButtonText': z.string(),
			'docsearch.searchBox.cancelButtonAriaLabel': z.string(),
			/** Default: `Search` */
			'docsearch.searchBox.placeholderText': z.string(),
			/** Default: `Ask AI` placeholder */
			'docsearch.searchBox.placeholderTextAskAi': z.string(),
			/** Default: `Answering…` placeholder while streaming */
			'docsearch.searchBox.placeholderTextAskAiStreaming': z.string(),
			/** Default: `Search` */
			'docsearch.searchBox.searchInputLabel': z.string(),
			/** Back navigation from Ask AI to keyword search */
			'docsearch.searchBox.backToKeywordSearchButtonText': z.string(),
			'docsearch.searchBox.backToKeywordSearchButtonAriaLabel': z.string(),

			// START SCREEN
			/** Default: `Recent` */
			'docsearch.startScreen.recentSearchesTitle': z.string(),
			/** Default: `No recent searches` */
			'docsearch.startScreen.noRecentSearchesText': z.string(),
			/** Default: `Save this search` */
			'docsearch.startScreen.saveRecentSearchButtonTitle': z.string(),
			/** Default: `Remove this search from history` */
			'docsearch.startScreen.removeRecentSearchButtonTitle': z.string(),
			/** Default: `Favorite` */
			'docsearch.startScreen.favoriteSearchesTitle': z.string(),
			/** Default: `Remove this search from favorites` */
			'docsearch.startScreen.removeFavoriteSearchButtonTitle': z.string(),
			'docsearch.startScreen.recentConversationsTitle': z.string(),
			'docsearch.startScreen.removeRecentConversationButtonTitle': z.string(),

			// ERROR SCREEN
			/** Default: `Unable to fetch results` */
			'docsearch.errorScreen.titleText': z.string(),
			/** Default: `You might want to check your network connection.` */
			'docsearch.errorScreen.helpText': z.string(),

			// FOOTER
			/** Default: `to select` */
			'docsearch.footer.selectText': z.string(),
			/** Default: `Enter key` */
			'docsearch.footer.selectKeyAriaLabel': z.string(),
			/** Default: `to navigate` */
			'docsearch.footer.navigateText': z.string(),
			/** Default: `Arrow up` */
			'docsearch.footer.navigateUpKeyAriaLabel': z.string(),
			/** Default: `Arrow down` */
			'docsearch.footer.navigateDownKeyAriaLabel': z.string(),
			/** Default: `to close` */
			'docsearch.footer.closeText': z.string(),
			/** Default: `Escape key` */
			'docsearch.footer.closeKeyAriaLabel': z.string(),
			/** Default: `Search by` */
			'docsearch.footer.submitQuestionText': z.string(),
			'docsearch.footer.backToSearchText': z.string(),
			'docsearch.footer.poweredByText': z.string(),

			// NO RESULTS SCREEN
			/** Default: `No results for` */
			'docsearch.noResultsScreen.noResultsText': z.string(),
			/** Default: `Try searching for` */
			'docsearch.noResultsScreen.suggestedQueryText': z.string(),
			/** Default: `Believe this query should return results?` */
			'docsearch.noResultsScreen.reportMissingResultsText': z.string(),
			/** Default: `Let us know.` */
			'docsearch.noResultsScreen.reportMissingResultsLinkText': z.string(),

			// RESULTS SCREEN (Ask AI entry point)
			'docsearch.resultsScreen.askAiPlaceholder': z.string(),

			// ASK AI SCREEN translations
			'docsearch.askAiScreen.disclaimerText': z.string(),
			'docsearch.askAiScreen.relatedSourcesText': z.string(),
			'docsearch.askAiScreen.thinkingText': z.string(),
			'docsearch.askAiScreen.copyButtonText': z.string(),
			'docsearch.askAiScreen.copyButtonCopiedText': z.string(),
			'docsearch.askAiScreen.copyButtonTitle': z.string(),
			'docsearch.askAiScreen.likeButtonTitle': z.string(),
			'docsearch.askAiScreen.dislikeButtonTitle': z.string(),
			'docsearch.askAiScreen.thanksForFeedbackText': z.string(),
			'docsearch.askAiScreen.preToolCallText': z.string(),
			'docsearch.askAiScreen.duringToolCallText': z.string(),
			'docsearch.askAiScreen.afterToolCallText': z.string(),
			'docsearch.askAiScreen.aggregatedToolCallText': z.string(),
		})
		.partial();
