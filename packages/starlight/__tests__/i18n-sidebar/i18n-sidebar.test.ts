import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['getting-started.mdx', { title: 'Getting Started' }],
			['fr/getting-started.mdx', { title: 'Mise en route' }],
			['guides/authoring-content.md', { title: 'Authoring Content in Markdown' }],
			['guides/components.mdx', { title: 'Components' }],
			['fr/guides/authoring-content.md', { title: 'Création de contenu en Markdown' }],
			['fr/guides/components.mdx', { title: 'Composants' }],
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
			    "href": "/getting-started",
			    "isCurrent": false,
			    "label": "Getting Started",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/guides/authoring-content",
			        "isCurrent": false,
			        "label": "Authoring Content in Markdown",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/guides/components",
			        "isCurrent": false,
			        "label": "Components",
			        "type": "link",
			      },
			    ],
			    "label": "Group",
			    "type": "group",
			  },
			]
		`);
	});
	test('returns an array of sidebar entries for a locale', () => {
		expect(getSidebar('/fr', 'fr')).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr/getting-started",
			    "isCurrent": false,
			    "label": "Mise en route",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/fr/guides/authoring-content",
			        "isCurrent": false,
			        "label": "Création de contenu en Markdown",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/fr/guides/components",
			        "isCurrent": false,
			        "label": "Composants",
			        "type": "link",
			      },
			    ],
			    "label": "Group",
			    "type": "group",
			  },
			]
		`);
	});
	test('returns an array of sidebar entries for a locale on current page', () => {
		expect(getSidebar('/fr/getting-started', 'fr')).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr/getting-started",
			    "isCurrent": true,
			    "label": "Mise en route",
			    "type": "link",
			  },
			  {
			    "badge": undefined,
			    "collapsed": false,
			    "entries": [
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/fr/guides/authoring-content",
			        "isCurrent": false,
			        "label": "Création de contenu en Markdown",
			        "type": "link",
			      },
			      {
			        "attrs": {},
			        "badge": undefined,
			        "href": "/fr/guides/components",
			        "isCurrent": false,
			        "label": "Composants",
			        "type": "link",
			      },
			    ],
			    "label": "Group",
			    "type": "group",
			  },
			]
		`);
	});
});
