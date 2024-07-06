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
			['guides/authoring-content.md', { title: 'Authoring Markdown' }],
			['guides/components.mdx', { title: 'Components' }],
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

	test('pagination links are formatted correctly with no frontmatter', () => {
		const links = getPrevNextLinks(sidebar, true, {});
		expect(links.prev?.href).toMatchInlineSnapshot(`"/guides/components/"`);
		expect(links.next?.href).toMatchInlineSnapshot(`undefined`);
	});

	test('pagination links are formatted correctly with custom links in frontmatter', () => {
		const links = getPrevNextLinks(sidebar, true, {
			prev: { link: '/other-page', label: 'Other Page' },
			next: { link: '/extra-page', label: 'Extra Page' },
		});
		expect(links.prev?.href).toMatchInlineSnapshot(`"/other-page"`);
		expect(links.next?.href).toMatchInlineSnapshot(`"/extra-page"`);
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

	test('pagination links are formatted correctly with no frontmatter', () => {
		const links = getPrevNextLinks(sidebar, true, {});
		expect(links.prev?.href).toMatchInlineSnapshot(`"/test-base/guides/components/"`);
		expect(links.next?.href).toMatchInlineSnapshot(`undefined`);
	});

	test('pagination links are formatted correctly with custom links in frontmatter', () => {
		const links = getPrevNextLinks(sidebar, true, {
			prev: { link: '/other-page', label: 'Other Page' },
			next: { link: '/extra-page', label: 'Extra Page' },
		});
		expect(links.prev?.href).toMatchInlineSnapshot(`"/other-page"`);
		expect(links.next?.href).toMatchInlineSnapshot(`"/extra-page"`);
	});
});
