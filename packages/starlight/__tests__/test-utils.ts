import { z } from 'astro/zod';
import { docsSchema, i18nSchema } from '../schema';
import type { StarlightDocsCollectionEntry } from '../utils/routing/types';
import type { RouteDataContext } from '../utils/routing/data';
import { vi } from 'vitest';

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
