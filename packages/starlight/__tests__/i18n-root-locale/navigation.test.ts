import { describe, expect, test, vi } from 'vitest';
import { getSidebarFromConfig } from '../../src/utils/navigation';
import { SidebarItemSchema } from '../../src/schemas/sidebar';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.md', { title: 'Accueil' }],
			['guide.md', { title: 'Guide', sidebar: { order: 1, label: 'Commencer', badge: 'Nouveau' } }],
			['nested/page.md', { title: 'Nested' }],
			['hidden.md', { title: 'Hidden', sidebar: { hidden: true } }],
			['en/index.md', { title: 'Home' }],
			['en/guide.md', { title: 'English guide' }],
		],
	})
);

describe.each([undefined, 'en', 'ar'])('root autogeneration in %s', (locale) => {
	test.each(['', '/'])('matches the default sidebar for directory "%s"', (directory) => {
		const pathname = locale ? `/${locale}/guide/` : '/guide/';
		const expected = getSidebarFromConfig(undefined, pathname, locale);
		expect(expected).toHaveLength(3);
		expect(
			getSidebarFromConfig(
				[SidebarItemSchema.parse({ autogenerate: { directory } })],
				pathname,
				locale
			)
		).toEqual(expected);
	});
});
