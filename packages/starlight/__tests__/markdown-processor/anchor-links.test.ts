import { expect, test } from 'vitest';
import type { StarlightUserConfig } from '../../utils/user-config';
import {
	createStarlightMarkdownProcessor,
	describeEachProcessor,
	docFileURL,
	nonDocFileURL,
} from './utils';

const starlightConfig = {
	title: 'Anchor Links Tests',
	locales: { en: { label: 'English' }, fr: { label: 'French' } },
	defaultLocale: 'en',
} satisfies StarlightUserConfig;

describeEachProcessor(
	'anchor links',
	(ctx, name) => {
		test('generates anchor link markup', async () => {
			const res = await ctx().render(`\n## Some text\n`);
			await expect(res.code).toMatchFileSnapshot(
				ctx().snapshot('generates-anchor-link-markup.html')
			);
		});

		test('generates an accessible link label', async () => {
			const res = await ctx().render(`\n## Some text\n`);
			expect(res.code).includes('class="sl-anchor-link"');
			expect(res.code).includes('Section titled “Some text”');
		});

		test('strips HTML markup in the accessible link label', async () => {
			const res = await ctx().render(`\n## Some _important nested \`HTML\`_\n`);
			// The heading itself keeps the rendered markup (inline code gets `dir="auto"`).
			expect(res.code).includes('Some <em>important nested <code dir="auto">HTML</code></em>');
			// The visually-hidden label is plain text.
			expect(res.code).includes('Section titled “Some important nested HTML”');
		});

		test('localizes the accessible label for the file’s language', async () => {
			const res = await ctx().render(`\n## Some text\n`, { fileURL: docFileURL('fr/index.md') });
			expect(res.code).includes('Section intitulée « Some text »');
		});

		test('records the heading id in metadata', async () => {
			const res = await ctx().render(`\n## Some text\n`);
			expect(res.metadata.headings).toEqual([{ depth: 2, slug: 'some-text', text: 'Some text' }]);
		});

		test('disables wrapping when `headingLinks: false`', async () => {
			const off = await createStarlightMarkdownProcessor(name, {
				...starlightConfig,
				markdown: { headingLinks: false },
			});
			const res = await ctx().render(`\n## Some text\n`, { processor: off });
			expect(res.code).not.includes('sl-heading-wrapper');
			expect(res.code).not.includes('sl-anchor-link');
		});

		test('skips files outside the docs collection', async () => {
			const res = await ctx().render(`\n## Some text\n`, { fileURL: nonDocFileURL() });
			expect(res.code).not.includes('sl-heading-wrapper');
			expect(res.code).not.includes('sl-anchor-link');
		});
	},
	{ config: starlightConfig }
);
