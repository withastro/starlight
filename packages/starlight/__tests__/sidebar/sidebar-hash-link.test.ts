import { describe, expect, test, vi } from 'vitest';
import { getPrevNextLinks, getSidebarFromConfig } from '../../src/utils/navigation';
import { StarlightConfigSchema } from '../../src/utils/user-config';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['reference/configuration.mdx', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
		],
	})
);

const sidebar = StarlightConfigSchema.parse({
	title: 'Sidebar hash link',
	sidebar: [
		{ label: 'Config', link: '/reference/configuration/#tabs' },
		{ label: 'Frontmatter', link: '/reference/frontmatter' },
	],
}).sidebar!;

describe('manual sidebar links with a hash', () => {
	test('are marked as the current page', () => {
		const entries = getSidebarFromConfig(sidebar, '/reference/configuration/', undefined);
		const configLink = entries.find((entry) => entry.label === 'Config');
		expect(configLink).toMatchObject({ type: 'link', isCurrent: true });
	});

	test('keep prev/next pagination links', () => {
		const entries = getSidebarFromConfig(sidebar, '/reference/configuration/', undefined);
		const pagination = getPrevNextLinks(entries, true, {});
		expect(pagination.next?.href).toBe('/reference/frontmatter');
	});

	test('also match links with a query string', () => {
		const querySidebar = StarlightConfigSchema.parse({
			title: 'Sidebar query link',
			sidebar: [
				{ label: 'Config', link: '/reference/configuration/?tab=options' },
				{ label: 'Frontmatter', link: '/reference/frontmatter' },
			],
		}).sidebar!;
		const entries = getSidebarFromConfig(querySidebar, '/reference/configuration/', undefined);
		const configLink = entries.find((entry) => entry.label === 'Config');
		expect(configLink).toMatchObject({ type: 'link', isCurrent: true });
		const pagination = getPrevNextLinks(entries, true, {});
		expect(pagination.next?.href).toBe('/reference/frontmatter');
	});
});
