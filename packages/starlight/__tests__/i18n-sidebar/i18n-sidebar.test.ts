import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Starlight 🌟 Build documentation sites with Astro' }],
			['fr/index.mdx', { title: 'Starlight 🌟 Construire des sites de documentation avec Astro' }],
			['getting-started.mdx', { title: 'Getting Started' }],
			['fr/getting-started.mdx', { title: 'Mise en route' }],
			['manual-setup.mdx', { title: 'Manual Setup' }],
			['fr/manual-setup.mdx', { title: 'Installation manuelle' }],
			['environmental-impact.md', { title: 'Eco-friendly docs' }],
			['fr/environmental-impact.md', { title: 'Documents écologiques' }],
			['guides/pages.mdx', { title: 'Pages' }],
			['fr/guides/pages.mdx', { title: 'Pages' }],
			['guides/authoring-content.mdx', { title: 'Authoring Content in Markdown' }],
			['fr/guides/authoring-content.mdx', { title: 'Création de contenu en Markdown' }],
			['resources/plugins.mdx', { title: 'Plugins and Integrations' }],
			['fr/resources/plugins.mdx', { title: "Modules d'extension et outils" }],
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
	test('returns an array of sidebar entries for a locale', () => {
		expect(getSidebar('/fr', 'fr')).toMatchInlineSnapshot(`
			[
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr",
			    "isCurrent": true,
			    "label": "Starlight 🌟 Construire des sites de documentation avec Astro",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr/getting-started",
			    "isCurrent": false,
			    "label": "Mise en route",
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
			    "label": "Documents écologiques",
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
			        "label": "Création de contenu en Markdown",
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
			    "label": "Modules d'extension et outils",
			    "type": "link",
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
			    "href": "/fr",
			    "isCurrent": false,
			    "label": "Starlight 🌟 Construire des sites de documentation avec Astro",
			    "type": "link",
			  },
			  {
			    "attrs": {},
			    "badge": undefined,
			    "href": "/fr/getting-started",
			    "isCurrent": true,
			    "label": "Mise en route",
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
			    "label": "Documents écologiques",
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
			        "label": "Création de contenu en Markdown",
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
			    "label": "Modules d'extension et outils",
			    "type": "link",
			  },
			]
		`);
	});
	test('uses label from config for internal links', () => {
		const sidebar = getSidebar('/', undefined);
		const entry = sidebar.find((item) => item.type === 'link' && item.href === '/manual-setup');
		expect(entry?.label).toBe('Do it yourself');
	});
	test('uses translation from config for internal links', () => {
		const sidebar = getSidebar('/fr', 'fr');
		const entry = sidebar.find((item) => item.type === 'link' && item.href === '/fr/manual-setup');
		expect(entry?.label).toBe('Fait maison');
	});
	test('uses intermediate sidebars cached by locales', async () => {
		// Reset the modules registry so that re-importing `utils/navigation.ts` re-evaluates the
		// module and clears the cache of intermediate sidebars from previous tests in this file.
		vi.resetModules();
		const navigation = await import('../../utils/navigation');
		const routing = await import('../../utils/routing');

		const getLocaleRoutes = vi.spyOn(routing, 'getLocaleRoutes');

		const paths = ['/', '/environmental-impact/', '/guides/authoring-content/'];

		for (const path of paths) {
			navigation.getSidebar(path, undefined);
			navigation.getSidebar(path, 'fr');
		}

		expect(getLocaleRoutes).toHaveBeenCalledTimes(2);
		expect(getLocaleRoutes).toHaveBeenNthCalledWith(1, undefined);
		expect(getLocaleRoutes).toHaveBeenNthCalledWith(2, 'fr');

		getLocaleRoutes.mockRestore();
	});
});
