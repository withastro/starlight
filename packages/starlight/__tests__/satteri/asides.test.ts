import type { MarkdownRenderer } from '@astrojs/markdown-remark';
import { describe, expect, test } from 'vitest';
import type { StarlightUserConfig } from '../../utils/user-config';
import { docFileURL, nonDocFileURL } from '../test-utils';
import { createStarlightSatteriProcessor } from './utils';

const starlightConfig = {
	title: 'Asides Tests',
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

test('generates aside', async () => {
	const res = await renderMarkdown(`
:::note
Some text
:::
`);
	await expect(res.code).toMatchFileSnapshot('./snapshots/generates-aside.html');
});

describe('default labels', () => {
	test.each([
		['note', 'Note'],
		['tip', 'Tip'],
		['caution', 'Caution'],
		['danger', 'Danger'],
	])('%s has label %s', async (type, label) => {
		const res = await renderMarkdown(`:::${type}\nbody\n:::`);
		expect(res.code).includes(`aria-label="${label}"`);
		expect(res.code).includes(`starlight-aside starlight-aside--${type}`);
	});
});

test('honors a custom title via `:::variant[Custom]`', async () => {
	const res = await renderMarkdown(`:::tip[Heads up]\nbody\n:::`);
	expect(res.code).includes('aria-label="Heads up"');
	expect(res.code).includes('Heads up');
});

test('renders a custom icon via `{icon="…"}`', async () => {
	const res = await renderMarkdown(`:::note{icon="rocket"}\nbody\n:::`);
	// The rocket icon emits two distinct `<path>` elements; the default note icon emits one.
	const pathCount = (res.code.match(/<path/g) ?? []).length;
	expect(pathCount).toBe(2);
	expect(res.code).toMatch(/M1\.44 8\.855/);
});

test('throws on an unknown custom icon', async () => {
	await expect(
		renderMarkdown(`:::note{icon="not-a-real-icon"}\nbody\n:::`)
	).rejects.toThrow(/Invalid aside icon/);
});

test('localizes the default label for the file’s language', async () => {
	const res = await renderMarkdown(`:::note\nbody\n:::`, {
		fileURL: docFileURL('fr/index.md'),
	});
	expect(res.code).includes('aria-label="Note"');
});

test('unknown variants pass through unchanged', async () => {
	const res = await renderMarkdown(`:::question\nbody\n:::`);
	expect(res.code).not.includes('starlight-aside');
});

describe('directives restoration', () => {
	test('serializes unhandled text directives back to source', async () => {
		const res = await renderMarkdown(`Hello :world{.x} there.`);
		expect(res.code).includes(':world{.x}');
		expect(res.code).not.includes('starlight-aside');
	});

	test('serializes unhandled leaf directives back to source', async () => {
		const res = await renderMarkdown(`::leafy{.x}`);
		expect(res.code).includes('::leafy{.x}');
	});

	test('leaves handled container directives untouched', async () => {
		const res = await renderMarkdown(`:::note\nbody\n:::`);
		expect(res.code).includes('starlight-aside--note');
		expect(res.code).not.includes(':::note');
	});
});

test('skips files outside the docs collection', async () => {
	const res = await renderMarkdown(`:::note\nbody\n:::`, {
		fileURL: nonDocFileURL(),
	});
	expect(res.code).not.includes('starlight-aside');
});
