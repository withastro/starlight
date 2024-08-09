import { defineCollection, z } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
// TODO(HiDeoo) remove me
import { i18nCustomPluginSchema } from 'starlight-custom-plugin/schema';

export const collections = {
	docs: defineCollection({ schema: docsSchema() }),
	// TODO(HiDeoo) Restore this
	// i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
	i18n: defineCollection({
		type: 'data',
		schema: i18nSchema({
			extend: z
				.object({
					'user.test': z.string().optional(),
				})
				.merge(i18nCustomPluginSchema),
		}),
	}),
};
