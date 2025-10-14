import { rehype } from 'rehype';
import { VFile } from 'vfile';
import { expect, test } from 'vitest';
import { starlightRehypePlugins } from '../../integrations/remark-rehype';
import { createRemarkRehypePluginTestOptions } from './utils';

const processor = rehype()
	.data('settings', { fragment: true })
	.use(starlightRehypePlugins(await createRemarkRehypePluginTestOptions()));

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
