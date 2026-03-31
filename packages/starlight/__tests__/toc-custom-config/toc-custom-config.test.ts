import { describe, expect, test, vi } from 'vitest';
import { routes } from '../../utils/routing';
import { getRouteDataTestContext } from '../test-utils';
import { generateRouteData } from '../../utils/routing/data';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['showcase.mdx', { title: 'ToC Disabled', tableOfContents: false }],
			[
				'environmental-impact.md',
				{ title: 'Explicit update date', tableOfContents: { minHeadingLevel: 2 } },
			],
		],
	})
);

const headings = [
	{ depth: 1, slug: 'heading-1', text: 'Heading 1' },
	{ depth: 2, slug: 'heading-2', text: 'Heading 2' },
	{ depth: 3, slug: 'heading-3', text: 'Heading 3' },
	{ depth: 4, slug: 'heading-4', text: 'Heading 4' },
];

describe('custom table of contents config', () => {
	test('table of contents heading levels match configuration', () => {
		const route = routes[0]!;
		const data = generateRouteData({
			props: { ...route, headings },
			context: getRouteDataTestContext(),
		});
		expect(data.toc?.minHeadingLevel).toBe(1);
		expect(data.toc?.maxHeadingLevel).toBe(4);
	});

	test('table of contents can be disabled by frontmatter', () => {
		const route = routes[1]!;
		const data = generateRouteData({
			props: { ...route, headings },
			context: getRouteDataTestContext(),
		});
		expect(data.toc).toBeUndefined();
	});

	test('table of contents heading levels can be customised by frontmatter', () => {
		const route = routes[2]!;
		const data = generateRouteData({
			props: { ...route, headings },
			context: getRouteDataTestContext(),
		});
		expect(data.toc?.minHeadingLevel).toBe(2);
		expect(data.toc?.maxHeadingLevel).toBe(3);
	});
});
