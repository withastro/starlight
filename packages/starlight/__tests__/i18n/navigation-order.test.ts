import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['fr/index.mdx', { title: 'Accueil' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/index.mdx', { title: 'Home page', sidebar: { order: 1 } }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['ar/index.mdx', { title: 'الصفحة الرئيسية' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/guides/authoring-content.md', { title: 'Authoring Markdown' }],
			// @ts-expect-error — Using a slug not present in Starlight docs site
			['en/404.md', { title: 'Not found' }],
		],
	})
);

describe('getSidebar', () => {
	test('returns sidebar entries sorted by frontmatter order', () => {
		expect(getSidebar('/en/', 'en')).toMatchInlineSnapshot(`
			[
			  {
			    "href": "/en/",
			    "isCurrent": true,
			    "label": "Home page",
			    "type": "link",
			  },
			  {
			    "href": "/en/404/",
			    "isCurrent": false,
			    "label": "Not found",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "href": "/en/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "type": "link",
			      },
			    ],
			    "label": "guides",
			    "type": "group",
			  },
			]
		`);
	});
});
