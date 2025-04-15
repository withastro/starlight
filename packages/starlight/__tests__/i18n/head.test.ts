import { expect, test, vi } from 'vitest';
import config from 'virtual:starlight/user-config';
import { getRouteDataTestContext } from '../test-utils';
import { generateRouteData } from '../../utils/routing/data';
import { routes } from '../../utils/routing';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [['index.mdx', { title: 'Home Page' }]],
	})
);

test('includes links to language alternates', () => {
	const route = routes[0]!;
	const { head } = generateRouteData({
		props: { ...route, headings: [] },
		context: getRouteDataTestContext(),
	});
	for (const [locale, localeConfig] of Object.entries(config.locales!)) {
		expect(head).toContainEqual({
			tag: 'link',
			attrs: {
				rel: 'alternate',
				href: `https://example.com/${locale}/`,
				hreflang: localeConfig?.lang,
			},
			content: '',
		});
	}
});
