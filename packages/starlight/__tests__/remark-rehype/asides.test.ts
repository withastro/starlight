import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { describe, expect, test } from 'vitest';
import { starlightAsides } from '../../integrations/asides';

const processor = await createMarkdownProcessor({
	remarkPlugins: [...starlightAsides()],
});

test('generates <aside>', async () => {
	const res = await processor.render(`
:::note
Some text
:::
`);
	expect(res.code).toMatchFileSnapshot('./asides/generates-aside.html');
});

describe('default labels', () => {
	test.each([
		['note', 'Note'],
		['tip', 'Tip'],
		['caution', 'Caution'],
		['danger', 'Danger'],
	])('%s has label %s', async (type, label) => {
		const res = await processor.render(`
:::${type}[${label}]
Some text
:::
`);
		expect(res.code).includes(`aria-label="${label}"`);
		expect(res.code).includes(`</svg>${label}</p>`);
	});
});

describe('custom labels', () => {
	test.each(['note', 'tip', 'caution', 'danger'])('%s with custom label', async (type) => {
		const label = 'Custom Label';
		const res = await processor.render(`
:::${type}[${label}]
Some text
:::
  `);
		expect(res.code).includes(`aria-label="${label}"`);
		expect(res.code).includes(`</svg>${label}</p>`);
	});
});

test('ignores unknown directive variants', async () => {
	const res = await processor.render(`
:::unknown
Some text
:::
`);
	expect(res.code).toMatchInlineSnapshot('"<div><p>Some text</p></div>"');
});

test('handles complex children', async () => {
	const res = await processor.render(`
:::note
Paragraph [link](/href/).

![alt](/img.jpg)

<details>
<summary>See more</summary>

More.

</details>
:::
`);
	expect(res.code).toMatchFileSnapshot('./asides/handles-complex-children.html');
});

test('nested asides', async () => {
	const res = await processor.render(`
::::note
Note contents.

:::tip
Nested tip.
:::

::::
`);
	expect(res.code).toMatchFileSnapshot('./asides/nested-asides.html');
});
