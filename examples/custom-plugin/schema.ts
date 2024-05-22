import { z } from 'astro/zod';

export const i18nCustomPluginSchema = z.object({
	'plugin.test': z.string().optional(),
});
