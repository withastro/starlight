import { z } from 'astro/zod';
import { parse as bcpParse, stringify as bcpStringify } from 'bcp-47';
import { ComponentConfigSchema } from '../schemas/components';
import { ExpressiveCodeSchema } from '../schemas/expressiveCode';
import { FaviconSchema } from '../schemas/favicon';
import { HeadConfigSchema } from '../schemas/head';
import { LogoConfigSchema } from '../schemas/logo';
import { PagefindConfigDefaults, PagefindConfigSchema } from '../schemas/pagefind';
import { SidebarItemSchema } from '../schemas/sidebar';
import { TitleConfigSchema, TitleTransformConfigSchema } from '../schemas/site-title';
import { SocialLinksSchema } from '../schemas/social';
import { TableOfContentsSchema } from '../schemas/tableOfContents';
import { BuiltInDefaultLocale } from './i18n';

const LocaleSchema = z.object({
	/** The label for this language to show in UI, e.g. `"English"`, `"العربية"`, or `"简体中文"`. */
	label: z
		.string()
		.describe(
			'The label for this language to show in UI, e.g. `"English"`, `"العربية"`, or `"简体中文"`.'
		),
	/** The BCP-47 tag for this language, e.g. `"en"`, `"ar"`, or `"zh-CN"`. */
	lang: z
		.string()
		.optional()
		.describe('The BCP-47 tag for this language, e.g. `"en"`, `"ar"`, or `"zh-CN"`.'),
	/** The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left. */
	dir: z
		.enum(['rtl', 'ltr'])
		.optional()
		.default('ltr')
		.describe(
			'The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left.'
		),
});

