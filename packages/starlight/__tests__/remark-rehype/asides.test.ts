import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { describe, expect, test } from 'vitest';
import { starlightAsides, remarkDirectivesRestoration } from '../../integrations/asides';
import { createTranslationSystemFromFs } from '../../utils/translations-fs';
import { StarlightConfigSchema, type StarlightUserConfig } from '../../utils/user-config';

const starlightConfig = StarlightConfigSchema.parse({
	title: 'Asides Tests',
	locales: { en: { label: 'English' }, fr: { label: 'French' } },
	defaultLocale: 'en',
} satisfies StarlightUserConfig);

const useTranslations = createTranslationSystemFromFs(
	starlightConfig,
	// Using non-existent `_src/` to ignore custom files in this test fixture.
	{ srcDir: new URL('./_src/', import.meta.url) }
);

const processor = await createMarkdownProcessor({
	remarkPlugins: [
		...starlightAsides({
			starlightConfig,
			astroConfig: { root: new URL(import.meta.url), srcDir: new URL('./_src/', import.meta.url) },
			useTranslations,
		}),
		// The restoration plugin is run after the asides and any other plugin that may have been
		// injected by Starlight plugins.
		remarkDirectivesRestoration,
	],
});

test('generates <aside>', async () => {
	const res = await processor.render(`
:::note
Some text
:::
`);
	expect(res.code).toMatchFileSnapshot('./snapshots/generates-aside.html');
});

describe('default labels', () => {
	test.each([
		['note', 'Note'],
		['tip', 'Tip'],
		['caution', 'Caution'],
		['danger', 'Danger'],
	])('%s has label %s', async (type, label) => {
		const res = await processor.render(`
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
		const res = await processor.render(`
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
		const res = await processor.render(`
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
			const res = await processor.render(`
:::${type}[${label}]
Some text
:::
  `);
			expect(res.code).includes(`aria-label="${labelWithoutMarkdown}"`);
			expect(res.code).includes(`</svg>${labelHtml}</p>`);
		}
	);
});

describe('custom icons', () => {
	test.each(['note', 'tip', 'caution', 'danger'])('%s with custom label', async (type) => {
		const res = await processor.render(`
:::${type}{icon="heart"}
Some text
:::
  `);
		expect(res.code).includes(
			'M20.16 5A6.29 6.29 0 0 0 12 4.36a6.27 6.27 0 0 0-8.16 9.48l6.21 6.22a2.78 2.78 0 0 0 3.9 0l6.21-6.22a6.27 6.27 0 0 0 0-8.84m-1.41 7.46-6.21 6.21a.76.76 0 0 1-1.08 0l-6.21-6.24a4.29 4.29 0 0 1 0-6 4.27 4.27 0 0 1 6 0 1 1 0 0 0 1.42 0 4.27 4.27 0 0 1 6 0 4.29 4.29 0 0 1 .08 6Z'
		);

		expect(async () =>
			processor.render(`
:::${type}{icon="invalid-icon-name"}
Some text
:::
	`)
		).rejects.toThrowError(
			'Failed to parse Markdown file "undefined":\nIcon name should be part of Starlight\'s icon list.'
		);
	});
});

test('ignores unknown directive variants', async () => {
	const res = await processor.render(`
:::unknown
Some text
:::
`);
	expect(res.code).toMatchInlineSnapshot('"<div><p>Some text</p></div>"');
});

test('handles complex children', async () => {
	const res = await processor.render(`
:::note
Paragraph [link](/href/).

![alt](/img.jpg)

<details>
<summary>See more</summary>

More.

</details>
:::
`);
	expect(res.code).toMatchFileSnapshot('./snapshots/handles-complex-children.html');
});

test('nested asides', async () => {
	const res = await processor.render(`
::::note
Note contents.

:::tip
Nested tip.
:::

::::
`);
	expect(res.code).toMatchFileSnapshot('./snapshots/nested-asides.html');
});

test('nested asides with custom titles', async () => {
	const res = await processor.render(`
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
	expect(res.code).toMatchFileSnapshot('./snapshots/nested-asides-custom-titles.html');
});

describe('translated labels in French', () => {
	test.each([
		['note', 'Note'],
		['tip', 'Astuce'],
		['caution', 'Attention'],
		['danger', 'Danger'],
	])('%s has label %s', async (type, label) => {
		const res = await processor.render(
			`
:::${type}
Some text
:::
`,
			// @ts-expect-error fileURL is part of MarkdownProcessor's options
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
				starlightConfig: { locales: undefined },
				astroConfig: {
					root: new URL(import.meta.url),
					srcDir: new URL('./_src/', import.meta.url),
				},
				useTranslations,
			}),
			remarkDirectivesRestoration,
		],
	});
	const res = await processor.render(':::note\nTest\n::');
	expect(res.code.includes('aria-label=Note"'));
});

test('transforms back unhandled text directives', async () => {
	const res = await processor.render(
		`This is a:test of a sentence with a text:name[content]{key=val} directive.`
	);
	expect(res.code).toMatchInlineSnapshot(`
		"<p>This is a:test of a sentence with a text:name[content]{key="val"} directive.</p>"
	`);
});

test('transforms back unhandled leaf directives', async () => {
	const res = await processor.render(`::video[Title]{v=xxxxxxxxxxx}`);
	expect(res.code).toMatchInlineSnapshot(`
		"<p>::video[Title]{v="xxxxxxxxxxx"}</p>"
	`);
});

test('does not add any whitespace character after any unhandled directive', async () => {
	const res = await processor.render(`## Environment variables (astro:env)`);
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

	const res = await processor.render(
		`This is a:test of a sentence with a :abbr[SL]{name="Starlight"} directive handled by another remark plugin and some other text:name[content]{key=val} directives not handled by any plugin.`
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

	const res = await processor.render(`This method is available in the :api[thing] API.`);
	expect(res.code).toMatchInlineSnapshot(
		`"<p>This method is available in the <span class="api">thing</span> API.</p>"`
	);
});
