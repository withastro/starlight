import { defineCollection, z } from 'astro:content';

export function defineDocsCollection() {
  return defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  });
}
