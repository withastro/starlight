import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import type { MdastPluginDefinition } from 'satteri';
import { describe, expect, test, vi } from 'vitest';
import { remarkDirectivesRestoration } from '../../integrations/remark-asides';
import { satteriDirectivesRestoration, starlightSatteriPlugins } from '../../integrations/satteri';
import { starlightRemarkPlugins } from '../../integrations/remark-rehype';
import type { StarlightUserConfig } from '../../utils/user-config';
import { BuiltInDefaultLocale } from '../../utils/i18n';
import { createPluginTestOptions, docFileURL } from '../test-utils';
import { createStarlightMarkdownProcessor, describeEachProcessor, nonDocFileURL } from './utils';

const starlightConfig = {
	title: 'Asides Tests',
	locales: { en: { label: 'English' }, fr: { label: 'French' } },
	defaultLocale: 'en',
} satisfies StarlightUserConfig;

const types = ['note', 'tip', 'caution', 'danger'] as const;

describeEachProcessor(
	'asides',
	(ctx, name) => {
		test('generates aside', async () => {
			const res = await ctx().render(`\n:::note\nSome text\n:::\n`);
			await expect(res.code).toMatchFileSnapshot(ctx().snapshot('generates-aside.html'));
		});

		test.each([
			['note', 'Note'],
			['tip', 'Tip'],
			['caution', 'Caution'],
			['danger', 'Danger'],
		])('%s has default label %s', async (type, label) => {
			const res = await ctx().render(`\n:::${type}\nSome text\n:::\n`);
			expect(res.code).includes(`aria-label="${label}"`);
			expect(res.code).includes(`</svg>${label}</p>`);
		});

		test.each(types)('%s honors a custom label', async (type) => {
			const label = 'Custom Label';
			const res = await ctx().render(`\n:::${type}[${label}]\nSome text\n:::\n`);
			expect(res.code).includes(`aria-label="${label}"`);
			expect(res.code).includes(`</svg>${label}</p>`);
		});

		test.each(types)('%s renders Markdown in a custom label', async (type) => {
			const res = await ctx().render(`\n:::${type}[Custom \`code\` Label]\nSome text\n:::\n`);
			expect(res.code).includes(`aria-label="Custom code Label"`);
			// The RTL code-support pass adds `dir="auto"` to inline code on both processors.
			expect(res.code).includes(`</svg>Custom <code dir="auto">code</code> Label</p>`);
		});

		test.each(types)('%s renders doubly-nested Markdown in a custom label', async (type) => {
			const res = await ctx().render(
				`\n:::${type}[Custom **strong with _emphasis_** Label]\nSome text\n:::\n`
			);
			expect(res.code).includes(`aria-label="Custom strong with emphasis Label"`);
			expect(res.code).includes(
				`</svg>Custom <strong>strong with <em>emphasis</em></strong> Label</p>`
			);
		});

		test.each(types)('%s renders a custom icon', async (type) => {
			const res = await ctx().render(`\n:::${type}{icon="heart"}\nSome text\n:::\n`);
			await expect(res.code).toMatchFileSnapshot(
				ctx().snapshot(`generates-aside-${type}-custom-icon.html`)
			);
		});

		test.each(types)('%s throws on an invalid custom icon', async (type) => {
			// Temporarily mock console.error to avoid cluttering test output when the processor logs an
			// error before rethrowing it. The error surfaces with different wrapping per processor
			// (unified re-wraps as "Failed to parse Markdown file"), so we only assert that it throws.
			const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
			await expect(() =>
				ctx().render(`\n:::${type}{icon="invalid-icon-name"}\nSome text\n:::\n`)
			).rejects.toThrow();
			consoleError.mockRestore();
		});

		test('renders a custom icon with multiple paths inside the svg', async () => {
			const res = await ctx().render(`\n:::note{icon="external"}\nSome text\n:::\n`);
			await expect(res.code).toMatchFileSnapshot(
				ctx().snapshot('generates-aside-note-multiple-path-custom-icon.html')
			);
			// The `external` icon emits two `<path>` elements. (Counting opening tags works regardless
			// of whether the processor self-closes them.)
			expect((res.code.match(/<path/g) ?? []).length).eq(2);
		});

		test.each(types)('%s renders a custom label and a custom icon', async (type) => {
			const label = 'Custom Label';
			const res = await ctx().render(`\n:::${type}[${label}]{icon="heart"}\nSome text\n:::\n`);
			expect(res.code).includes(`aria-label="${label}"`);
			expect(res.code).includes(`</svg>${label}</p>`);
			await expect(res.code).toMatchFileSnapshot(
				ctx().snapshot(`generates-aside-${type}-custom-label-and-icon.html`)
			);
		});

		test('keeps the content of unknown directive variants', async () => {
			const res = await ctx().render(`\n:::unknown\nSome text\n:::\n`);
			expect(res.code).not.includes('starlight-aside');
			expect(res.code).includes('<div><p>Some text</p></div>');
		});

		test('skips files outside the docs collection', async () => {
			const res = await ctx().render(`\n:::note\nSome text\n:::\n`, { fileURL: nonDocFileURL() });
			expect(res.code).not.includes('starlight-aside');
		});

		test('handles complex children', async () => {
			const res = await ctx().render(
				`\n:::note\nParagraph [link](/href/).\n\n![alt](/img.jpg)\n\n<details>\n<summary>See more</summary>\n\nMore.\n\n</details>\n:::\n`
			);
			await expect(res.code).toMatchFileSnapshot(ctx().snapshot('handles-complex-children.html'));
		});

		test.each([
			['note', 'Note'],
			['tip', 'Astuce'],
			['caution', 'Attention'],
			['danger', 'Danger'],
		])('%s is translated to French (%s)', async (type, label) => {
			const res = await ctx().render(`\n:::${type}\nSome text\n:::\n`, {
				fileURL: docFileURL('fr/index.md'),
			});
			expect(res.code).includes(`aria-label="${label}"`);
			expect(res.code).includes(`</svg>${label}</p>`);
		});

		test('runs without a locales config', async () => {
			const processor = await createStarlightMarkdownProcessor(name, {
				...starlightConfig,
				// With no locales config, the default built-in locale is used.
				defaultLocale: BuiltInDefaultLocale.lang,
				locales: undefined,
			});
			const res = await ctx().render(':::note\nTest\n:::', { processor });
			expect(res.code).includes('aria-label="Note"');
		});

		test('transforms unhandled text directives back to their source', async () => {
			const res = await ctx().render(
				`This is a:test of a sentence with a text:name[content]{key=val} directive.`
			);
			expect(res.code).includes('a:test');
			expect(res.code).includes('text:name[content]{key="val"}');
			expect(res.code).not.includes('<aside');
		});

		test('transforms unhandled leaf directives back to their source', async () => {
			const res = await ctx().render(`::video[Title]{v=xxxxxxxxxxx}`);
			expect(res.code).includes('::video[Title]{v="xxxxxxxxxxx"}');
		});

		test('does not add whitespace after an unhandled directive', async () => {
			// `:env)` looks like a text directive; restoring it must not inject stray whitespace.
			const res = await ctx().render(`## Environment variables (astro:env)`);
			expect(res.code).includes('Environment variables (astro:env)');
			// Sätteri emits a trailing newline; trim it before checking for stray internal newlines.
			expect(res.code.trim()).not.toMatch(/\n/);
		});

		test('nested asides', async () => {
			const res = await ctx().render(
				`\n::::note\nNote contents.\n\n:::tip\nNested tip.\n:::\n\n::::\n`
			);
			await expect(res.code).toMatchFileSnapshot(ctx().snapshot('nested-asides.html'));
		});

		test('nested asides with custom titles', async () => {
			const res = await ctx().render(
				`\n:::::caution[Caution with a custom title]\nNested caution.\n\n::::note\nNested note.\n\n:::tip[Tip with a custom title]\nNested tip.\n:::\n\n::::\n\n:::::\n`
			);
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
			await expect(res.code).toMatchFileSnapshot(
				ctx().snapshot('nested-asides-custom-titles.html')
			);
		});
	},
	{ config: starlightConfig }
);

