import { z } from 'astro/zod';

interface i18nSchemaOpts<T extends z.ZodObject = BaseExtendSchema> {
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

const defaultI18nSchema = () =>
	z.object({
		...starlightI18nSchema().shape,
		...pagefindI18nSchema().shape,
		...expressiveCodeI18nSchema().shape,
	});
/** Type of Starlight’s default i18n schema, including extensions from Pagefind and Expressive Code. */
type DefaultI18nSchema = ReturnType<typeof defaultI18nSchema>;

/**
 * Based on the the return type of Zod’s `extend()` method. Adds fields from one `z.object()` schema
 * to another.
 * Also sets the resulting schema as “loose” as that’s how we use it. In practice whether or not
 * the types are loose or not doesn’t matter too much.
 *
 * @see https://github.com/colinhacks/zod/blob/9712a6707f3d4584f222729965f3b78f076f0435/packages/zod/src/v4/classic/schemas.ts#L1187
 */
type MergeSchemas<A extends z.ZodObject, B extends z.ZodObject> = z.ZodObject<
	z.util.Extend<A['shape'], B['shape']>,
	z.core.$loose
>;
/** Type that extends Starlight’s default i18n schema with an optional, user-defined schema. */
type ExtendedSchema<T extends z.ZodObject> = T extends z.ZodObject
	? MergeSchemas<DefaultI18nSchema, T>
	: DefaultI18nSchema;
/** Type representing an empty Zod object schema used as the default for the `extend` option. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type BaseExtendSchema = z.ZodObject<{}>;

/** Content collection schema for Starlight’s optional `i18n` collection. */
export function i18nSchema<T extends z.ZodObject = BaseExtendSchema>({
	extend = z.object({}) as T,
}: i18nSchemaOpts<T> = {}): ExtendedSchema<T> {
	return z.looseObject({
		...defaultI18nSchema().shape,
		...extend.shape,
	}) as ExtendedSchema<T>;
}
export type i18nSchemaOutput = z.output<ExtendedSchema<BaseExtendSchema>>;

export function builtinI18nSchema() {
	return z.object({
		...z.strictObject({ ...starlightI18nSchema().required().shape }).shape,
		...pagefindI18nSchema().shape,
		...expressiveCodeI18nSchema().shape,
	});
}

function starlightI18nSchema() {
	return z
		.object({
			'skipLink.label': z.string().meta({
				description:
					'Text displayed in the accessible “Skip link” when a keyboard user first tabs into a page.',
			}),

			'search.label': z.string().meta({ description: 'Text displayed in the search bar.' }),

			'search.ctrlKey': z.string().meta({
				description:
					'Visible representation of the Control key potentially used in the shortcut key to open the search modal.',
			}),

			'search.cancelLabel': z
				.string()
				.meta({ description: 'Text for the “Cancel” button that closes the search modal.' }),

			'search.devWarning': z.string().meta({
				description: 'Warning displayed when opening the Search in a dev environment.',
			}),

			'themeSelect.accessibleLabel': z
				.string()
				.meta({ description: 'Accessible label for the theme selection dropdown.' }),

			'themeSelect.dark': z.string().meta({ description: 'Name of the dark color theme.' }),

			'themeSelect.light': z.string().meta({ description: 'Name of the light color theme.' }),

			'themeSelect.auto': z.string().meta({
				description: 'Name of the automatic color theme that syncs with system preferences.',
			}),

			'languageSelect.accessibleLabel': z
				.string()
				.meta({ description: 'Accessible label for the language selection dropdown.' }),

			'menuButton.accessibleLabel': z
				.string()
				.meta({ description: 'Accessible label for the mobile menu button.' }),

			'sidebarNav.accessibleLabel': z.string().meta({
				description:
					'Accessible label for the main sidebar `<nav>` element to distinguish it from other `<nav>` landmarks on the page.',
			}),

			'tableOfContents.onThisPage': z
				.string()
				.meta({ description: 'Title for the table of contents component.' }),

			'tableOfContents.overview': z.string().meta({
				description:
					'Label used for the first link in the table of contents, linking to the page title.',
			}),

			'i18n.untranslatedContent': z.string().meta({
				description:
					'Notice informing users they are on a page that is not yet translated to their language.',
			}),

			'page.editLink': z.string().meta({ description: 'Text for the link to edit a page.' }),

			'page.lastUpdated': z.string().meta({
				description: 'Text displayed in front of the last updated date in the page footer.',
			}),

			'page.previousLink': z.string().meta({
				description: 'Label shown on the “previous page” pagination arrow in the page footer.',
			}),

			'page.nextLink': z.string().meta({
				description: 'Label shown on the “next page” pagination arrow in the page footer.',
			}),

			'page.draft': z.string().meta({
				description:
					'Development-only notice informing users they are on a page that is a draft which will not be included in production builds.',
			}),

			'404.text': z.string().meta({ description: 'Text shown on Starlight’s default 404 page' }),
			'aside.tip': z.string().meta({ description: 'Text shown on the tip aside variant' }),
			'aside.note': z.string().meta({ description: 'Text shown on the note aside variant' }),
			'aside.caution': z.string().meta({ description: 'Text shown on the warning aside variant' }),
			'aside.danger': z.string().meta({ description: 'Text shown on the danger aside variant' }),

			'fileTree.directory': z
				.string()
				.meta({ description: 'Label for the directory icon in the file tree component.' }),

			'builtWithStarlight.label': z.string().meta({
				description:
					'Label for the “Built with Starlight” badge optionally displayed in the site footer.',
			}),

			'heading.anchorLabel': z
				.string()
				.meta({ description: 'Label for anchor links in Markdown content.' }),
		})
		.partial();
}

function pagefindI18nSchema() {
	return z
		.object({
			'pagefind.clear_search': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"Clear"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.load_more': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"Load more results"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.search_label': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"Search this site"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.filters_label': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"Filters"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.zero_results': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.many_results': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"[COUNT] results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.one_result': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"[COUNT] result for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.alt_search': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Showing results for [DIFFERENT_TERM] instead"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.search_suggestion': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Try one of the following searches:"`. See https://pagefind.app/docs/ui/#translations',
			}),

			'pagefind.searching': z.string().meta({
				description:
					'Pagefind UI translation. English default value: `"Searching for [SEARCH_TERM]..."`. See https://pagefind.app/docs/ui/#translations',
			}),
		})
		.partial();
}

function expressiveCodeI18nSchema() {
	return z
		.object({
			'expressiveCode.copyButtonCopied': z.string().meta({
				description: 'Expressive Code UI translation. English default value: `"Copied!"`',
			}),

			'expressiveCode.copyButtonTooltip': z.string().meta({
				description: 'Expressive Code UI translation. English default value: `"Copy to clipboard"`',
			}),

			'expressiveCode.terminalWindowFallbackTitle': z.string().meta({
				description: 'Expressive Code UI translation. English default value: `"Terminal window"`',
			}),
		})
		.partial();
}
