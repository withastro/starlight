import { z } from 'astro/zod';

export function i18nSchema() {
	return starlightI18nSchema().merge(pagefindI18nSchema());
}

export function builtinI18nSchema() {
	return starlightI18nSchema().required().strict().merge(pagefindI18nSchema());
}

function starlightI18nSchema() {
	return z
		.object({
			'skipLink.label': z
				.string()
				.describe(
					'Text displayed in the accessible “Skip link” when a keyboard user first tabs into a page.'
				),

			'search.label': z.string().describe('Text displayed in the search bar.'),

			'search.shortcutLabel': z
				.string()
				.describe('Accessible label for the shortcut key to open the search modal.'),

			'search.cancelLabel': z
				.string()
				.describe('Text for the “Cancel” button that closes the search modal.'),

			'search.devWarning': z
				.string()
				.describe('Warning displayed when opening the Search in a dev environment.'),

			'themeSelect.accessibleLabel': z
				.string()
				.describe('Accessible label for the theme selection dropdown.'),

			'themeSelect.dark': z.string().describe('Name of the dark color theme.'),

			'themeSelect.light': z.string().describe('Name of the light color theme.'),

			'themeSelect.auto': z
				.string()
				.describe('Name of the automatic color theme that syncs with system preferences.'),

			'languageSelect.accessibleLabel': z
				.string()
				.describe('Accessible label for the language selection dropdown.'),

			'menuButton.accessibleLabel': z
				.string()
				.describe('Accessible label for he mobile menu button.'),

			'sidebarNav.accessibleLabel': z
				.string()
				.describe(
					'Accessible label for the main sidebar `<nav>` element to distinguish it fom other `<nav>` landmarks on the page.'
				),

			'tableOfContents.onThisPage': z
				.string()
				.describe('Title for the table of contents component.'),

			'tableOfContents.overview': z
				.string()
				.describe(
					'Label used for the first link in the table of contents, linking to the page title.'
				),

			'i18n.untranslatedContent': z
				.string()
				.describe(
					'Notice informing users they are on a page that is not yet translated to their language.'
				),

			'page.editLink': z.string().describe('Text for the link to edit a page.'),

			'page.lastUpdated': z
				.string()
				.describe('Text displayed in front of the last updated date in the page footer.'),

			'page.previousLink': z
				.string()
				.describe('Label shown on the “previous page” pagination arrow in the page footer.'),

			'page.nextLink': z
				.string()
				.describe('Label shown on the “next page” pagination arrow in the page footer.'),

			'404.text': z.string().describe('Text shown on Starlight’s default 404 page'),
		})
		.partial();
}

function pagefindI18nSchema() {
	return z
		.object({
			'pagefind.clear_search': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"Clear"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.load_more': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"Load more results"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.search_label': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"Search this site"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.filters_label': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"Filters"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.zero_results': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.many_results': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"[COUNT] results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.one_result': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"[COUNT] result for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.alt_search': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Showing results for [DIFFERENT_TERM] instead"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.search_suggestion': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Try one of the following searches:"`. See https://pagefind.app/docs/ui/#translations'
				),

			'pagefind.searching': z
				.string()
				.describe(
					'Pagefind UI translation. English default value: `"Searching for [SEARCH_TERM]..."`. See https://pagefind.app/docs/ui/#translations'
				),
		})
		.partial();
}
