import { z } from 'astro/zod';

interface i18nSchemaOpts<T extends z.AnyZodObject = z.SomeZodObject> {
	/**
	 * Extend Starlight’s i18n schema with additional fields.
	 *
	 * @example
	 * // Add two optional fields to the default schema.
	 * i18nSchema({
	 * 	extend: z
	 * 		.object({
	 * 			'customUi.heading': z.string(),
	 * 			'customUi.text': z.string(),
	 * 		})
	 * 		.partial(),
	 * })
	 */
	extend?: T;
}

const defaultI18nSchema = () => starlightI18nSchema().merge(expressiveCodeI18nSchema());
/** Type of Starlight’s default i18n schema, including extensions from Pagefind and Expressive Code. */
type DefaultI18nSchema = ReturnType<typeof defaultI18nSchema>;

/**
 * Based on the the return type of Zod’s `merge()` method. Merges the type of two `z.object()` schemas.
 * Also sets them as “passthrough” schemas as that’s how we use them. In practice whether or not the types
 * are passthrough or not doesn’t matter too much.
 *
 * @see https://github.com/colinhacks/zod/blob/3032e240a0c227692bb96eedf240ed493c53f54c/src/types.ts#L2656-L2660
 */
type MergeSchemas<A extends z.AnyZodObject, B extends z.AnyZodObject> = z.ZodObject<
	z.objectUtil.extendShape<A['shape'], B['shape']>,
	'passthrough',
	B['_def']['catchall']
>;
/** Type that extends Starlight’s default i18n schema with an optional, user-defined schema. */
type ExtendedSchema<T extends z.AnyZodObject> = T extends z.AnyZodObject
	? MergeSchemas<DefaultI18nSchema, T>
	: DefaultI18nSchema;

/** Content collection schema for Starlight’s optional `i18n` collection. */
export function i18nSchema<T extends z.AnyZodObject = z.SomeZodObject>({
	extend = z.object({}) as T,
}: i18nSchemaOpts<T> = {}): ExtendedSchema<T> {
	return defaultI18nSchema().merge(extend).passthrough() as ExtendedSchema<T>;
}
export type i18nSchemaOutput = z.output<ReturnType<typeof i18nSchema>>;

export function builtinI18nSchema() {
	return starlightI18nSchema().required().strict().merge(expressiveCodeI18nSchema());
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

			'search.ctrlKey': z
				.string()
				.describe(
					'Visible representation of the Control key potentially used in the shortcut key to open the search modal.'
				),

			'search.cancelLabel': z
				.string()
				.describe('Text for the “Cancel” button that closes the search modal.'),

			'search.devWarning': z
				.string()
				.describe('Warning displayed when opening the Search in a dev environment.'),

			'search.pagefind.clear': z
				.string()
				.describe('Text for the “Clear” input button in the search modal.'),

			'search.pagefind.filters': z
				.string()
				.describe('Title for the filters section in the search modal.'),

			'search.pagefind.loadMore': z
				.string()
				.describe('Text for the “Load more results” button in the search modal.'),

			'search.pagefind.client.searching': z
				.string()
				.describe('Status text displayed in the search modal while searching.'),

			'search.pagefind.client.results_zero': z
				.string()
				.describe('Status text displayed in the search modal when there are no results.'),

			'search.pagefind.client.results_one': z
				.string()
				.describe('Status text displayed in the search modal when there is exactly one result.'),

			'search.pagefind.client.results_other': z
				.string()
				.describe('Status text displayed in the search modal when there are more than one result.'),

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
				.describe('Accessible label for the mobile menu button.'),

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

			'page.draft': z
				.string()
				.describe(
					'Development-only notice informing users they are on a page that is a draft which will not be included in production builds.'
				),

			'404.text': z.string().describe('Text shown on Starlight’s default 404 page'),
			'aside.tip': z.string().describe('Text shown on the tip aside variant'),
			'aside.note': z.string().describe('Text shown on the note aside variant'),
			'aside.caution': z.string().describe('Text shown on the warning aside variant'),
			'aside.danger': z.string().describe('Text shown on the danger aside variant'),

			'fileTree.directory': z
				.string()
				.describe('Label for the directory icon in the file tree component.'),

			'builtWithStarlight.label': z
				.string()
				.describe(
					'Label for the “Built with Starlight” badge optionally displayed in the site footer.'
				),

			'heading.anchorLabel': z.string().describe('Label for anchor links in Markdown content.'),
		})
		.partial();
}

function expressiveCodeI18nSchema() {
	return z
		.object({
			'expressiveCode.copyButtonCopied': z
				.string()
				.describe('Expressive Code UI translation. English default value: `"Copied!"`'),

			'expressiveCode.copyButtonTooltip': z
				.string()
				.describe('Expressive Code UI translation. English default value: `"Copy to clipboard"`'),

			'expressiveCode.terminalWindowFallbackTitle': z
				.string()
				.describe('Expressive Code UI translation. English default value: `"Terminal window"`'),
		})
		.partial();
}
