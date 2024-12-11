import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loader';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
