import { rehype } from 'rehype';
import { VFile } from 'vfile';
import { expect, test } from 'vitest';
import { rehypeRtlCodeSupport } from '../../src/integrations/code-rtl-support';

const astroConfig = {
	root: new URL(import.meta.url),
	srcDir: new URL('./_src/', import.meta.url),
};

const processor = rehype()
	.data('settings', { fragment: true })
	.use(rehypeRtlCodeSupport({ astroConfig }));

function renderMarkdown(content: string, options: { fileURL?: URL } = {}) {
	return processor.process(
		new VFile({
			path: options.fileURL ?? new URL(`./_src/content/docs/index.md`, import.meta.url),
			value: content,
		})
	);
}

test('applies `dir="auto"` to inline code', async () => {
	const input = `<p>Some text with <code>inline code</code>.</p>`;
	const output = String(await renderMarkdown(input));
	expect(output).not.toEqual(input);
	expect(output).includes('dir="auto"');
	expect(output).toMatchInlineSnapshot(
		`"<p>Some text with <code dir="auto">inline code</code>.</p>"`
	);
});

test('applies `dir="ltr"` to code blocks', async () => {
	const input = `<p>Some text in a paragraph:</p><pre><code>console.log('test')</code></pre>`;
	const output = String(await renderMarkdown(input));
	expect(output).not.toEqual(input);
	expect(output).includes('dir="ltr"');
	expect(output).toMatchInlineSnapshot(
		`"<p>Some text in a paragraph:</p><pre dir="ltr"><code>console.log('test')</code></pre>"`
	);
});

test('does not transform documents without a file path', async () => {
	const input = `<p>Some text with <code>inline code</code>.</p>`;
	const output = String(
		await processor.process(
			new VFile({
				// Rendering Markdown content using the content loader `renderMarkdown()` API does not
				// provide a `path` option.
				value: input,
			})
		)
	);
	expect(output).toEqual(input);
});
