import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';
import { expect, test } from 'vitest';
import type { StarlightUserConfig } from '../../utils/user-config';
import { starlightRehypePlugins } from '../../integrations/remark-rehype';
import { createPluginTestOptions, docFileURL } from '../test-utils';

const starlightConfig = {
	title: 'Anchor Links Tests',
	locales: { en: { label: 'English' }, fr: { label: 'French' } },
	defaultLocale: 'en',
} satisfies StarlightUserConfig;

const processor = await createMarkdownProcessor({
	rehypePlugins: [
		...starlightRehypePlugins(await createPluginTestOptions(starlightConfig)),
	],
});

function renderMarkdown(
	content: string,
	options: { fileURL?: URL; processor?: MarkdownRenderer } = {}
) {
	return (options.processor ?? processor).render(content, {
		fileURL: options.fileURL ?? docFileURL(),
	});
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
	expect(res.code).includes(
		'<span class="sr-only" data-pagefind-ignore="">Section titled “Some text”</span>'
	);
});

test('strips HTML markup in accessible link label', async () => {
	const res = await renderMarkdown(`
## Some _important nested \`HTML\`_
`);
	// Heading renders HTML
	expect(res.code).includes('Some <em>important nested <code dir="auto">HTML</code></em>');
	// Visually hidden label renders plain text
	expect(res.code).includes(
		'<span class="sr-only" data-pagefind-ignore="">Section titled “Some important nested HTML”</span>'
	);
});

test('localizes accessible label for the current language', async () => {
	const res = await renderMarkdown(
		`
## Some text
`,
		{ fileURL: docFileURL('fr/index.md') }
	);
	expect(res.code).includes(
		'<span class="sr-only" data-pagefind-ignore="">Section intitulée « Some text »</span>'
	);
});
