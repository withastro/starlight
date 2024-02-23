import { z } from 'astro/zod';
import { type ContentConfig, type SchemaContext } from 'astro:content';
import config from 'virtual:starlight/user-config';
import { errorMap, throwValidationError } from './error-map';
import { stripLeadingAndTrailingSlashes } from './path';
import { getToC, type PageProps, type StarlightRouteData } from './route-data';
import type { StarlightDocsEntry } from './routing';
import { slugToLocaleData, urlToSlug } from './slugs';
import { getPrevNextLinks, getSidebar } from './navigation';
import { useTranslations } from './translations';
import { docsSchema } from '../schema';
import { BadgeConfigSchema } from '../schemas/badge';
import { SidebarLinkItemHTMLAttributesSchema } from '../schemas/sidebar';

/**
 * The frontmatter schema for Starlight pages derived from the default schema for Starlight’s
 * `docs` content collection.
 * The frontmatter schema for Starlight pages cannot include some properties which will be omitted
 * and some others needs to be refined to a stricter type.
 */
const StarlightPageFrontmatterSchema = async (context: SchemaContext) => {
	const userDocsSchema = await getUserDocsSchema();
	const schema = typeof userDocsSchema === 'function' ? userDocsSchema(context) : userDocsSchema;

	return schema.transform((frontmatter) => {
		/**
		 * Starlight pages can only be edited if an edit URL is explicitly provided.
		 * The `sidebar` frontmatter prop only works for pages in an autogenerated links group.
		 * Starlight pages edit links cannot be autogenerated.
		 *
		 * These changes to the schema are done using a transformer and not using the usual `omit`
		 * method because when the frontmatter schema is extended by the user, an intersection between
		 * the default schema and the user schema is created using the `and` method. Intersections in
		 * Zod returns a `ZodIntersection` object which does not have some methods like `omit` or
		 * `pick`.
		 *
		 * This transformer only sets the `editUrl` default value and removes the `sidebar` property
		 * from the validated output but does not appply any changes to the input schema type itself so
		 * this needs to be done manually.
		 *
		 * @see StarlightPageFrontmatter
		 * @see https://github.com/colinhacks/zod#intersections
		 */
		const { editUrl, sidebar, ...others } = frontmatter;
		const pageEditUrl = editUrl === undefined || editUrl === true ? false : editUrl;
		return { ...others, editUrl: pageEditUrl };
	});
};

/**
 * Type of Starlight pages frontmatter schema.
 * We manually refines the `editUrl` type and omit the `sidebar` property as it's not possible to
 * do that on the schema itself using Zod but the proper validation is still using a transformer.
 * @see StarlightPageFrontmatterSchema
 */
type StarlightPageFrontmatter = Omit<
	z.input<Awaited<ReturnType<typeof StarlightPageFrontmatterSchema>>>,
	'editUrl' | 'sidebar'
> & { editUrl?: string | false };

/**
 * Link configuration schema for `<StarlightPage>`.
 * Sets default values where possible to be more user friendly than raw `SidebarEntry` type.
 */
const LinkSchema = z
	.object({
		/** @deprecated Specifying `type` is no longer required. */
		type: z.literal('link').default('link'),
		label: z.string(),
		href: z.string(),
		isCurrent: z.boolean().default(false),
		badge: BadgeConfigSchema(),
		attrs: SidebarLinkItemHTMLAttributesSchema(),
	})
	// Make sure badge is in the object even if undefined — Zod doesn’t seem to have a way to set `undefined` as a default.
	.transform((item) => ({ badge: undefined, ...item }));

/** Base schema for link groups without the recursive `items` array. */
const LinkGroupBase = z.object({
	/** @deprecated Specifying `type` is no longer required. */
	type: z.literal('group').default('group'),
	label: z.string(),
	collapsed: z.boolean().default(false),
	badge: BadgeConfigSchema(),
});