describe('asides directive restoration (unified)', () => {
	test('lets a remark plugin handle text and leaf directives before restoration', async () => {
		const processor = await createMarkdownProcessor({
			remarkPlugins: [
				...starlightRemarkPlugins(await createPluginTestOptions(starlightConfig)),
				function customRemarkPlugin() {
					return function transformer(tree: Root) {
						visit(tree, (node, index, parent) => {
							if (node.type !== 'textDirective' || typeof index !== 'number' || !parent) return;
							if (node.name === 'abbr') {
								parent.children.splice(index, 1, {
									type: 'text',
									value: 'TEXT FROM REMARK PLUGIN',
								});
							}
						});
					};
				},
				remarkDirectivesRestoration,
			],
		});

		const res = await processor.render(
			`This is a:test of a sentence with a :abbr[SL]{name="Starlight"} directive handled by another remark plugin and some other text:name[content]{key=val} directives not handled by any plugin.`,
			{ fileURL: docFileURL() }
		);
		expect(res.code).toMatchInlineSnapshot(`
			"<p>This is a:test of a sentence with a TEXT FROM REMARK PLUGIN directive handled by another remark plugin and some other text:name[content]{key="val"} directives not handled by any plugin.</p>"
		`);
	});

	test('does not transform back directive nodes that carry data', async () => {
		const processor = await createMarkdownProcessor({
			remarkPlugins: [
				...starlightRemarkPlugins(await createPluginTestOptions(starlightConfig)),
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

		const res = await processor.render(`This method is available in the :api[thing] API.`, {
			fileURL: docFileURL(),
		});
		expect(res.code).toMatchInlineSnapshot(
			`"<p>This method is available in the <span class="api">thing</span> API.</p>"`
		);
	});
});

describe('asides directive restoration (Sätteri)', () => {
	async function createSatteriProcessor(...extraMdastPlugins: MdastPluginDefinition[]) {
		const { mdastPlugins, hastPlugins } = starlightSatteriPlugins(
			await createPluginTestOptions(starlightConfig)
		);
		return createSatteriMarkdownProcessor({
			mdastPlugins: [...mdastPlugins, ...extraMdastPlugins, satteriDirectivesRestoration()],
			hastPlugins,
			// Starlight's asides rely on container directives, which Sätteri disables by default.
			features: { directive: true },
		});
	}

	test('lets an mdast plugin handle text directives before restoration', async () => {
		const processor = await createSatteriProcessor({
			name: 'custom',
			textDirective(node) {
				if (node.name === 'abbr') return { type: 'text', value: 'TEXT FROM MDAST PLUGIN' };
				return;
			},
		});

		const res = await processor.render(
			`This is a:test of a sentence with a :abbr[SL]{name="Starlight"} directive handled by another mdast plugin and some other text:name[content]{key=val} directives not handled by any plugin.`,
			{ fileURL: docFileURL() }
		);
		expect(res.code).toMatchInlineSnapshot(`
			"<p>This is a:test of a sentence with a TEXT FROM MDAST PLUGIN directive handled by another mdast plugin and some other text:name[content]{key="val"} directives not handled by any plugin.</p>
			"
		`);
	});

	test('does not transform back directive nodes that carry data', async () => {
		const processor = await createSatteriProcessor({
			name: 'custom',
			textDirective(node, ctx) {
				if (node.name !== 'api') return;
				ctx.setProperty(node, 'data', { hName: 'span', hProperties: { class: 'api' } });
				return;
			},
		});

		const res = await processor.render(`This method is available in the :api[thing] API.`, {
			fileURL: docFileURL(),
		});
		expect(res.code).toMatchInlineSnapshot(
			`
			"<p>This method is available in the <span class="api">thing</span> API.</p>
			"
		`
		);
	});
});
