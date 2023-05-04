import { defineCollection } from 'astro:content';
import { docsSchema } from 'starbook/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema(),
  }),
};
