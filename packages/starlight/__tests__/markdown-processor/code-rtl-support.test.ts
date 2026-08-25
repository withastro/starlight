import type { MarkdownRenderer } from '@astrojs/markdown-remark';
import { beforeAll, expect, test } from 'vitest';
import { createStarlightMarkdownProcessor, describeEachProcessor, nonDocFileURL } from './utils';

// These tests render through the bare Markdown processors, where fenced code blocks are highlighted
// by Astro's built-in Shiki highlighter (hence the `astro-code` class). Starlight normally swaps in
// Expressive Code, but that runs as a separate integration and is out of scope here.
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

	test('applies `dir="ltr"` to Astro Shiki-highlighted fenced code blocks', async () => {
		const res = await ctx().render('```js\nconsole.log("test")\n```');
		expect(res.code).includes('dir="ltr"');
		expect(res.code).includes('astro-code');
		// The `<code>` inside the highlighted `<pre>` inherits its `dir`, it is not set to `auto`.
		expect(res.code).not.includes('dir="auto"');
	});

	test('applies `dir="ltr"` to fenced code blocks when Shiki is off', async () => {
		const res = await ctx().render('```\nconsole.log("test")\n```', { processor: plain });
		expect(res.code).includes('<pre dir="ltr">');
		// The `<code>` inside the `<pre>` is skipped so it inherits the block's `dir="ltr"`.
		expect(res.code).includes('<code>');
		expect(res.code).not.includes('dir="auto"');
	});

	test('handles `dir="ltr"` on raw `<pre>` HTML per processor', async () => {
		const res = await ctx().render('<pre><code>manual</code></pre>', { processor: plain });

		// Since Astro's Sätteri implementation for Shiki returns raw nodes, it, by accident, applies
		// `dir="ltr"` to raw `<pre>` blocks even if they're not coming from a plugin generating HAST.
		if (name === 'satteri') {
			expect(res.code).includes('<pre dir="ltr"><code>manual</code></pre>');
		} else {
			expect(res.code).includes('<pre><code>manual</code></pre>');
		}
	});

	test('does not override an existing `dir` on inline code', async () => {
		const res = await ctx().render(`<code dir="rtl">manual</code>`);
		expect(res.code).includes('<code dir="rtl">manual</code>');
		expect(res.code).not.includes('dir="auto"');
	});

	test('does not override an existing `dir` on fenced code blocks', async () => {
		const res = await ctx().render('<pre dir="rtl"><code>manual</code></pre>', {
			processor: plain,
		});
		expect(res.code).includes('<pre dir="rtl">');
		expect(res.code).includes('<code>');
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
