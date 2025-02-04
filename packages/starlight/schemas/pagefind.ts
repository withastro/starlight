import { z } from 'astro/zod';

const indexWeightSchema = z.number().nonnegative().nullish();

const pagefindSchema = z.object({
	/**
	 * Set Pagefind’s `pageLength` ranking option.
	 * 
	 * Configure how search result in the current website are weighted by Pagefind
	 * compared to other sit'e's merge indexes.
	 *
	 * @see https://pagefind.app/docs/multisite/#changing-the-weighting-of-individual-indexes
	 */
	indexWeight: indexWeightSchema,
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
	/**
	 * Configure how search indexes from different sites are merged by Pagefind.
	 *
	 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
	 */
	mergeIndex: z
		.array(
			z.object({
				/**
				 * Set Pagefind’s `bundlePath` mergeIndex option.
				 *
				 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
				 */
				pageLength: z.string(),
				/**
				 * Set Pagefind’s `indexWeight` mergeIndex option.
				 *
				 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
				 */
				indexWeight: indexWeightSchema,
			}),
		)
		.nullish(),
});

export const PagefindConfigSchema = () => pagefindSchema;
export const PagefindConfigDefaults = () => pagefindSchema.parse({});
