import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Starlight 🌟 Build documentation sites with Astro' }],
			['getting-started.mdx', { title: 'Getting Started' }],
			['manual-setup.mdx', { title: 'Manual Setup' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['guides/pages.mdx', { title: 'Pages' }],
			['guides/authoring-content.mdx', { title: 'Authoring Content in Markdown' }],
			['resources/plugins.mdx', { title: 'Plugins and Integrations' }],
		],
	})
);

describe('getSidebar', () => {
	test('returns an array of sidebar entries', () => {
		expect(getSidebar('/', undefined)).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/",
			    "isCurrent": true,
			    "label": "Starlight 🌟 Build documentation sites with Astro",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/getting-started",
			    "isCurrent": false,
			    "label": "Getting Started",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": {
			      "text": "New",
			      "variant": "default",
			    },
			    "href": "/manual-setup",
			    "isCurrent": false,
			    "label": "Do it yourself",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": {
			      "text": "Eco-friendly",
			      "variant": "success",
			    },
			    "href": "/environmental-impact",
			    "isCurrent": false,
			    "label": "Eco-friendly docs",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/guides/pages",
			        "isCurrent": false,
			        "label": "Pages",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": {
			          "text": "Deprecated",
			          "variant": "default",
			        },
			        "href": "/guides/authoring-content",
			        "isCurrent": false,
			        "label": "Authoring Content in Markdown",
			        "type": "link",
			      },
			    ],
			    "label": "Guides",
			    "type": "group",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/resources/plugins",
			    "isCurrent": false,
			    "label": "Plugins and Integrations",
			    "type": "link",
			  },
			]
		`);
	});
	test('uses fallback labels from the default locale', () => {
		expect(getSidebar('/fr', 'fr')).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr",
			    "isCurrent": true,
			    "label": "Starlight 🌟 Build documentation sites with Astro",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr/getting-started",
			    "isCurrent": false,
			    "label": "Getting Started",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": {
			      "text": "Nouveau",
			      "variant": "default",
			    },
			    "href": "/fr/manual-setup",
			    "isCurrent": false,
			    "label": "Fait maison",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": {
			      "text": "Écologique",
			      "variant": "success",
			    },
			    "href": "/fr/environmental-impact",
			    "isCurrent": false,
			    "label": "Eco-friendly docs",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/fr/guides/pages",
			        "isCurrent": false,
			        "label": "Pages",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": {
			          "text": "Deprecated",
			          "variant": "default",
			        },
			        "href": "/fr/guides/authoring-content",
			        "isCurrent": false,
			        "label": "Authoring Content in Markdown",
			        "type": "link",
			      },
			    ],
			    "label": "Guides",
			    "type": "group",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr/resources/plugins",
			    "isCurrent": false,
			    "label": "Plugins and Integrations",
			    "type": "link",
			  },
			]
		`);
	});
});
