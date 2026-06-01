import type { MarkdownRenderer } from '@astrojs/markdown-remark';
import { beforeAll, expect, test } from 'vitest';
import { createStarlightMarkdownProcessor, describeEachProcessor, nonDocFileURL } from './utils';

describeEachProcessor('code RTL support', (ctx, name) => {
	// A processor with syntax highlighting disabled, so a fenced block stays a `<pre>` element our
	// hast pass can see, instead of being replaced by Shiki's raw HTML output.
	let plain: MarkdownRenderer;
	beforeAll(async () => {
		plain = await createStarlightMarkdownProcessor(name, undefined, { syntaxHighlight: false });
	});

	test('applies `dir="auto"` to inline code', async () => {
		const res = await ctx().render('Some text with `inline code`.');
		expect(res.code).includes('<code dir="auto">inline code</code>');
	});

	test('applies `dir="ltr"` to Shiki-highlighted fenced code blocks', async () => {
		const res = await ctx().render('```js\nconsole.log("test")\n```');
		expect(res.code).includes('dir="ltr"');
		expect(res.code).includes('astro-code');
	});

	test('applies `dir="ltr"` to fenced code blocks when Shiki is off', async () => {
		const res = await ctx().render('```\nconsole.log("test")\n```', { processor: plain });
		expect(res.code).includes('<pre dir="ltr">');
	});

	test('does not override an existing `dir` on inline code', async () => {
		const res = await ctx().render(`<code dir="rtl">manual</code>`);
		expect(res.code).includes('dir="rtl"');
		expect(res.code).not.includes('dir="auto"');
	});

	test('does not override an existing `dir` on fenced code blocks', async () => {
		const res = await ctx().render('<pre dir="rtl"><code>manual</code></pre>', {
			processor: plain,
		});
		expect(res.code).includes('dir="rtl"');
		expect(res.code).not.includes('dir="ltr"');
	});

	test('skips inline code in files outside the docs collection', async () => {
		const res = await ctx().render('Inline `code`', { fileURL: nonDocFileURL() });
		expect(res.code).not.includes('dir="auto"');
	});

	test('skips fenced code blocks in files outside the docs collection', async () => {
		const res = await ctx().render('```\nconsole.log("test")\n```', {
			fileURL: nonDocFileURL(),
			processor: plain,
		});
		expect(res.code).not.includes('dir="ltr"');
	});

	test('skips Shiki-highlighted code blocks in files outside the docs collection', async () => {
		const res = await ctx().render('```js\nconsole.log("test")\n```', { fileURL: nonDocFileURL() });
		expect(res.code).not.includes('dir="ltr"');
	});
});
