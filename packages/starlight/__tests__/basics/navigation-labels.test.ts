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
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home Page",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "href": "/environmental-impact/",
			    "isCurrent": false,
			    "label": "Environmental impact",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "badge": undefined,
			        "href": "/guides/authoring-content/",
			        "isCurrent": false,
			        "label": "Authoring Markdown",
			        "type": "link",
			      },
			      {
			        "badge": undefined,
			        "href": "/guides/components/",
			        "isCurrent": false,
			        "label": "Components",
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
