import { z } from 'astro/zod';

const defaults = { minHeadingLevel: 2, maxHeadingLevel: 3 };

export type TableOfContentsUserConfig =
	| boolean
	| {
			/** The level to start including headings at in the table of contents. Default: 2. */
			minHeadingLevel?: number | undefined;
			/** The level to stop including headings at in the table of contents. Default: 3. */
			maxHeadingLevel?: number | undefined;
	  }
	| undefined;

export const TableOfContentsSchema = () =>
	z
		.union([
			z.object({
				minHeadingLevel: z.number().int().min(1).max(6).optional().default(2),
				maxHeadingLevel: z.number().int().min(1).max(6).optional().default(3),
			}),
			z.boolean().transform((enabled) => (enabled ? defaults : false)),
		])
		.default(defaults)
		.refine((toc) => (toc ? toc.minHeadingLevel <= toc.maxHeadingLevel : true), {
			message: 'minHeadingLevel must be less than or equal to maxHeadingLevel',
		});
