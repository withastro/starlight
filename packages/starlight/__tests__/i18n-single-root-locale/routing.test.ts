import { expect, test, vi } from 'vitest';
import { routes } from '../../utils/routing';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Accueil' }],
			['guides/authoring-content.mdx', { title: 'Authoring content' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/index.mdx', { title: 'Not the home page' }],
		],
	})
);

test('route slugs are normalized', () => {
	const indexRoute = routes.find((route) => route.id.startsWith('index.md'));
	expect(indexRoute?.slug).toBe('');
});

test('routes have locale data added', () => {
	for (const route of routes) {
		expect(route.lang).toBe('fr-CA');
		expect(route.dir).toBe('ltr');
		expect(route.locale).toBeUndefined();
	}
});

test('does not mark any route as fallback routes', () => {
	const fallbacks = routes.filter((route) => route.isFallback);
	expect(fallbacks.length).toBe(0);
});
