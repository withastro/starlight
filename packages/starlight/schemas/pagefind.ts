import { z } from 'astro/zod';

const pagefindSchema = z.object({
	/** Configure how search result rankings are calculated by Pagefind. */
	ranking: z
		.object({
			/**
			 * Set Pagefind’s `pageLength` ranking option.
			 *
			 * The default value is `0.1` and values must be in the range `0` to `1`.
			 *
			 * @see https://pagefind.app/docs/ranking/#configuring-page-length
			 */
			pageLength: z.number().min(0).max(1).default(0.1),
			/**
			 * Set Pagefind’s `termFrequency` ranking option.
			 *
			 * The default value is `0.1` and values must be in the range `0` to `1`.
			 *
			 * @see https://pagefind.app/docs/ranking/#configuring-term-frequency
			 */
			termFrequency: z.number().min(0).max(1).default(0.1),
			/**
			 * Set Pagefind’s `termSaturation` ranking option.
			 *
			 * The default value is `2` and values must be in the range `0` to `2`.
			 *
			 * @see https://pagefind.app/docs/ranking/#configuring-term-saturation
			 */
			termSaturation: z.number().min(0).max(2).default(2),
			/**
			 * Set Pagefind’s `termSimilarity` ranking option.
			 *
			 * The default value is `9` and values must be greater than or equal to `0`.
			 *
			 * @see https://pagefind.app/docs/ranking/#configuring-term-similarity
			 */
			termSimilarity: z.number().min(0).default(9),
		})
		.default({}),
});

export const PagefindConfigSchema = () => pagefindSchema;
export const PagefindConfigDefaults = () => pagefindSchema.parse({});
