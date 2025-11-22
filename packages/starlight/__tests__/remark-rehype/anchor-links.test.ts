import { createMarkdownProcessor, type MarkdownProcessor } from '@astrojs/markdown-remark';
import { expect, test } from 'vitest';
import type { StarlightUserConfig } from '../../utils/user-config';
import { starlightRehypePlugins } from '../../integrations/remark-rehype';
import { createRemarkRehypePluginTestOptions } from './utils';

const starlightConfig = {
	title: 'Anchor Links Tests',
	locales: { en: { label: 'English' }, fr: { label: 'French' } },
	defaultLocale: 'en',
} satisfies StarlightUserConfig;

const processor = await createMarkdownProcessor({
	rehypePlugins: [
		...starlightRehypePlugins(await createRemarkRehypePluginTestOptions(starlightConfig)),
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

test('generates anchor link markup', async () => {
	const res = await renderMarkdown(`
## Some text
`);
	await expect(res.code).toMatchFileSnapshot('./snapshots/generates-anchor-link-markup.html');
});

test('generates an accessible link label', async () => {
	const res = await renderMarkdown(`
## Some text
`);
	expect(res.code).includes('<span class="sr-only">Section titled “Some text”</span>');
});

test('strips HTML markup in accessible link label', async () => {
	const res = await renderMarkdown(`
## Some _important nested \`HTML\`_
`);
	// Heading renders HTML
	expect(res.code).includes('Some <em>important nested <code dir="auto">HTML</code></em>');
	// Visually hidden label renders plain text
	expect(res.code).includes(
		'<span class="sr-only">Section titled “Some important nested HTML”</span>'
	);
});

test('localizes accessible label for the current language', async () => {
	const res = await renderMarkdown(
		`
## Some text
`,
		{ fileURL: new URL('./_src/content/docs/fr/index.md', import.meta.url) }
	);
	expect(res.code).includes('<span class="sr-only">Section intitulée « Some text »</span>');
});
