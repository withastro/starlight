import { z } from 'astro:content';
import { assert, expect, test, vi } from 'vitest';
import {
	generateStarlightPageRouteData,
	type StarlightPageProps,
} from '../../utils/starlight-page';

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

const starlightPageProps: StarlightPageProps = {
	slug: 'test-slug',
	frontmatter: { title: 'This is a test title' },
};

test('throws a validation error if a built-in field required by the user schema is not passed down', async () => {
	expect.assertions(3);

	try {
		await generateStarlightPageRouteData({
			props: starlightPageProps,
			url: new URL('https://example.com'),
		});
	} catch (error) {
		assert(error instanceof Error);
		const lines = error.message.split('\n');
		// The first line should be a user-friendly error message describing the exact issue and the second line should be
		// the missing description field.
		expect(lines).toHaveLength(2);
		const [message, missingField] = lines;
		expect(message).toMatchInlineSnapshot(
			`"Invalid frontmatter props passed to the \`<StarlightPage/>\` component."`
		);
		expect(missingField).toMatchInlineSnapshot(`"**description**: Required"`);
	}
});

test('returns new field defined in the user schema', async () => {
	const category = 'test category';
	const data = await generateStarlightPageRouteData({
		props: {
			...starlightPageProps,
			frontmatter: {
				...starlightPageProps.frontmatter,
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