const UserConfigSchema = z.object({
	/** Title for your website. Will be used in metadata and as browser tab title. */
	title: TitleConfigSchema(),

	/** Description metadata for your website. Can be used in page metadata. */
	description: z
		.string()
		.optional()
		.describe('Description metadata for your website. Can be used in page metadata.'),

	/** Set a logo image to show in the navigation bar alongside or instead of the site title. */
	logo: LogoConfigSchema(),

	/**
	 * Optional details about the social media accounts for this site.
	 *
	 * @example
	 * social: [
	 *   { icon: 'codeberg', label: 'Codeberg', href: 'https://codeberg.org/knut' },
	 *   { icon: 'discord', label: 'Discord', href: 'https://astro.build/chat' },
	 *   { icon: 'github', label: 'GitHub', href: 'https://github.com/withastro' },
	 *   { icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/delucis' },
	 *   { icon: 'mastodon', label: 'Mastodon', href: 'https://m.webtoo.ls/@astro' },
	 * ]
	 */
	social: SocialLinksSchema(),

	/** The tagline for your website. */
	tagline: z.string().optional().describe('The tagline for your website.'),

	/** Configure the defaults for the table of contents on each page. */
	tableOfContents: TableOfContentsSchema(),

	/** Enable and configure “Edit this page” links. */
	editLink: z
		.object({
			/** Set the base URL for edit links. The final link will be `baseUrl` + the current page path. */
			baseUrl: z.string().url().optional(),
		})
		.optional()
		.default({}),

	/** Configure locales for internationalization (i18n). */
	locales: z
		.object({
			/** Configure a “root” locale to serve a default language from `/`. */
			root: LocaleSchema.required({ lang: true }).optional(),
		})
		.catchall(LocaleSchema)
		.transform((locales, ctx) => {
			for (const key in locales) {
				const locale = locales[key]!;
				// Fall back to the key in the locales object as the lang.
				let lang = locale.lang || key;

				// Parse the lang tag so we can check it is valid according to BCP-47.
				const schema = bcpParse(lang, { forgiving: true });
				schema.region = schema.region?.toUpperCase();
				const normalizedLang = bcpStringify(schema);

				// Error if parsing the language tag failed.
				if (!normalizedLang) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Could not validate language tag "${lang}" at locales.${key}.lang.`,
					});
					return z.NEVER;
				}

				// Let users know we’re modifying their configured `lang`.
				if (normalizedLang !== lang) {
					console.warn(
						`Warning: using "${normalizedLang}" language tag for locales.${key}.lang instead of "${lang}".`
					);
					lang = normalizedLang;
				}

				// Set the final value as the normalized lang, based on the key if needed.
				locale.lang = lang;
			}
			return locales;
		})
		.optional()
		.describe('Configure locales for internationalization (i18n).'),

	/**
	 * Specify the default language for this site.
	 *
	 * The default locale will be used to provide fallback content where translations are missing.
	 */
	defaultLocale: z.string().optional(),

	/** Configure your site’s sidebar navigation items. */
	sidebar: SidebarItemSchema.array().optional(),

	/**
	 * Add extra tags to your site’s `<head>`.
	 *
	 * Can also be set for a single page in a page’s frontmatter.
	 *
	 * @example
	 * // Add Fathom analytics to your site
	 * starlight({
	 *  head: [
	 *    {
	 *      tag: 'script',
	 *      attrs: {
	 *        src: 'https://cdn.usefathom.com/script.js',
	 *        'data-site': 'MY-FATHOM-ID',
	 *        defer: true,
	 *      },
	 *    },
	 *  ],
	 * })
	 */
	head: HeadConfigSchema(),

	/**
	 * Provide CSS files to customize the look and feel of your Starlight site.
	 *
	 * Supports local CSS files relative to the root of your project,
	 * e.g. `'/src/custom.css'`, and CSS you installed as an npm
	 * module, e.g. `'@fontsource/roboto'`.
	 *
	 * @example
	 * starlight({
	 *  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
	 * })
	 */
	customCss: z.string().array().optional().default([]),

	/** Define if the last update date should be visible in the page footer. */
	lastUpdated: z
		.boolean()
		.default(false)
		.describe('Define if the last update date should be visible in the page footer.'),

	/** Define if the previous and next page links should be visible in the page footer. */
	pagination: z
		.boolean()
		.default(true)
		.describe('Define if the previous and next page links should be visible in the page footer.'),

	/** The default favicon for your site which should be a path to an image in the `public/` directory. */
	favicon: FaviconSchema(),

	/**
	 * Define how code blocks are rendered by passing options to Expressive Code,
	 * or disable the integration by passing `false`.
	 */
	expressiveCode: ExpressiveCodeSchema(),

	/**
	 * Configure Starlight’s default site search provider Pagefind. Set to `false` to disable indexing
	 * your site with Pagefind, which will also hide the default search UI if in use.
	 */
	pagefind: z
		.boolean()
		// Transform `true` to our default config object.
		.transform((val) => val && PagefindConfigDefaults())
		.or(PagefindConfigSchema())
		.optional(),

	/** Specify paths to components that should override Starlight’s default components */
	components: ComponentConfigSchema(),

	/** Will be used as title delimiter in the generated `<title>` tag. */
	titleDelimiter: z
		.string()
		.default('|')
		.describe('Will be used as title delimiter in the generated `<title>` tag.'),

	/** Disable Starlight's default 404 page. */
	disable404Route: z.boolean().default(false).describe("Disable Starlight's default 404 page."),

	/**
	 * Define whether Starlight pages should be prerendered or not.
	 * Defaults to always prerender Starlight pages, even when the project is
	 * set to "server" output mode.
	 */
	prerender: z.boolean().default(true),

	/** Enable displaying a “Built with Starlight” link in your site’s footer. */
	credits: z
		.boolean()
		.default(false)
		.describe('Enable displaying a “Built with Starlight” link in your site’s footer.'),

	/** Add middleware to process Starlight’s route data for each page. */
	routeMiddleware: z
		.string()
		.transform((string) => [string])
		.or(z.string().array())
		.default([])
		.superRefine((middlewares, ctx) => {
			// Regex pattern to match invalid middleware paths: https://regex101.com/r/kQH7xm/2
			const invalidPathRegex = /^\.?\/src\/middleware(?:\/index)?\.[jt]s$/;
			const invalidPaths = middlewares.filter((middleware) => invalidPathRegex.test(middleware));
			for (const invalidPath of invalidPaths) {
				ctx.addIssue({
					code: 'custom',
					message:
						`The \`"${invalidPath}"\` path in your Starlight \`routeMiddleware\` config conflicts with Astro’s middleware locations.\n\n` +
						`You should rename \`${invalidPath}\` to something else like \`./src/starlightRouteData.ts\` and update the \`routeMiddleware\` file path to match.\n\n` +
						'- More about Starlight route middleware: https://starlight.astro.build/guides/route-data/#how-to-customize-route-data\n' +
						'- More about Astro middleware: https://docs.astro.build/en/guides/middleware/',
				});
			}
		})
		.describe('Add middleware to process Starlight’s route data for each page.'),

	/** Configure features that impact Starlight’s Markdown processing. */
	markdown: z
		.object({
			/** Define whether headings in content should be rendered with clickable anchor links. Default: `true`. */
			headingLinks: z
				.boolean()
				.default(true)
				.describe(
					'Define whether headings in content should be rendered with clickable anchor links. Default: `true`.'
				),
		})
		.default({})
		.describe('Configure features that impact Starlight’s Markdown processing.'),
});

