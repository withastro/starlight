import { z } from 'astro/zod';
import { docsSchema, i18nSchema } from '../schema';
import type { StarlightDocsEntry } from '../utils/routing';
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
			]),
		}),
});

function mockDoc(
	id: StarlightDocsEntry['id'],
	data: z.input<typeof frontmatterSchema>,
	body = ''
): StarlightDocsEntry {
	return {
		id,
		slug: id.replace(/\.[^\.]+$/, '').replace(/\/index$/, ''),
		body,
		collection: 'docs',
		data: frontmatterSchema.parse(data),
		render: (() => {}) as StarlightDocsEntry['render'],
	};
}

function mockDict(id: string, data: z.input<ReturnType<typeof i18nSchema>>) {
	return { id, data: i18nSchema().parse(data) };
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
		getCollection: (collection: 'docs' | 'i18n') => (collection === 'i18n' ? mockDicts : mockDocs),
	};
}
