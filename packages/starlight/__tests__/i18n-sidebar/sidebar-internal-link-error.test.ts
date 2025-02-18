import { describe, expect, test, vi } from 'vitest';
import { getSidebar } from '../../utils/navigation';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Starlight 🌟 Build documentation sites with Astro' }],
			['fr/index.mdx', { title: 'Starlight 🌟 Construire des sites de documentation avec Astro' }],
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
	test('throws an error if slug doesn’t match a content collection entry', () => {
		expect(() => getSidebar('/', undefined)).toThrowErrorMatchingInlineSnapshot(`
			"[AstroUserError]:
				The slug \`"getting-started"\` specified in the Starlight sidebar config does not exist.
			Hint:
				Update the Starlight config to reference a valid entry slug in the docs content collection.
				Learn more about Astro content collection slugs at https://docs.astro.build/en/reference/modules/astro-content/#getentry"
		`);
	});
});
