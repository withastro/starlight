import { z } from 'astro/zod';

export function defineDocsCollection() {
  return {
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  };
}
