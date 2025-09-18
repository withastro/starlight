import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// A collection not handled by Starlight.
	reviews: defineCollection({
		loader: glob({ base: './src/content/reviews', pattern: `**/[^_]*.{md,mdx}` }),
		schema: z.object({ title: z.string() }),
	}),
};
