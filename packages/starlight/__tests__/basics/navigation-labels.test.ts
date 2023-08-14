import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			[
				'environmental-impact.md',
				{ title: 'Eco-friendly docs', sidebar: { label: 'Environmental impact' } },
			],
			['guides/authoring-content.md', { title: 'Authoring Markdown' }],
			['guides/components.mdx', { title: 'Using components', sidebar: { label: 'Components' } }],
		],
	})
);

describe('getSidebar', () => {
	test('returns sidebar entries sorted by frontmatter order', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home Page",
			    "target": "_self",
			    "type": "link",
			  },
			  {
			    "href": "/environmental-impact/",
			    "isCurrent": false,
			    "label": "Environmental impact",
			    "target": "_self",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "href": "/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "target": "_self",
			        "type": "link",
			      },
			      {
			        "href": "/guides/components/",
			        "isCurrent": false,
			        "label": "Components",
			        "target": "_self",
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
