import { z } from 'astro/zod';

export interface PagefindUserConfig {
	/**
	 * Configure how search results from the current website are weighted by Pagefind
	 * compared to results from other sites when using the `mergeIndex` option.
	 *
	 * @see https://pagefind.app/docs/multisite/#changing-the-weighting-of-individual-indexes
	 */
	indexWeight?: number | undefined;
	/** Configure how search result rankings are calculated by Pagefind. */
	ranking?: PagefindRankingUserConfig | undefined;
	/**
	 * Configure how search indexes from different sites are merged by Pagefind.
	 * Each entry of this array represents a `PagefindIndexOptions` from pagefind.
	 *
	 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
	 * @see https://github.com/CloudCannon/pagefind/blob/v1.3.0/pagefind_web_js/lib/coupled_search.ts#L549
	 */
	mergeIndex?:
		| {
				/**
				 * Set Pagefind’s `bundlePath` mergeIndex option.
				 *
				 * @see https://pagefind.app/docs/multisite/#searching-additional-sites-from-pagefind-ui
				 */
				bundlePath: string;
				/**
				 * Overrides the URL path that Pagefind uses to load its search bundle
				 */
				basePath?: string | undefined;
				/**
				 * Appends the given baseURL to all search results. May be a path, or a full domain
				 */
				baseUrl?: string | undefined;
				/**
				 * Multiply all rankings for this index by the given weight.
				 *
				 * @see https://pagefind.app/docs/multisite/#changing-the-weighting-of-individual-indexes
				 */
				indexWeight?: number | undefined;
				/**
				 * Apply this filter configuration to all search results from this index.
				 *
				 * Only applies in multisite setups.
				 *
				 * @see https://pagefind.app/docs/multisite/#filtering-results-by-index
				 */
				mergeFilter?: Record<string, string | [string, ...string[]]> | undefined;
				/**
				 * Language of this index.
				 *
				 * @see https://pagefind.app/docs/multisite/#merging-a-specific-language-index
				 */
				language?: string | undefined;
				/**
				 * Configure how search result rankings are calculated by Pagefind.
				 */
				ranking?: PagefindRankingUserConfig | undefined;
		  }[]
		| undefined;
}

interface PagefindRankingUserConfig {
	/**
	 * Set Pagefind’s `pageLength` ranking option.
	 *
	 * The default value is `0.1` and values must be in the range `0` to `1`.
	 *
	 * @see https://pagefind.app/docs/ranking/#configuring-page-length
	 */
	pageLength?: number | undefined;
	/**
	 * Set Pagefind’s `termFrequency` ranking option.
	 *
	 * The default value is `0.1` and values must be in the range `0` to `1`.
	 *
	 * @see https://pagefind.app/docs/ranking/#configuring-term-frequency
	 */
	termFrequency?: number | undefined;
	/**
	 * Set Pagefind’s `termSaturation` ranking option.
	 *
	 * The default value is `2` and values must be in the range `0` to `2`.
	 *
	 * @see https://pagefind.app/docs/ranking/#configuring-term-saturation
	 */
	termSaturation?: number | undefined;
	/**
	 * Set Pagefind’s `termSimilarity` ranking option.
	 *
	 * The default value is `9` and values must be greater than or equal to `0`.
	 *
	 * @see https://pagefind.app/docs/ranking/#configuring-term-similarity
	 */
	termSimilarity?: number | undefined;
}

const indexWeightSchema = z.number().nonnegative().optional();
const pagefindRankingWeightsSchema = z.object({
	pageLength: z.number().min(0).max(1).default(0.1),
	termFrequency: z.number().min(0).max(1).default(0.1),
	termSaturation: z.number().min(0).max(2).default(2),
	termSimilarity: z.number().min(0).default(9),
});
const pagefindIndexOptionsSchema = z.object({
	basePath: z.string().optional(),
	baseUrl: z.string().optional(),
	indexWeight: indexWeightSchema,
	mergeFilter: z.record(z.string(), z.string().or(z.array(z.string()).nonempty())).optional(),
	language: z.string().optional(),
	// We apply a default value to merged indexes in order to share the same ranking for them and the current site when not set explicitly.
	ranking: pagefindRankingWeightsSchema.default({}),
});

const pagefindSchema = z.object({
	indexWeight: indexWeightSchema,
	ranking: pagefindRankingWeightsSchema.default({}),
	mergeIndex: z
		.array(
			pagefindIndexOptionsSchema.extend({
				bundlePath: z.string(),
			})
		)
		.optional(),
});

export const PagefindConfigSchema = () => pagefindSchema;
export const PagefindConfigDefaults = () => pagefindSchema.parse({});
