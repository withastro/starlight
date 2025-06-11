import { expect, test } from 'vitest';
import { createMarkdownTestHelper, type AstroMarkdownOptions } from './setupMarkdown';

const title = 'Anchor Links Tests';
const astroMarkdownOptions: AstroMarkdownOptions = ['rehype'];

test('generates anchor link markup', async () => {
  const { renderMarkdown } = await createMarkdownTestHelper({
    userConfig: { title },
    astroMarkdownOptions,
  });

  const res = await renderMarkdown(`
## Some text
`);
  await expect(res.code).toMatchFileSnapshot('./snapshots/generates-anchor-link-markup.html');
});

test('generates an accessible link label', async () => {
  const { renderMarkdown } = await createMarkdownTestHelper({
    userConfig: {
      title,
      defaultLocale: 'en',
    },
    astroMarkdownOptions,
  });

  const res = await renderMarkdown(`
## Some text
`);
  expect(res.code).includes('<span class="sr-only">Section titled “Some text”</span>');
});

test('strips HTML markup in accessible link label', async () => {
  const { renderMarkdown } = await createMarkdownTestHelper({
    userConfig: {
      title,
    },
    astroMarkdownOptions,
  });

  const res = await renderMarkdown(`
## Some _important nested \`HTML\`_
`);
  // Heading renders HTML
  expect(res.code).includes('Some <em>important nested <code>HTML</code></em>');
  // Visually hidden label renders plain text
  expect(res.code).includes(
    '<span class="sr-only">Section titled “Some important nested HTML”</span>'
  );
});

test('localizes accessible label for the current language', async () => {
  const { renderMarkdown } = await createMarkdownTestHelper({
    userConfig: {
      title,
      defaultLocale: 'fr',
    },
    astroMarkdownOptions,
  });

  const res = await renderMarkdown(
    `
## Some text
`,
    { fileURL: new URL('./_src/content/docs/fr/index.md', import.meta.url) }
  );
  expect(res.code).includes('<span class="sr-only">Section intitulée « Some text »</span>');
});
