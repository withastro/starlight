import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Home Page' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['reference/configuration.md', { title: 'Config Reference' }],
			['reference/frontmatter.md', { title: 'Frontmatter Reference' }],
			['guides/components.mdx', { title: 'Components' }],
		],
	})
);

describe('getSidebar', () => {
	test('returns an array of sidebar entries', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "attributes": undefined,
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": true,
			    "label": "Home",
			    "type": "link",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "attributes": undefined,
			        "badge": {
			          "text": "New",
			          "variant": "success",
			        },
			        "href": "/intro/",
			        "isCurrent": false,
			        "label": "Introduction",
			        "type": "link",
			      },
			      {
			        "attributes": undefined,
			        "badge": {
			          "text": "Deprecated",
			          "variant": "default",
			        },
			        "href": "/next-steps/",
			        "isCurrent": false,
			        "label": "Next Steps",
			        "type": "link",
			      },
			      {
			        "attributes": {
			          "class": "showcase-link",
			          "target": "_blank",
			        },
			        "badge": undefined,
			        "href": "/showcase/",
			        "isCurrent": false,
			        "label": "Showcase",
			        "type": "link",
			      },
			    ],
			    "label": "Start Here",
			    "type": "group",
			  },
			  {
			    "collapsed": false,
			    "entries": [
			      {
			        "attributes": undefined,
			        "badge": undefined,
			        "href": "/reference/configuration/",
			        "isCurrent": false,
			        "label": "Config Reference",
			        "type": "link",
			      },
			      {
			        "attributes": undefined,
			        "badge": undefined,
			        "href": "/reference/frontmatter/",
			        "isCurrent": false,
			        "label": "Frontmatter Reference",
			        "type": "link",
			      },
			    ],
			    "label": "Reference",
			    "type": "group",
			  },
			]
		`);
	});
});
