import { createMarkdownProcessor, type MarkdownProcessor } from '@astrojs/markdown-remark';
import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { describe, expect, test } from 'vitest';
import { starlightAsides, remarkDirectivesRestoration } from '../../integrations/asides';
import { createTranslationSystemFromFs } from '../../utils/translations-fs';
import { StarlightConfigSchema, type StarlightUserConfig } from '../../utils/user-config';
import { BuiltInDefaultLocale } from '../../utils/i18n';
import { absolutePathToLang as getAbsolutePathFromLang } from '../../integrations/shared/absolutePathToLang';

const starlightConfig = StarlightConfigSchema.parse({
	title: 'Asides Tests',
	locales: { en: { label: 'English' }, fr: { label: 'French' } },
	defaultLocale: 'en',
} satisfies StarlightUserConfig);

const astroConfig = {
	root: new URL(import.meta.url),
	srcDir: new URL('./_src/', import.meta.url),
};

const useTranslations = createTranslationSystemFromFs(
	starlightConfig,
	// Using non-existent `_src/` to ignore custom files in this test fixture.
	{ srcDir: new URL('./_src/', import.meta.url) }
);

function absolutePathToLang(path: string) {
	return getAbsolutePathFromLang(path, { astroConfig, starlightConfig });
}

const processor = await createMarkdownProcessor({
	remarkPlugins: [
		...starlightAsides({
			starlightConfig,
			astroConfig,
			useTranslations,
			absolutePathToLang,
		}),
		// The restoration plugin is run after the asides and any other plugin that may have been
		// injected by Starlight plugins.
		remarkDirectivesRestoration,
	],
});

function renderMarkdown(
	content: string,
	options: { fileURL?: URL; processor?: MarkdownProcessor } = {}
) {
	return (options.processor ?? processor).render(
		content,
		// @ts-expect-error fileURL is part of MarkdownProcessor's options
		{ fileURL: options.fileURL ?? new URL(`./_src/content/docs/index.md`, import.meta.url) }
	);
}

test('generates aside', async () => {
	const res = await renderMarkdown(`
:::note
Some text
:::
`);
	await expect(res.code).toMatchFileSnapshot('./snapshots/generates-aside.html');
});

describe('default labels', () => {
	test.each([
		['note', 'Note'],
		['tip', 'Tip'],
		['caution', 'Caution'],
		['danger', 'Danger'],
	])('%s has label %s', async (type, label) => {
		const res = await renderMarkdown(`
:::${type}
Some text
:::
`);
		expect(res.code).includes(`aria-label="${label}"`);
		expect(res.code).includes(`</svg>${label}</p>`);
	});
});

describe('custom labels', () => {
	test.each(['note', 'tip', 'caution', 'danger'])('%s with custom label', async (type) => {
		const label = 'Custom Label';
		const res = await renderMarkdown(`
:::${type}[${label}]
Some text
:::
  `);
		expect(res.code).includes(`aria-label="${label}"`);
		expect(res.code).includes(`</svg>${label}</p>`);
	});
});

describe('custom labels with nested markdown', () => {
	test.each(['note', 'tip', 'caution', 'danger'])('%s with custom code label', async (type) => {
		const label = 'Custom `code` Label';
		const labelWithoutMarkdown = 'Custom code Label';
		const labelHtml = 'Custom <code>code</code> Label';
		const res = await renderMarkdown(`
:::${type}[${label}]
Some text
:::
  `);
		expect(res.code).includes(`aria-label="${labelWithoutMarkdown}"`);
		expect(res.code).includes(`</svg>${labelHtml}</p>`);
	});
});

describe('custom labels with doubly-nested markdown', () => {
	test.each(['note', 'tip', 'caution', 'danger'])(
		'%s with custom doubly-nested label',
		async (type) => {
			const label = 'Custom **strong with _emphasis_** Label';
			const labelWithoutMarkdown = 'Custom strong with emphasis Label';
			const labelHtml = 'Custom <strong>strong with <em>emphasis</em></strong> Label';
			const res = await renderMarkdown(`
:::${type}[${label}]
Some text
:::
  `);
			expect(res.code).includes(`aria-label="${labelWithoutMarkdown}"`);
			expect(res.code).includes(`</svg>${labelHtml}</p>`);
		}
	);
});

