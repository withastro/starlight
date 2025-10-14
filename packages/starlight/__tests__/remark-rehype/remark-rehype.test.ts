import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { expect, test } from 'vitest';
import { starlightRehypePlugins, starlightRemarkPlugins } from '../../integrations/remark-rehype';
import { createRemarkRehypePluginTestOptions } from './utils';

test('does not run Starlight remark plugins on documents without a file path', async () => {
	const processor = await createMarkdownProcessor({
		remarkPlugins: [...starlightRemarkPlugins(await createRemarkRehypePluginTestOptions())],
	});

	const res = await processor.render(
		`
:::note
Some text
:::
`,
		// Rendering Markdown content using the content loader `renderMarkdown()` API does not provide
		// a `fileURL` option.
		{}
	);

	// Asides directives should not be processed.
	expect(res.code).not.includes(`aside`);
	expect(res.code).not.includes(`</svg>Note</p>`);
});

test('does not run Starlight rehype plugins on documents without a file path', async () => {
	const processor = await createMarkdownProcessor({
		rehypePlugins: [...starlightRehypePlugins(await createRemarkRehypePluginTestOptions())],
	});

	const res = await processor.render(
		`
## Some heading

And \`some\` inline code.
`,
		// Rendering Markdown content using the content loader `renderMarkdown()` API does not provide
		// a `fileURL` option.
		{}
	);

	// Heading anchor links should not be added.
	expect(res.code).not.includes('Section titled');
	// Code elements should not be processed for RTL support.
	expect(res.code).not.includes('<code dir="auto">');
});
