import { z } from 'astro/zod';

const defaults = { minHeadingLevel: 2, maxHeadingLevel: 3 };

export const TableOfContentsSchema = () =>
	z
		.union([
			z.object({
				/** The level to start including headings at in the table of contents. Default: 2. */
				minHeadingLevel: z.int().min(1).max(6).optional().default(2),
				/** The level to stop including headings at in the table of contents. Default: 3. */
				maxHeadingLevel: z.int().min(1).max(6).optional().default(3),
			}),
			z.boolean().transform((enabled) => (enabled ? defaults : false)),
		])
		.default(defaults)
		.refine((toc) => (toc ? toc.minHeadingLevel <= toc.maxHeadingLevel : true), {
			error: 'minHeadingLevel must be less than or equal to maxHeadingLevel',
		});

/**
 * Schema for the `tableOfContents` frontmatter field.
 * Unlike `TableOfContentsSchema`, this does not include a `.default()` so that
 * `undefined` is preserved when the field is not set in frontmatter, allowing
 * the global config to be used as a fallback.
 */
export const FrontmatterTableOfContentsSchema = () =>
	z
		.union([
			z.object({
				/** The level to start including headings at in the table of contents. Default: 2. */
				minHeadingLevel: z.int().min(1).max(6).optional(),
				/** The level to stop including headings at in the table of contents. Default: 3. */
				maxHeadingLevel: z.int().min(1).max(6).optional(),
			}),
			z.boolean(),
		])
const TableOfContentsBaseSchema = z
	.union([
		z.object({
			/** The level to start including headings at in the table of contents. Default: 2. */
			minHeadingLevel: z.int().min(1).max(6).optional().default(2),
			/** The level to stop including headings at in the table of contents. Default: 3. */
			maxHeadingLevel: z.int().min(1).max(6).optional().default(3),
		}),
		z.boolean().transform((enabled) => (enabled ? defaults : false)),
	])
	.refine((toc) => (toc ? toc.minHeadingLevel <= toc.maxHeadingLevel : true), {
		error: 'minHeadingLevel must be less than or equal to maxHeadingLevel',
	});

export const UserConfigTableOfContentsSchema = () => TableOfContentsBaseSchema.default(defaults);

export const FrontmatterTableOfContentsSchema = () => TableOfContentsBaseSchema.optional();