const testCustomIcons = async (type: string) => {
	const res = await processor.render(`
:::${type}{icon="heart"}
Some text
:::
  `);
	await expect(res.code).toMatchFileSnapshot(
		`./snapshots/generates-aside-${type}-custom-icon.html`
	);

	await expect(async () =>
		processor.render(
			`
:::${type}{icon="invalid-icon-name"}
Some text
:::
	`
		)
	).rejects.toThrowErrorMatchingInlineSnapshot(
		`
			"[AstroUserError]:
				Failed to parse Markdown file "undefined":
				Invalid aside icon
			Hint:
				An aside custom icon must be set to the name of one of Starlight\’s built-in icons, but received \`invalid-icon-name\`.
				
				See https://starlight.astro.build/reference/icons/#all-icons for a list of available icons."
			`
	);
};

describe('custom icons', () => {
	// We cannot use test.each here since toThrowErrorMatchingInlineSnapshot
	// cannot be used inside test.each.
	// See: https://github.com/vitest-dev/vitest/issues/3329
	test('note with custom valid and invalid icons', async () => testCustomIcons('note'));
	test('tip with custom valid and invalid icons', async () => testCustomIcons('tip'));
	test('caution with custom valid and invalid icons', async () => testCustomIcons('caution'));
	test('danger with custom valid and invalid icons', async () => testCustomIcons('danger'));

	test('test custom icon with multiple paths inside the svg', async () => {
		const res = await processor.render(`
:::note{icon="external"}
Some text
:::
  `);
		await expect(res.code).toMatchFileSnapshot(
			`./snapshots/generates-aside-note-multiple-path-custom-icon.html`
		);
		const pathCount = (res.code.match(/path/g) || []).length;
		// If we have two pairs of opening and closing tags of path,
		// we will have 4 occurences of that word.
		expect(pathCount).eq(4);
	});
});

describe('custom labels with custom icons', () => {
	test.each(['note', 'tip', 'caution', 'danger'])('%s with custom label', async (type) => {
		const label = 'Custom Label';
		const res = await renderMarkdown(`
:::${type}[${label}]{icon="heart"}
Some text
:::
  `);
		expect(res.code).includes(`aria-label="${label}"`);
		expect(res.code).includes(`</svg>${label}</p>`);
		await expect(res.code).toMatchFileSnapshot(
			`./snapshots/generates-aside-${type}-custom-label-and-icon.html`
		);
	});
});

test('ignores unknown directive variants', async () => {
	const res = await renderMarkdown(`
:::unknown
Some text
:::
`);
	expect(res.code).toMatchInlineSnapshot('"<div><p>Some text</p></div>"');
});

test('handles complex children', async () => {
	const res = await renderMarkdown(`
:::note
Paragraph [link](/href/).

![alt](/img.jpg)

<details>
<summary>See more</summary>

More.

</details>
:::
`);
	await expect(res.code).toMatchFileSnapshot('./snapshots/handles-complex-children.html');
});

test('nested asides', async () => {
	const res = await renderMarkdown(`
::::note
Note contents.

:::tip
Nested tip.
:::

::::
`);
	await expect(res.code).toMatchFileSnapshot('./snapshots/nested-asides.html');
});

test('nested asides with custom titles', async () => {
	const res = await renderMarkdown(`
:::::caution[Caution with a custom title]
Nested caution.

::::note
Nested note.

:::tip[Tip with a custom title]
Nested tip.
:::

::::

:::::
`);
	const labels = [...res.code.matchAll(/aria-label="(?<label>[^"]+)"/g)].map(
		(match) => match.groups?.label
	);
	expect(labels).toMatchInlineSnapshot(`
		[
		  "Caution with a custom title",
		  "Note",
		  "Tip with a custom title",
		]
	`);
	await expect(res.code).toMatchFileSnapshot('./snapshots/nested-asides-custom-titles.html');
});

describe('translated labels in French', () => {
	test.each([
		['note', 'Note'],
		['tip', 'Astuce'],
		['caution', 'Attention'],
		['danger', 'Danger'],
	])('%s has label %s', async (type, label) => {
		const res = await renderMarkdown(
			`
:::${type}
Some text
:::
`,
			{ fileURL: new URL('./_src/content/docs/fr/index.md', import.meta.url) }
		);
		expect(res.code).includes(`aria-label="${label}"`);
		expect(res.code).includes(`</svg>${label}</p>`);
	});
});

