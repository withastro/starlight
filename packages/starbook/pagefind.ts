import type {
  APIContext,
  GetStaticPathsResult,
  InferGetStaticPropsType,
} from 'astro';
import { getCollection } from 'astro:content';
import { slugToLang, slugToPathname } from './utils/slugs';
import pagefind from 'pagefind';

export async function getStaticPaths() {
  // Only run this endpoint during dev.
  if (!import.meta.env.DEV) return [];
  // This is imported dynamically as it fails during `astro build`.
  // StarBook runs the Pagefind binary as a post-build step instead of using this endpoint.
  // Ideally this could be replaced with some proper render API.
  const { renderMarkdown } = await import('@astrojs/markdown-remark');

  console.group('[pagefind]');
  console.log('Creating index…');
  const { index } = await pagefind.createIndex();
  if (!index) {
    console.error('Failed to create index.');
    console.groupEnd();
    return [];
  }
  console.log('Created index.');

  console.log('Indexing site pages…');
  const docs = await getCollection('docs');
  for (const doc of docs) {
    const path = slugToPathname(doc.slug) + 'index.html';
    const renderedMd = await renderMarkdown(doc.body, {});
    const content = `<html lang=${slugToLang(doc.slug)}>
      <head>
        <title>${doc.data.title}</title>
        <meta name="description" content=${doc.data.description} />
      </head>
      <body>
        <h1>${doc.data.title}</h1>
        ${renderedMd.code}
      </body>
    </html>`;
    await index.addHTMLFile({ path, content });
  }
  console.log('Indexed', docs.length, 'site pages.');

  console.log('Getting files…');
  const { errors, files } = await index.getFiles();
  console.log('Got', files.length, 'files.');
  if (errors.length > 0) {
    console.error('Got', errors.length, 'error(s).');
    errors.forEach((err) => console.error(err));
  }
  console.groupEnd();

  return files.map(({ path, content }) => {
    return { params: { path }, props: { content } };
  }) satisfies GetStaticPathsResult;
}

export function get({
  params,
  props,
}: APIContext<InferGetStaticPropsType<typeof getStaticPaths>>) {
  const { path } = params;
  const contentType = path?.endsWith('.js')
    ? 'application/javascript'
    : path?.endsWith('.json')
    ? 'application/json'
    : 'application/octet-stream';
  return new Response(props.content, {
    headers: { 'content-type': contentType },
  });
}
