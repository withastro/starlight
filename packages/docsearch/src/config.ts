import type { DocSearchClientOptions } from './index';
import { z } from 'astro/zod';

type SearchOptions = DocSearchClientOptions['searchParameters'];

/** DocSearch configuration options. */
export const DocSearchConfigSchema = z
	.strictObject({
		// Required config without which DocSearch won’t work.
		appId: z.string(),
		apiKey: z.string(),
		indexName: z.string(),
		// Optional DocSearch component config (only the serializable properties can be included here)
		maxResultsPerGroup: z.number().optional(),
		disableUserPersonalization: z.boolean().optional(),
		insights: z.boolean().optional(),
		searchParameters: z.custom<SearchOptions>().optional(),
	})
	.or(
		z.strictObject({
			clientOptionsModule: z.string(),
		})
	);
