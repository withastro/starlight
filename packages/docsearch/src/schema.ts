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
			/** Default: `Clear` */
			'docsearch.searchBox.clearButtonTitle': z.string(),
			/** Default: `Clear the query` */
			'docsearch.searchBox.clearButtonAriaLabel': z.string(),
			/** Default: `Close` */
			'docsearch.searchBox.closeButtonText': z.string(),
			/** Default: `Close` */
			'docsearch.searchBox.closeButtonAriaLabel': z.string(),
			/** Default: `Search` or `Search docs or ask AI a question` with Ask AI */
			'docsearch.searchBox.placeholderText': z.string(),
			/** Default: `Ask another question...` */
			'docsearch.searchBox.placeholderTextAskAi': z.string(),
			/** Default: `Answering...` */
			'docsearch.searchBox.placeholderTextAskAiStreaming': z.string(),
			'docsearch.searchBox.enterKeyHint': z.string(),
			'docsearch.searchBox.enterKeyHintAskAi': z.string(),
			/** Default: `Search` */
			'docsearch.searchBox.searchInputLabel': z.string(),
			/** Default: `Back to keyword search` */
			'docsearch.searchBox.backToKeywordSearchButtonText': z.string(),
			/** Default: `Back to keyword search` */
			'docsearch.searchBox.backToKeywordSearchButtonAriaLabel': z.string(),
			/** Default: `Ask a question` */
			'docsearch.searchBox.newConversationPlaceholder': z.string(),
			/** Default: `My conversation history` */
			'docsearch.searchBox.conversationHistoryTitle': z.string(),
			/** Default: `Start a new conversation` */
			'docsearch.searchBox.startNewConversationText': z.string(),
			/** Default: `Conversation history` */
			'docsearch.searchBox.viewConversationHistoryText': z.string(),
			/** Default: `Conversation limit reached` */
			'docsearch.searchBox.threadDepthErrorPlaceholder': z.string(),

			// START SCREEN
			/** Default: `Recently viewed docs` */
			'docsearch.startScreen.recentSearchesTitle': z.string(),
			'docsearch.startScreen.noRecentSearchesText': z.string(),
			/** Default: `Pin this search` */
			'docsearch.startScreen.saveRecentSearchButtonTitle': z.string(),
			/** Default: `Remove this search from history` */
			'docsearch.startScreen.removeRecentSearchButtonTitle': z.string(),
			/** Default: `Pinned` */
			'docsearch.startScreen.favoriteSearchesTitle': z.string(),
			/** Default: `Remove this saved search` */
			'docsearch.startScreen.removeFavoriteSearchButtonTitle': z.string(),
			/** Default: `Resume AI conversations` */
			'docsearch.startScreen.recentConversationsTitle': z.string(),
			/** Default: `Remove this conversation from history` */
			'docsearch.startScreen.removeRecentConversationButtonTitle': z.string(),

			// ERROR SCREEN
			/** Default: `Unable to fetch results` */
			'docsearch.errorScreen.titleText': z.string(),
			/** Default: `You might want to check your network connection.` */
			'docsearch.errorScreen.helpText': z.string(),

			// FOOTER
			/** Default: `Select` */
			'docsearch.footer.selectText': z.string(),
			/** Default: `Enter key` */
			'docsearch.footer.selectKeyAriaLabel': z.string(),
			/** Default: `Navigate` */
			'docsearch.footer.navigateText': z.string(),
			/** Default: `Arrow up` */
			'docsearch.footer.navigateUpKeyAriaLabel': z.string(),
			/** Default: `Arrow down` */
			'docsearch.footer.navigateDownKeyAriaLabel': z.string(),
			/** Default: `Close` */
			'docsearch.footer.closeText': z.string(),
			/** Default: `Escape key` */
			'docsearch.footer.closeKeyAriaLabel': z.string(),
			/** Default: `Submit question` */
			'docsearch.footer.submitQuestionText': z.string(),
			/** Default: `Back to search` */
			'docsearch.footer.backToSearchText': z.string(),
			/** Default: `Powered by` */
			'docsearch.footer.poweredByText': z.string(),

			// NO RESULTS SCREEN
			/** Default: `No results found for` */
			'docsearch.noResultsScreen.noResultsText': z.string(),
			/** Default: `Try searching for` */
			'docsearch.noResultsScreen.suggestedQueryText': z.string(),
			/** Default: `Believe this query should return results?` */
			'docsearch.noResultsScreen.reportMissingResultsText': z.string(),
			/** Default: `Let us know.` */
			'docsearch.noResultsScreen.reportMissingResultsLinkText': z.string(),

			// RESULTS SCREEN
			'docsearch.resultsScreen.askAiPlaceholder': z.string(),
			'docsearch.resultsScreen.noResultsAskAiPlaceholder': z.string(),
			'docsearch.resultsScreen.resultsSectionTitle': z.string(),
			/** Default: `Ask AI Assistant` */
			'docsearch.resultsScreen.askAiResultsTitle': z.string(),
			/** Default: `Category` */
			'docsearch.resultsScreen.resultBadgeLabelText': z.string(),
			/** Default: `A while ago` */
			'docsearch.resultsScreen.recentConversationTimestampFallback': z.string(),

			// FACETS
			/** Default: `All` */
			'docsearch.facets.defaultValueLabel': z.string(),
			/** Default: `selected` */
			'docsearch.facets.facetMenuTriggerAriaLabel': z.string(),
			/** Default: `Clear all` */
			'docsearch.facets.clearAllLabel': z.string(),
			/** Default: `Search filters` */
			'docsearch.facets.facetsAriaLabel': z.string(),
			/** Default: `Selected search filters` */
			'docsearch.facets.selectedFacetsAriaLabel': z.string(),
			/** Default: `Clear filter:` */
			'docsearch.facets.clearFacetAriaLabel': z.string(),

			// ASK AI SCREEN
			/** Default: `Answers are generated with AI which can make mistakes.` */
			'docsearch.askAiScreen.disclaimerText': z.string(),
			/** Default: `Source` */
			'docsearch.askAiScreen.relatedSourcesText': z.string(),
			/** Default: `Sources` */
			'docsearch.askAiScreen.relatedSourcesTextPlural': z.string(),
			/** Default: `Thinking...` */
			'docsearch.askAiScreen.thinkingText': z.string(),
			/** Default: `Copy` */
			'docsearch.askAiScreen.copyButtonText': z.string(),
			/** Default: `Copied!` */
			'docsearch.askAiScreen.copyButtonCopiedText': z.string(),
			/** Default: `Copy` */
			'docsearch.askAiScreen.copyButtonTitle': z.string(),
			/** Default: `Like` */
			'docsearch.askAiScreen.likeButtonTitle': z.string(),
			/** Default: `Dislike` */
			'docsearch.askAiScreen.dislikeButtonTitle': z.string(),
			/** Default: `Thanks for your feedback!` */
			'docsearch.askAiScreen.thanksForFeedbackText': z.string(),
			/** Default: `What went wrong? (optional)` */
			'docsearch.askAiScreen.feedbackPanelTitle': z.string(),
			/** Default: `Share some details...` */
			'docsearch.askAiScreen.feedbackDetailsPlaceholder': z.string(),
			'docsearch.askAiScreen.feedbackDisclaimerText': z.string(),
			/** Default: `Submit` */
			'docsearch.askAiScreen.feedbackSubmitButtonText': z.string(),
			'docsearch.askAiScreen.feedbackCloseButtonTitle': z.string(),
			/** Default: `Incorrect or incomplete` */
			'docsearch.askAiScreen.feedbackTagIncorrect': z.string(),
			/** Default: `Not what I asked for` */
			'docsearch.askAiScreen.feedbackTagNotWhatIAsked': z.string(),
			/** Default: `Slow or buggy` */
			'docsearch.askAiScreen.feedbackTagSlowOrBuggy': z.string(),
			/** Default: `Style or tone` */
			'docsearch.askAiScreen.feedbackTagStyleOrTone': z.string(),
			/** Default: `Safety or legal concern` */
			'docsearch.askAiScreen.feedbackTagSafetyOrLegal': z.string(),
			/** Default: `Other` */
			'docsearch.askAiScreen.feedbackTagOther': z.string(),
			/** Default: `Searching...` */
			'docsearch.askAiScreen.duringToolCallText': z.string(),
			/** Default: `Searched for` */
			'docsearch.askAiScreen.afterToolCallText': z.string(),
			/** Default: `You stopped this response` */
			'docsearch.askAiScreen.stoppedStreamingText': z.string(),
			/** Default: `Chat error` */
			'docsearch.askAiScreen.errorTitleText': z.string(),
			/** Default: `This conversation is now closed to keep responses accurate.` */
			'docsearch.askAiScreen.threadDepthExceededMessage': z.string(),
			/** Default: `Start a new conversation` */
			'docsearch.askAiScreen.startNewConversationButtonText': z.string(),
			/** Default: `Suggested prompts` */
			'docsearch.askAiScreen.suggestedPromptsTitleText': z.string(),
			/** Default: `Searching...` */
			'docsearch.askAiScreen.preToolCallText': z.string(),
			/** Default: `Saved to memory` */
			'docsearch.askAiScreen.savedMemoryToolResultText': z.string(),
			/** Default: `Used memory to enhance results` */
			'docsearch.askAiScreen.memoryToolResultText': z.string(),

			// NEW CONVERSATION
			/** Default: `How can I help you today?` */
			'docsearch.newConversation.newConversationTitle': z.string(),
			/** Default: `I search through your documentation to help you find setup guides, feature details and troubleshooting tips, fast.` */
			'docsearch.newConversation.newConversationDescription': z.string(),
		})
		.partial();
