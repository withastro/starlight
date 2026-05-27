import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import type { MarkdownRenderer } from '@astrojs/markdown-remark';
import { expect, test } from 'vitest';
import { starlightSatteriPlugins } from '../../integrations/satteri';
import { createPluginTestOptions, docFileURL, nonDocFileURL } from '../test-utils';
import { createStarlightSatteriProcessor } from './utils';

const processor = await createStarlightSatteriProcessor();

// A processor with syntax highlighting disabled, so `<pre>` survives to our
// hast pass intact instead of being replaced by Shiki's raw HTML output.
const plainProcessor = await (async () => {
	const { mdastPlugins, hastPlugins } = starlightSatteriPlugins(
		await createPluginTestOptions()
	);
	return createSatteriMarkdownProcessor({
		syntaxHighlight: false,
		mdastPlugins,
		hastPlugins,
	});
})();

function renderMarkdown(
	content: string,
	options: { fileURL?: URL; processor?: MarkdownRenderer } = {}
) {
	return (options.processor ?? processor).render(content, {
		fileURL: options.fileURL ?? docFileURL(),
	});
}

test('applies `dir="auto"` to inline code', async () => {
	const res = await renderMarkdown(`Some text with \`inline code\`.`);
	expect(res.code).includes('<code dir="auto">inline code</code>');
});

test('applies `dir="ltr"` to fenced code blocks (when Shiki is off)', async () => {
	const res = await renderMarkdown('```\nconsole.log("test")\n```', {
		processor: plainProcessor,
	});
	expect(res.code).includes('<pre dir="ltr">');
});

test('does not override an existing `dir` attribute', async () => {
	const res = await renderMarkdown(`<code dir="rtl">manual</code>`);
	expect(res.code).includes('dir="rtl"');
	expect(res.code).not.includes('dir="auto"');
});

test('skips files outside the docs collection', async () => {
	const res = await renderMarkdown(`Inline \`code\``, {
		fileURL: nonDocFileURL(),
	});
	expect(res.code).not.includes('dir="auto"');
});
