import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loader';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader('./src/content/docs'),
		schema: docsSchema(),
	}),
	i18n: defineCollection({
		loader: i18nLoader('./src/content/i18n'),
		schema: i18nSchema({
			extend: z.object({
				'component.preview': z.string().optional(),
			}),
		}),
	}),
};
