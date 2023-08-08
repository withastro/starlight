import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs', sidebar: { order: 1 } }],
			['guides/authoring-content.md', { title: 'Authoring Markdown' }],
			['guides/components.mdx', { title: 'Components', sidebar: { order: 0 } }],
		],
	})
);

describe('getSidebar', () => {
	test('returns sidebar entries sorted by frontmatter order', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "href": "/guides/components/",
			        "isCurrent": false,
			        "label": "Components",
			        "type": "link",
			      },
			      {
			        "href": "/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "type": "link",
			      },
			    ],
			    "label": "guides",
			    "type": "group",
			  },
			  {
			    "href": "/environmental-impact/",
			    "isCurrent": false,
			    "label": "Eco-friendly docs",
			    "type": "link",
			  },
			  {
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home Page",
			    "type": "link",
			  },
			]
		`);
	});
});