export const StarlightConfigSchema = UserConfigSchema.strict()
	.transform((config) => ({
		...config,
		// Pagefind only defaults to true if prerender is also true.
		pagefind:
			typeof config.pagefind === 'undefined'
				? config.prerender && PagefindConfigDefaults()
				: config.pagefind,
	}))
	.refine((config) => !(!config.prerender && config.pagefind), {
		message: 'Pagefind search is not supported with prerendering disabled.',
	})
	.transform(({ title, locales, defaultLocale, ...config }, ctx) => {
		const configuredLocales = Object.keys(locales ?? {});

		// This is a multilingual site (more than one locale configured) or a monolingual site with
		// only one locale configured (not a root locale).
		// Monolingual sites with only one non-root locale needs their configuration to be defined in
		// `config.locales` so that slugs can be correctly generated by taking into consideration the
		// base path at which a language is served which is the key of the `config.locales` object.
		if (
			locales !== undefined &&
			(configuredLocales.length > 1 ||
				(configuredLocales.length === 1 && locales.root === undefined))
		) {
			// Make sure we can find the default locale and if not, help the user set it.
			// We treat the root locale as the default if present and no explicit default is set.
			const defaultLocaleConfig = locales[defaultLocale || 'root'];

			if (!defaultLocaleConfig) {
				const availableLocales = configuredLocales.map((l) => `"${l}"`).join(', ');
				ctx.addIssue({
					code: 'custom',
					message:
						'Could not determine the default locale. ' +
						'Please make sure `defaultLocale` in your Starlight config is one of ' +
						availableLocales,
				});
				return z.NEVER;
			}

			// Transform the title
			const TitleSchema = TitleTransformConfigSchema(defaultLocaleConfig.lang as string);
			const parsedTitle = TitleSchema.parse(title);

			return {
				...config,
				title: parsedTitle,
				/** Flag indicating if this site has multiple locales set up. */
				isMultilingual: configuredLocales.length > 1,
				/** Flag indicating if the Starlight built-in default locale is used. */
				isUsingBuiltInDefaultLocale: false,
				/** Full locale object for this site’s default language. */
				defaultLocale: { ...defaultLocaleConfig, locale: defaultLocale },
				locales,
			} as const;
		}

		// This is a monolingual site with no locales configured or only a root locale, so things are
		// pretty simple.
		/** Full locale object for this site’s default language. */
		const defaultLocaleConfig = {
			label: BuiltInDefaultLocale.label,
			lang: BuiltInDefaultLocale.lang,
			dir: BuiltInDefaultLocale.dir,
			locale: undefined,
			...locales?.root,
		};
		/** Transform the title */
		const TitleSchema = TitleTransformConfigSchema(defaultLocaleConfig.lang);
		const parsedTitle = TitleSchema.parse(title);
		return {
			...config,
			title: parsedTitle,
			/** Flag indicating if this site has multiple locales set up. */
			isMultilingual: false,
			/** Flag indicating if the Starlight built-in default locale is used. */
			isUsingBuiltInDefaultLocale: locales?.root === undefined,
			defaultLocale: defaultLocaleConfig,
			locales: undefined,
		} as const;
	});

export type StarlightConfig = z.infer<typeof StarlightConfigSchema>;
export type StarlightUserConfig = z.input<typeof StarlightConfigSchema>;
