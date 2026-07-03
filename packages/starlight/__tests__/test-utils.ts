import { z } from 'astro/zod';
import { docsSchema, i18nSchema } from '../schema';
import type { StarlightDocsCollectionEntry } from '../utils/routing/types';
import type { RouteDataContext } from '../utils/routing/data';
import { vi } from 'vitest';
import type { StarlightUserConfig } from '../types';
import { StarlightConfigSchema } from '../utils/user-config';
import type { MarkdownProcessorPluginOptions } from '../integrations/markdown-processor';
import { createTranslationSystemFromFs } from '../utils/translations-fs';
import { absolutePathToLang } from '../integrations/shared/absolutePathToLang';
import { getCollectionPosixPath } from '../utils/collection-fs';

/** Build the options bag Starlight's plugin factories take. Used by both the remark and Sätteri pipelines. */
export async function createPluginTestOptions(
	starlightUserConfig?: StarlightUserConfig
): Promise<MarkdownProcessorPluginOptions> {
	const starlightConfig = StarlightConfigSchema.parse(
		starlightUserConfig ?? { title: 'Plugin Tests' }
	);

	const astroConfig = {
		root: new URL(import.meta.url),
		srcDir: new URL('./_src/', import.meta.url),
	};

	return {
		starlightConfig,
		astroConfig,
		useTranslations: await createTranslationSystemFromFs(starlightConfig, {
			srcDir: astroConfig.srcDir,
		}),
		absolutePathToLang: (path: string) =>
			absolutePathToLang(path, {
				docsPath: getCollectionPosixPath('docs', astroConfig.srcDir),
				starlightConfig,
			}),
	};
}

/** URL of a Markdown source inside the synthetic docs collection used by plugin tests. */
export function docFileURL(slug = 'index.md'): URL {
	return new URL(`./_src/content/docs/${slug}`, import.meta.url);
}

/** URL of a Markdown source outside the docs collection, for path-filter tests. */
export function nonDocFileURL(slug = 'index.md'): URL {
	return new URL(`./_src/elsewhere/${slug}`, import.meta.url);
}

const frontmatterSchema = docsSchema()({
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

function mockDoc(
	docsFilePath: string,
	data: z.input<typeof frontmatterSchema>,
	body = ''
): StarlightDocsCollectionEntry {
	const slug = docsFilePath
		.replace(/\.[^.]+$/, '')
		.replace(/\s/, '-')
		.replace(/\/index$/, '')
		.toLowerCase();

	return {
		id: slug,
		body,
		collection: 'docs',
		data: frontmatterSchema.parse(data),
		filePath: `src/content/docs/${docsFilePath}`,
	};
}

function mockDict(id: string, data: z.input<ReturnType<typeof i18nSchema>>) {
	return {
		id: id.toLocaleLowerCase(),
		data: i18nSchema().parse(data),
		filePath: `src/content/i18n/${id}.yml`,
	};
}

export async function mockedAstroContent({
	docs = [],
	i18n = [],
}: {
	docs?: Parameters<typeof mockDoc>[];
	i18n?: Parameters<typeof mockDict>[];
}) {
	const mod = await vi.importActual<typeof import('astro:content')>('astro:content');
	const mockDocs = docs.map((doc) => mockDoc(...doc));
	const mockDicts = i18n.map((dict) => mockDict(...dict));
	return {
		...mod,
		getCollection: (
			collection: 'docs' | 'i18n',
			filter?: (entry: ReturnType<typeof mockDoc> | ReturnType<typeof mockDict>) => unknown
		) => {
			const entries = collection === 'i18n' ? mockDicts : mockDocs;
			return filter ? entries.filter(filter) : entries;
		},
	};
}

export async function mockedCollectionConfig(docsUserSchema?: Parameters<typeof docsSchema>[0]) {
	const content = await vi.importActual<typeof import('astro:content')>('astro:content');
	const schemas = await vi.importActual<typeof import('../schema')>('../schema');
	const loaders = await vi.importActual<typeof import('../loaders')>('../loaders');

	return {
		collections: {
			docs: content.defineCollection({
				loader: loaders.docsLoader(),
				schema: schemas.docsSchema(docsUserSchema),
			}),
			i18n: content.defineCollection({
				loader: loaders.i18nLoader(),
				schema: schemas.i18nSchema(),
			}),
		},
	};
}

type RouteDataTestContextOptions = {
	/**
	 * The pathname to get route data context for, e.g. `"/getting-started/"`.
	 * @default "/"
	 */
	pathname?: string;
	/**
	 * Whether or not the context should include a value for `site`. Set to `false` to test without a `site` value.
	 * @default true
	 */
	setSite?: boolean;
};

export function getRouteDataTestContext({
	pathname,
	setSite = true,
}: RouteDataTestContextOptions = {}): RouteDataContext {
	const site = new URL('https://example.com');

	return {
		generator: 'Astro',
		url: pathname ? new URL(pathname, site) : site,
		site: setSite ? site : undefined,
	};
}
