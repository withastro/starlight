import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, test, vi } from 'vitest';
import LanguageSelect from '../../src/components/LanguageSelect.astro';

vi.mock('astro:content', async () =>
	(await import('../test-utils')).mockedAstroContent({
		docs: [
			['index.mdx', { title: 'Accueil' }],
			['en/index.mdx', { title: 'Home page' }],
			['en/guide.md', { title: 'Guide' }],
		],
	})
);

/** Get the value of the single `<option>` marked as selected in the rendered language picker. */
function getSelectedOptionValue(html: string) {
	const options = html.match(/<option\b[^>]*>/g) ?? [];
	const selected = options.filter((option) =>
		/(?:^|\s)selected(?:[=\s]|$)/.test(option.slice(1, -1))
	);
	expect(selected).toHaveLength(1);
	return selected[0]?.match(/value="([^"]*)"/)?.[1];
}

/** Render the language picker as it would be rendered for a page of the passed locale. */
async function renderLanguageSelect(pathname: string, locale: string | undefined) {
	const container = await AstroContainer.create();
	return container.renderToString(
		// Types for `.astro` imports are only available when using `astro check`, so the component is
		// type checked as `error` by the type-aware ESLint rules.
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		LanguageSelect,
		{
			request: new Request(new URL(pathname, 'https://example.com')),
			locals: {
				t: (key: string) => key,
				starlightRoute: { locale },
			} as unknown as App.Locals,
		}
	);
}

describe('LanguageSelect', () => {
	test('marks the root locale as selected on root locale pages', async () => {
		expect(getSelectedOptionValue(await renderLanguageSelect('/', undefined))).toBe('/');
	});

	test('marks the current locale as selected on localized pages', async () => {
		expect(getSelectedOptionValue(await renderLanguageSelect('/en/guide/', 'en'))).toBe(
			'/en/guide/'
		);
	});
});
