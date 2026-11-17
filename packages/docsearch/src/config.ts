import type { DocSearchClientOptions } from './index';
import { z } from 'astro/zod';

export type DocSearchIndex = Exclude<DocSearchClientOptions['indices'][number], string>;

/** DocSearch configuration options. */
export const DocSearchConfigSchema = z
	.strictObject({
		// Required config without which DocSearch won’t work.
		appId: z.string(),
		apiKey: z.string(),
		indices: z
			.array(
				z.union([
					z.string(),
					z.strictObject({
						name: z.string(),
						searchParameters: z.custom<DocSearchIndex['searchParameters']>().optional(),
					}),
				])
			)
			.min(1),
		// Optional DocSearch component config (only the serializable properties can be included here)
		maxResultsPerGroup: z.number().optional(),
		disableUserPersonalization: z.boolean().optional(),
		insights: z.boolean().optional(),
	})
	.or(
		z.strictObject({
			clientOptionsModule: z.string(),
		})
	);