//  These manual types are needed to correctly type the recursive link group type.
type ManualLinkGroupInput = Prettify<
	z.input<typeof LinkGroupBase> &
		// The original implementation of `<StarlightPage>` in v0.19.0 used `entries`.
		// We want to use `items` so it matches the sidebar config in `astro.config.mjs`.
		// Keeping `entries` support for now to not break anyone.
		// TODO: warn about `entries` usage in a future version
		// TODO: remove support for `entries` in a future version
		(| {
					/** Array of links and subcategories to display in this category. */
					items: Array<z.input<typeof LinkSchema> | ManualLinkGroupInput>;
			  }
			| {
					/**
					 * @deprecated Use `items` instead of `entries`.
					 * Support for `entries` will be removed in a future version of Starlight.
					 */
					entries: Array<z.input<typeof LinkSchema> | ManualLinkGroupInput>;
			  }
		)
>;
type ManualLinkGroupOutput = z.output<typeof LinkGroupBase> & {
	entries: Array<z.output<typeof LinkSchema> | ManualLinkGroupOutput>;
	badge: z.output<typeof LinkGroupBase>['badge'];
};
type LinkGroupSchemaType = z.ZodType<ManualLinkGroupOutput, z.ZodTypeDef, ManualLinkGroupInput>;
/**
 * Link group configuration schema for `<StarlightPage>`.
 * Sets default values where possible to be more user friendly than raw `SidebarEntry` type.
 */
const LinkGroupSchema: LinkGroupSchemaType = z.preprocess(
	// Map `items` to `entries` as expected by the `SidebarEntry` type.
	(arg) => {
		if (arg && typeof arg === 'object' && 'items' in arg) {
			const { items, ...rest } = arg;
			return { ...rest, entries: items };
		}
		return arg;
	},
	LinkGroupBase.extend({
		entries: z.lazy(() => z.union([LinkSchema, LinkGroupSchema]).array()),
	})
		// Make sure badge is in the object even if undefined.
		.transform((item) => ({ badge: undefined, ...item }))
) as LinkGroupSchemaType;

/** Sidebar configuration schema for `<StarlightPage>` */
const StarlightPageSidebarSchema = z.union([LinkSchema, LinkGroupSchema]).array();
type StarlightPageSidebarUserConfig = z.input<typeof StarlightPageSidebarSchema>;

/** Parse sidebar prop to ensure all required defaults are in place. */
const normalizeSidebarProp = (
	sidebarProp: StarlightPageSidebarUserConfig
): StarlightRouteData['sidebar'] => {
	const sidebar = StarlightPageSidebarSchema.safeParse(sidebarProp, { errorMap });
	if (!sidebar.success) {
		throwValidationError(
			sidebar.error,
			'Invalid sidebar prop passed to the `<StarlightPage/>` component.'
		);
	}
	return sidebar.data;
};

/**
 * The props accepted by the `<StarlightPage/>` component.
 */
export type StarlightPageProps = Prettify<
	// Remove the index signature from `Route`, omit undesired properties and make the rest optional.
	Partial<Omit<RemoveIndexSignature<PageProps>, 'entry' | 'entryMeta' | 'id' | 'locale' | 'slug'>> &
		// Add the sidebar definitions for a Starlight page.
		Partial<Pick<StarlightRouteData, 'hasSidebar'>> & {
			sidebar?: StarlightPageSidebarUserConfig;
			// And finally add the Starlight page frontmatter properties in a `frontmatter` property.
			frontmatter: StarlightPageFrontmatter;
		}
>;

/**
 * A docs entry used for Starlight pages meant to be rendered by plugins and which is safe to cast
 * to a `StarlightDocsEntry`.
 * A Starlight page docs entry cannot be rendered like a content collection entry.
 */
type StarlightPageDocsEntry = Omit<StarlightDocsEntry, 'id' | 'render'> & {
	/**
	 * The unique ID for this Starlight page which cannot be inferred from codegen like content
	 * collection entries.
	 */
	id: string;
};

