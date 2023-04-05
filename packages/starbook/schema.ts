import { defineCollection, z } from 'astro:content';

export function defineDocsCollection() {
  return defineCollection({
    schema: z.object({
      /** The title of the current page. Required. */
      title: z.string(),
      /**
       * A short description of the current page’s content. Optional, but recommended.
       * A good description is 150–160 characters long and outlines the key content
       * of the page in a clear and engaging way.
       */
      description: z.string().optional(),
    }),
  });
}
