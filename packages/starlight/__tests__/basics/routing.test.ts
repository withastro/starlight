import config from 'virtual:starlight/user-config';
import { expect, test } from 'vitest';
import { getRoutes } from '../../utils/routing-internals';
import { mockDoc } from '../test-utils';

test('test suite is using correct env', () => {
  expect(config.title).toBe('Basics');
});

const docs = [
  mockDoc('404.md', { title: 'Not found' }),
  mockDoc('index.mdx', { title: 'Home page' }),
  mockDoc('guides/authoring-content.md', { title: 'Authoring content' }),
];
const routes = getRoutes(docs);

test('route slugs are normalized', () => {
  const indexRoute = routes.find((route) => route.id.startsWith('index.md'));
  expect(indexRoute?.slug).toBe('');
});

test('routes are sorted by slug', () => {
  expect(routes[0]?.slug).toBe('');
});

test('routes contain copy of original doc as entry', () => {
  for (const route of routes) {
    const doc = docs.find((doc) => doc.id === route.id);
    if (!doc) throw new Error('Expected to find doc for route ' + route.id);
    // Compare without slug as slugs can be normalized.
    const { slug: _, ...entry } = route.entry;
    const { slug: __, ...input } = doc;
    expect(entry).toEqual(input);
  }
});

test('routes have locale data added', () => {
  for (const route of routes) {
    expect(route.lang).toBe('en');
    expect(route.dir).toBe('ltr');
    expect(route.locale).toBeUndefined();
  }
});
