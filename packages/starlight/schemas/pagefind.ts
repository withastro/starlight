import { z } from 'astro/zod';

const indexWeightSchema = z.number().nonnegative().optional();
const pagefindRankingWeightsSchema = z.object({
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
});
const pagefindIndexOptionsSchema = z.object({
	/**
	 * Overrides the URL path that Pagefind uses to load its search bundle
	 */
	basePath: z.string().optional(),
	/**
	 * Appends the given baseURL to all search results. May be a path, or a full domain
	 */
	baseUrl: z.string().optional(),
	/**
	 * Multiply all rankings for this index by the given weight.
	 *
	 * @see https://pagefind.app/docs/multisite/#changing-the-weighting-of-individual-indexes
	 */
	indexWeight: indexWeightSchema,
	/**
	 * Apply this filter configuration to all search results from this index.
	 *
	 * Only applies in multisite setups.
	 *
	 * @see https://pagefind.app/docs/multisite/#filtering-results-by-index
	 */
	mergeFilter: z.record(z.string(), z.string().or(z.array(z.string()).nonempty())).optional(),
	/**
	 * Language of this index.
	 *
	 * @see https://pagefind.app/docs/multisite/#merging-a-specific-language-index
	 */
	language: z.string().optional(),
	/**
	 * Configure how search result rankings are calculated by Pagefind.
	 */
	// We apply a default value to merged indexes in order to share the same ranking for them and the current site when not set explicitly.
	ranking: pagefindRankingWeightsSchema.default({}),
});

const pagefindSchema = z.object({
	/**
	 * Configure how search results from the current website are weighted by Pagefind
	 * compared to results from other sites when using the `mergeIndex` option.
	 *
	 * @see https://pagefind.app/docs/multisite/#changing-the-weighting-of-individual-indexes
	 */
	indexWeight: indexWeightSchema,
	/** Configure how search result rankings are calculated by Pagefind. */
	ranking: pagefindRankingWeightsSchema.default({}),
	/**
	 * Configure how search indexes from different sites are merged by Pagefind.
	 *
	 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
	 */
	mergeIndex: z
		.array(
			/**
			 * Each entry of this array represents a `PagefindIndexOptions` from pagefind.
			 *
			 * @see https://github.com/CloudCannon/pagefind/blob/v1.3.0/pagefind_web_js/lib/coupled_search.ts#L549
			 */
			pagefindIndexOptionsSchema.extend({
				/**
				 * Set Pagefind’s `bundlePath` mergeIndex option.
				 *
				 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
				 */
				bundlePath: z.string(),
			})
		)
		.optional(),
});

export const PagefindConfigSchema = () => pagefindSchema;
export const PagefindConfigDefaults = () => pagefindSchema.parse({});