export async function generateStarlightPageRouteData({
	props,
	url,
}: {
	props: StarlightPageProps;
	url: URL;
}): Promise<StarlightRouteData> {
	const { isFallback, frontmatter, ...routeProps } = props;
	const slug = urlToSlug(url);
	const pageFrontmatter = await getStarlightPageFrontmatter(frontmatter);
	const id = `${stripLeadingAndTrailingSlashes(slug)}.md`;
	const localeData = slugToLocaleData(slug);
	const sidebar = props.sidebar
		? normalizeSidebarProp(props.sidebar)
		: getSidebar(url.pathname, localeData.locale);
	const headings = props.headings ?? [];
	const pageDocsEntry: StarlightPageDocsEntry = {
		id,
		slug,
		body: '',
		collection: 'docs',
		data: {
			...pageFrontmatter,
			sidebar: {
				attrs: {},
				hidden: false,
			},
		},
	};
	const entry = pageDocsEntry as StarlightDocsEntry;
	const entryMeta: StarlightRouteData['entryMeta'] = {
		dir: props.dir ?? localeData.dir,
		lang: props.lang ?? localeData.lang,
		locale: localeData.locale,
	};
	const editUrl = pageFrontmatter.editUrl ? new URL(pageFrontmatter.editUrl) : undefined;
	const lastUpdated =
		pageFrontmatter.lastUpdated instanceof Date ? pageFrontmatter.lastUpdated : undefined;
	const routeData: StarlightRouteData = {
		...routeProps,
		...localeData,
		id,
		editUrl,
		entry,
		entryMeta,
		hasSidebar: props.hasSidebar ?? entry.data.template !== 'splash',
		headings,
		labels: useTranslations(localeData.locale).all(),
		lastUpdated,
		pagination: getPrevNextLinks(sidebar, config.pagination, entry.data),
		sidebar,
		slug,
		toc: getToC({
			...routeProps,
			...localeData,
			entry,
			entryMeta,
			headings,
			id,
			locale: localeData.locale,
			slug,
		}),
	};
	if (isFallback) {
		routeData.isFallback = true;
	}
	return routeData;
}

/** Validates the Starlight page frontmatter properties from the props received by a Starlight page. */
async function getStarlightPageFrontmatter(frontmatter: StarlightPageFrontmatter) {
	// This needs to be in sync with ImageMetadata.
	// https://github.com/withastro/astro/blob/cf993bc263b58502096f00d383266cd179f331af/packages/astro/src/assets/types.ts#L32
	const schema = await StarlightPageFrontmatterSchema({
		image: () =>
			z.object({
				src: z.string(),
				width: z.number(),
				height: z.number(),
				format: z.union([
					z.literal('png'),
					z.literal('jpg'),
					z.literal('jpeg'),
					z.literal('tiff'),
					z.literal('webp'),
					z.literal('gif'),
					z.literal('svg'),
					z.literal('avif'),
				]),
			}),
	});

	const pageFrontmatter = schema.safeParse(frontmatter, { errorMap });

	if (!pageFrontmatter.success) {
		throwValidationError(
			pageFrontmatter.error,
			'Invalid frontmatter props passed to the `<StarlightPage/>` component.'
		);
	}

	return pageFrontmatter.data;
}

/** Returns the user docs schema and falls back to the default schema if needed. */
async function getUserDocsSchema(): Promise<
	NonNullable<ContentConfig['collections']['docs']['schema']>
> {
	const userCollections = (await import('virtual:starlight/collection-config')).collections;
	return userCollections?.docs.schema ?? docsSchema();
}

// https://stackoverflow.com/a/66252656/1945960
type RemoveIndexSignature<T> = {
	[K in keyof T as string extends K
		? never
		: number extends K
		? never
		: symbol extends K
		? never
		: K]: T[K];
};

// https://www.totaltypescript.com/concepts/the-prettify-helper
type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
