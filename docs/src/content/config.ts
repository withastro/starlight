import { defineCollection } from 'astro:content';
import { docsSchema } from 'starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema(),
  }),
};
