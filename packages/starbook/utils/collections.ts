import { getCollection } from 'astro:content';

/** All entries in the docs content collection. */
export const docs = await getCollection('docs');
