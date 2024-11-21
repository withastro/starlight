import { expect, test, vi } from 'vitest';
import { routes } from '../../utils/routing';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['fr/index.mdx', { title: 'Accueil' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/index.mdx', { title: 'Home page' }],
			['404.md', { title: '404' }],
		],
	})
);

test('route slugs are normalized', () => {
	const indexRoute = routes.find((route) => route.id.startsWith('fr/index.md'));
	expect(indexRoute?.slug).toBe('fr');
});

test('routes for the configured locale have locale data added', () => {
	expect(routes[0]?.lang).toBe('fr-CA');
	expect(routes[0]?.dir).toBe('ltr');
	expect(routes[0]?.locale).toBe('fr');
});

test('routes not matching the configured locale fall back to the default locale', () => {
	for (const route of routes.slice(1)) {
		expect(route.lang).toBe('fr-CA');
		expect(route.dir).toBe('ltr');
		expect(route.locale).toBe('fr');
	}
});

test('does not mark any route as fallback routes', () => {
	const fallbacks = routes.filter((route) => route.isFallback);
	expect(fallbacks.length).toBe(0);
});
