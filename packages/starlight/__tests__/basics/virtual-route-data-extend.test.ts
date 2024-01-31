import { z } from 'astro:content';
import { assert, expect, test, vi } from 'vitest';
import { generateVirtualRouteData, type VirtualPageProps } from '../../utils/virtual-page';

vi.mock('virtual:starlight/collection-config', async () => {
	const { z } = await vi.importActual<typeof import('astro:content')>('astro:content');
	return (await import('../test-utils')).mockedCollectionConfig({
		extend: z.object({
			// Make the built-in description field required.
			description: z.string(),
			// Add a new optional field.
			category: z.string().optional(),
		}),
	});
});

const virtualPageProps: VirtualPageProps = {
	slug: 'test-slug',
	frontmatter: { title: 'This is a test title' },
};

test('throws a validation error if a built-in field required by the user schema is not passed down', () => {
	expect.assertions(3);

	try {
		generateVirtualRouteData({
			props: virtualPageProps,
			url: new URL('https://example.com'),
		});
	} catch (error) {
		assert(error instanceof z.ZodError);
		expect(error.errors).toHaveLength(1);
		expect(error.errors.at(0)?.path).toEqual(['description']);
		expect(error.errors.at(0)?.code).toBe('invalid_type');
	}
});

test('returns new field defined in the user schema', () => {
	const category = 'test category';
	const data = generateVirtualRouteData({
		props: {
			...virtualPageProps,
			frontmatter: {
				...virtualPageProps.frontmatter,
				description: 'test description',
				// @ts-expect-error - Custom field defined in the user schema.
				category,
			},
		},
		url: new URL('https://example.com'),
	});
	// @ts-expect-error - Custom field defined in the user schema.
	expect(data.entry.data.category).toBe(category);
});