test('runs without locales config', async () => {
	const processor = await createMarkdownProcessor({
		remarkPlugins: [
			...starlightAsides({
				starlightConfig: {
					// With no locales config, the default built-in locale is used.
					defaultLocale: { ...BuiltInDefaultLocale, locale: 'en' },
					locales: undefined,
				},
				astroConfig: {
					root: new URL(import.meta.url),
					srcDir: new URL('./_src/', import.meta.url),
				},
				useTranslations,
				absolutePathToLang,
			}),
			remarkDirectivesRestoration,
		],
	});
	const res = await renderMarkdown(':::note\nTest\n::', { processor });
	expect(res.code.includes('aria-label=Note"'));
});

test('transforms back unhandled text directives', async () => {
	const res = await renderMarkdown(
		`This is a:test of a sentence with a text:name[content]{key=val} directive.`
	);
	expect(res.code).toMatchInlineSnapshot(`
		"<p>This is a:test of a sentence with a text:name[content]{key="val"} directive.</p>"
	`);
});

test('transforms back unhandled leaf directives', async () => {
	const res = await renderMarkdown(`::video[Title]{v=xxxxxxxxxxx}`);
	expect(res.code).toMatchInlineSnapshot(`
		"<p>::video[Title]{v="xxxxxxxxxxx"}</p>"
	`);
});

test('does not add any whitespace character after any unhandled directive', async () => {
	const res = await renderMarkdown(`## Environment variables (astro:env)`);
	expect(res.code).toMatchInlineSnapshot(
		`"<h2 id="environment-variables-astroenv">Environment variables (astro:env)</h2>"`
	);
	expect(res.code).not.toMatch(/\n/);
});

test('lets remark plugin injected by Starlight plugins handle text and leaf directives', async () => {
	const processor = await createMarkdownProcessor({
		remarkPlugins: [
			...starlightAsides({
				starlightConfig,
				astroConfig: {
					root: new URL(import.meta.url),
					srcDir: new URL('./_src/', import.meta.url),
				},
				useTranslations,
				absolutePathToLang,
			}),
			// A custom remark plugin injected by a Starlight plugin through an Astro integration would
			// run before the restoration plugin.
			function customRemarkPlugin() {
				return function transformer(tree: Root) {
					visit(tree, (node, index, parent) => {
						if (node.type !== 'textDirective' || typeof index !== 'number' || !parent) return;
						if (node.name === 'abbr') {
							parent.children.splice(index, 1, { type: 'text', value: 'TEXT FROM REMARK PLUGIN' });
						}
					});
				};
			},
			remarkDirectivesRestoration,
		],
	});

	const res = await renderMarkdown(
		`This is a:test of a sentence with a :abbr[SL]{name="Starlight"} directive handled by another remark plugin and some other text:name[content]{key=val} directives not handled by any plugin.`,
		{ processor }
	);
	expect(res.code).toMatchInlineSnapshot(`
		"<p>This is a:test of a sentence with a TEXT FROM REMARK PLUGIN directive handled by another remark plugin and some other text:name[content]{key="val"} directives not handled by any plugin.</p>"
	`);
});

test('does not transform back directive nodes with data', async () => {
	const processor = await createMarkdownProcessor({
		remarkPlugins: [
			...starlightAsides({
				starlightConfig,
				astroConfig: {
					root: new URL(import.meta.url),
					srcDir: new URL('./_src/', import.meta.url),
				},
				useTranslations,
				absolutePathToLang,
			}),
			// A custom remark plugin updating the node with data that should be consumed by rehype.
			function customRemarkPlugin() {
				return function transformer(tree: Root) {
					visit(tree, (node) => {
						if (node.type !== 'textDirective') return;
						node.data ??= {};
						node.data.hName = 'span';
						node.data.hProperties = { class: `api` };
					});
				};
			},
			remarkDirectivesRestoration,
		],
	});

	const res = await renderMarkdown(`This method is available in the :api[thing] API.`, {
		processor,
	});
	expect(res.code).toMatchInlineSnapshot(
		`"<p>This method is available in the <span class="api">thing</span> API.</p>"`
	);
});
