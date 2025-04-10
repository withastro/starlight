import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/basics/');

test('renders the same content for Markdown headings and Astro component', async ({
	getProdServer,
	page,
}) => {
	const starlight = await getProdServer();
	await starlight.goto('/anchor-heading');
	const markdownContent = page.locator('.sl-markdown-content');
	const markdownHtml = await markdownContent.innerHTML();

	await starlight.goto('/anchor-heading-component');
	const componentContent = page.locator('.sl-markdown-content');
	const componentHtml = await componentContent.innerHTML();

	expect(markdownHtml).toEqual(componentHtml);
});
