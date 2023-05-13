import { z } from 'astro/zod';
import { HeadConfigSchema } from './schemas/head';

export function docsSchema() {
  return z.object({
    /** The title of the current page. Required. */
    title: z.string(),

    /**
     * A short description of the current page’s content. Optional, but recommended.
     * A good description is 150–160 characters long and outlines the key content
     * of the page in a clear and engaging way.
     */
    description: z.string().optional(),

    /**
     * Custom URL where a reader can edit this page.
     * Overrides the `editLink.baseUrl` global config if set.
     *
     * Can also be set to `false` to disable showing an edit link on this page.
     */
    editUrl: z.union([z.string().url(), z.boolean()]).optional().default(true),

    /** Set custom `<head>` tags just for this page. */
    head: HeadConfigSchema(),
  });
}
