import type { MarkdownRenderer } from '@astrojs/markdown-remark';
import { expect, test } from 'vitest';
import type { StarlightUserConfig } from '../../utils/user-config';
import { docFileURL, nonDocFileURL } from '../test-utils';
import { createStarlightSatteriProcessor } from './utils';

const starlightConfig = {
	title: 'Anchor Links Tests',
	locales: { en: { label: 'English' }, fr: { label: 'French' } },
	defaultLocale: 'en',
} satisfies StarlightUserConfig;

const processor = await createStarlightSatteriProcessor(starlightConfig);

function renderMarkdown(
	content: string,
	options: { fileURL?: URL; processor?: MarkdownRenderer } = {}
) {
	return (options.processor ?? processor).render(content, {
		fileURL: options.fileURL ?? docFileURL(),
	});
}

test('generates anchor link markup', async () => {
	const res = await renderMarkdown(`\n## Some text\n`);
	await expect(res.code).toMatchFileSnapshot('./snapshots/generates-anchor-link-markup.html');
});

test('generates an accessible link label', async () => {
	const res = await renderMarkdown(`\n## Some text\n`);
	expect(res.code).includes(
		'<span class="sr-only" data-pagefind-ignore>Section titled “Some text”</span>'
	);
});

test('strips HTML markup in accessible link label', async () => {
	const res = await renderMarkdown(`\n## Some _important nested \`HTML\`_\n`);
	expect(res.code).includes('Some <em>important nested <code dir="auto">HTML</code></em>');
	expect(res.code).includes('Section titled “Some important nested HTML”');
});

test('localizes the accessible label for the file’s language', async () => {
	const res = await renderMarkdown(`\n## Some text\n`, {
		fileURL: docFileURL('fr/index.md'),
	});
	expect(res.code).includes('Section intitulée « Some text »');
});

test('records the heading id in metadata', async () => {
	const res = await renderMarkdown(`\n## Some text\n`);
	expect(res.metadata.headings).toEqual([{ depth: 2, slug: 'some-text', text: 'Some text' }]);
});

test('disables wrapping when `headingLinks: false`', async () => {
	const off = await createStarlightSatteriProcessor({
		title: 'Heading-Links Off',
		markdown: { headingLinks: false },
	});
	const res = await renderMarkdown(`\n## Some text\n`, { processor: off });
	expect(res.code).not.includes('sl-heading-wrapper');
	expect(res.code).not.includes('sl-anchor-link');
});

test('skips files outside the docs collection', async () => {
	const res = await renderMarkdown(`\n## Some text\n`, {
		fileURL: nonDocFileURL(),
	});
	expect(res.code).not.includes('sl-heading-wrapper');
	expect(res.code).not.includes('sl-anchor-link');
});
