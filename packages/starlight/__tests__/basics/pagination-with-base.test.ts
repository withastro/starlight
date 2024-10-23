import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import type {
	getPrevNextLinks as getPrevNextLinksType,
	getSidebar as getSidebarType,
} from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['guides/authoring-content.mdx', { title: 'Authoring Markdown' }],
			['guides/project-structure.mdx', { title: 'Project Structure' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
		],
	})
);

describe('without base', async () => {
	let getPrevNextLinks: typeof getPrevNextLinksType;
	let getSidebar: typeof getSidebarType;
	let sidebar: ReturnType<typeof getSidebar>;

	beforeAll(async () => {
		({ getPrevNextLinks, getSidebar } = await import('../../utils/navigation'));
		sidebar = getSidebar('/reference/frontmatter/', undefined);
	});

	test('pagination links are inferred correctly with no frontmatter', () => {
		const links = getPrevNextLinks(sidebar, true, {});
		expect(links.prev?.href).toBe('/guides/project-structure/');
		expect(links.next?.href).toBeUndefined();
	});

	test('pagination links are used as authored with custom links in frontmatter', () => {
		const prevLink = '/other-page';
		const nextLink = '/extra-page';
		const links = getPrevNextLinks(sidebar, true, {
			prev: { link: prevLink, label: 'Other Page' },
			next: { link: nextLink, label: 'Extra Page' },
		});
		expect(links.prev?.href).toBe(prevLink);
		expect(links.next?.href).toBe(nextLink);
	});
});

describe('with base', () => {
	let getPrevNextLinks: typeof getPrevNextLinksType;
	let getSidebar: typeof getSidebarType;
	let sidebar: ReturnType<typeof getSidebar>;

	beforeAll(async () => {
		vi.resetModules();
		vi.stubEnv('BASE_URL', '/test-base/');
		({ getPrevNextLinks, getSidebar } = await import('../../utils/navigation'));
		sidebar = getSidebar('/test-base/reference/frontmatter/', undefined);
	});

	afterAll(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	test('pagination links are inferred correctly with no frontmatter', () => {
		const links = getPrevNextLinks(sidebar, true, {});
		expect(links.prev?.href).toBe('/test-base/guides/project-structure/');
		expect(links.next?.href).toBeUndefined();
	});

	test('pagination links are used as authored with custom links in frontmatter', () => {
		const prevLink = '/other-page';
		const nextLink = '/extra-page';
		const links = getPrevNextLinks(sidebar, true, {
			prev: { link: prevLink, label: 'Other Page' },
			next: { link: nextLink, label: 'Extra Page' },
		});
		expect(links.prev?.href).toBe(prevLink);
		expect(links.next?.href).toBe(nextLink);
	});
});
