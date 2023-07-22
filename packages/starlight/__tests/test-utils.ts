import { z } from 'astro/zod';
import { docsSchema } from '../schema';
import type { StarlightDocsEntry } from '../utils/routing';

const frontmatterSchema = docsSchema()({
  image: () =>
    z.object({
      src: z.string(),
      width: z.number(),
      height: z.number(),
      format: z.union([
        z.literal('png'),
        z.literal('jpg'),
        z.literal('jpeg'),
        z.literal('tiff'),
        z.literal('webp'),
        z.literal('gif'),
        z.literal('svg'),
      ]),
    }),
});

export function mockDoc(
  id: StarlightDocsEntry['id'],
  data: z.input<typeof frontmatterSchema>,
  body = ''
): StarlightDocsEntry {
  return {
    id,
    slug: id.replace(/\.[^\.]+$/, '').replace(/\/index$/, ''),
    body,
    collection: 'docs',
    data: frontmatterSchema.parse(data),
    render: (() => {}) as StarlightDocsEntry['render'],
  };
}
