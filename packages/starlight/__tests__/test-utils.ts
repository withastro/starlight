import { z } from 'astro/zod';
import project from 'virtual:starlight/project-context';
import { docsSchema, i18nSchema } from '../schema';
import type { StarlightDocsCollectionEntry } from '../utils/routing';
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
		.replace(/\.[^\.]+$/, '')
		.replace(/\s/, '-')
		.replace(/\/index$/, '')
		.toLowerCase();

	const doc: StarlightDocsCollectionEntry = {
		id: project.legacyCollections ? docsFilePath : slug,
		body,
		collection: 'docs',
		data: frontmatterSchema.parse(data),
	};

	if (project.legacyCollections) {
		doc.slug = slug;
	} else {
		doc.filePath = `src/content/docs/${docsFilePath}`;
	}

	return doc;
}

function mockDict(id: string, data: z.input<ReturnType<typeof i18nSchema>>) {
	return {
		id: project.legacyCollections ? id : id.toLocaleLowerCase(),
		data: i18nSchema().parse(data),
		filePath: project.legacyCollections ? undefined : `src/content/i18n/${id}.yml`,
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
			docs: content.defineCollection(
				project.legacyCollections
					? { schema: schemas.docsSchema(docsUserSchema) }
					: { loader: loaders.docsLoader(), schema: schemas.docsSchema(docsUserSchema) }
			),
			i18n: content.defineCollection(
				project.legacyCollections
					? { type: 'data', schema: schemas.i18nSchema() }
					: { loader: loaders.i18nLoader(), schema: schemas.i18nSchema() }
			),
		},
	};
}
