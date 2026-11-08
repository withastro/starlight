import type { DocSearchClientOptions } from './index';
import { z } from 'astro/zod';

// We explicitly use an interface here instead of a type alias to ensure that the declaration files
// use a local name for the type rather than referencing the external `@algolia/client-search` type
// as we don't depend on this package directly.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SearchOptions extends NonNullable<DocSearchClientOptions['searchParameters']> {}

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
