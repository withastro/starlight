import { expect, test, vi } from 'vitest';
import { getRouteDataTestContext } from '../test-utils';
import { generateRouteData } from '../../src/utils/routing/data';
import { routes } from '../../src/utils/routing';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['getting-started.mdx', { title: 'Getting Started' }],
			[
				'showcase.mdx',
				{ title: 'Custom edit link', editUrl: 'https://example.com/custom-edit?link' },
			],
		],
	})
);

test('synthesizes edit URL using file location and `editLink.baseUrl`', () => {
	{
		const route = routes[0]!;
		const data = generateRouteData({
			props: { ...route, headings: [] },
			context: getRouteDataTestContext(),
		});
		expect(data.editUrl?.href).toBe(
			'https://github.com/withastro/starlight/edit/main/docs/src/content/docs/index.mdx'
		);
	}
	{
		const route = routes[1]!;
		const data = generateRouteData({
			props: { ...route, headings: [] },
			context: getRouteDataTestContext(),
		});
		expect(data.editUrl?.href).toBe(
			'https://github.com/withastro/starlight/edit/main/docs/src/content/docs/getting-started.mdx'
		);
	}
});

test('uses frontmatter `editUrl` if defined', () => {
	const route = routes[2]!;
	const data = generateRouteData({
		props: { ...route, headings: [] },
		context: getRouteDataTestContext(),
	});
	expect(data.editUrl?.href).toBe('https://example.com/custom-edit?link');
});
