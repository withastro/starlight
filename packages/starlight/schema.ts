import { z } from 'astro/zod';
import { HeadConfigSchema } from './schemas/head';
import { PrevNextLinkConfigSchema } from './schemas/prevNextLink';
import { TableOfContentsSchema } from './schemas/tableOfContents';
import { Icons } from './components/Icons';
import { BadgeConfigSchema } from './schemas/badge';
export { i18nSchema } from './schemas/i18n';

type IconName = keyof typeof Icons;
const iconNames = Object.keys(Icons) as [IconName, ...IconName[]];

type ImageFunction = () => z.ZodObject<{
	src: z.ZodString;
	width: z.ZodNumber;
	height: z.ZodNumber;
	format: z.ZodUnion<
		[
			z.ZodLiteral<'png'>,
			z.ZodLiteral<'jpg'>,
			z.ZodLiteral<'jpeg'>,
			z.ZodLiteral<'tiff'>,
			z.ZodLiteral<'webp'>,
			z.ZodLiteral<'gif'>,
			z.ZodLiteral<'svg'>,
		]
	>;
}>;

export function docsSchema() {
	return ({ image }: { image: ImageFunction }) =>
		z.object({
			/** The title of the current page. Required. */
			title: z.string(),

			/**
			 * A short description of the current page’s content. Optional, but recommended.
			 * A good description is 150–160 characters long and outlines the key content
			 * of the page in a clear and engaging way.
			 */
			description: z.string().optional(),

			/**
			 * Custom URL where a reader can edit this page.
			 * Overrides the `editLink.baseUrl` global config if set.
			 *
			 * Can also be set to `false` to disable showing an edit link on this page.
			 */
			editUrl: z.union([z.string().url(), z.boolean()]).optional().default(true),

			/** Set custom `<head>` tags just for this page. */
			head: HeadConfigSchema(),

			/** Override global table of contents configuration for this page. */
			tableOfContents: TableOfContentsSchema().optional(),

			/**
			 * Set the layout style for this page.
			 * Can be `'doc'` (the default) or `'splash'` for a wider layout without any sidebars.
			 */
			template: z.enum(['doc', 'splash']).default('doc'),

			/** Display a hero section on this page. */
			hero: z
				.object({
					/**
					 * The large title text to show. If not provided, will default to the top-level `title`.
					 * Can include HTML.
					 */
					title: z.string().optional(),
					/**
					 * A short bit of text about your project.
					 * Will be displayed in a smaller size below the title.
					 */
					tagline: z.string().optional(),
					/** The image to use in the hero. You can provide either a relative `file` path or raw `html`. */
					image: z
						.object({
							/** Alt text for screenreaders and other assistive technologies describing your hero image. */
							alt: z.string().default(''),
							/** Relative path to an image file in your repo, e.g. `../../assets/hero.png`. */
							file: image().optional(),
							/** Raw HTML string instead of an image file. Useful for inline SVGs or more complex hero content. */
							html: z.string().optional(),
						})
						.optional(),
					/** An array of call-to-action links displayed at the bottom of the hero. */
					actions: z
						.object({
							/** Text label displayed in the link. */
							text: z.string(),
							/** Value for the link’s `href` attribute, e.g. `/page` or `https://mysite.com`. */
							link: z.string(),
							/** Button style to use. One of `primary`, `secondary`, or `minimal` (the default). */
							variant: z.enum(['primary', 'secondary', 'minimal']).default('minimal'),
							/**
							 * An optional icon to display alongside the link text.
							 * Can be an inline `<svg>` or the name of one of Starlight’s built-in icons.
							 */
							icon: z
								.union([z.enum(iconNames), z.string().startsWith('<svg')])
								.transform((icon) => {
									const parsedIcon = z.enum(iconNames).safeParse(icon);
									return parsedIcon.success
										? ({ type: 'icon', name: parsedIcon.data } as const)
										: ({ type: 'raw', html: icon } as const);
								})
								.optional(),
						})
						.array()
						.default([]),
				})
				.optional(),

			/**
			 * The last update date of the current page.
			 * Overrides the `lastUpdated` global config or the date generated from the Git history.
			 */
			lastUpdated: z.union([z.date(), z.boolean()]).optional(),

			/**
			 * The previous navigation link configuration.
			 * Overrides the `pagination` global config or the link text and/or URL.
			 */
			prev: PrevNextLinkConfigSchema(),
			/**
			 * The next navigation link configuration.
			 * Overrides the `pagination` global config or the link text and/or URL.
			 */
			next: PrevNextLinkConfigSchema(),

			sidebar: z
				.object({
					/**
					 * The order of this page in the navigation.
					 * Pages are sorted by this value in ascending order. Then by slug.
					 * If not provided, pages will be sorted alphabetically by slug.
					 * If two pages have the same order value, they will be sorted alphabetically by slug.
					 */
					order: z.number().optional(),

					/**
					 * The label for this page in the navigation.
					 * Defaults to the page `title` if not set.
					 */
					label: z.string().optional(),

					/**
					 * Prevents this page from being included in autogenerated sidebar groups.
					 */
					hidden: z.boolean().default(false),
					/**
					 * Adds a badge to the sidebar link.
					 * Can be a string or an object with a variant and text.
					 * Variants include 'note', 'tip', 'caution', 'danger', 'success', and 'default'.
					 * Passing only a string defaults to the 'default' variant which uses the site accent color.
					 */
					badge: BadgeConfigSchema(),
				})
				.default({}),

			/** Display an announcement banner at the top of this page. */
			banner: z
				.object({
					/** The content of the banner. Supports HTML syntax. */
					content: z.string(),
				})
				.optional(),

			/** Pagefind indexing for this page - set to false to disable. */
			pagefind: z.boolean().default(true),
		});
}
