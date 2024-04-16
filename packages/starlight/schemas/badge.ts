import { z } from 'astro/zod';

export const badgeSchema = () =>
	z.object({
		variant: z.enum(['note', 'danger', 'success', 'caution', 'tip', 'default']).default('default'),
		text: z.string(),
		class: z.string().optional(),
	});

export const BadgeComponentSchema = badgeSchema().extend({
	size: z.enum(['small', 'medium', 'large']).default('small'),
});

export const BadgeConfigSchema = () =>
	z
		.union([z.string(), badgeSchema()])
		.transform((badge) => {
			if (typeof badge === 'string') {
				return { variant: 'default' as const, text: badge };
			}
			return badge;
		})
		.optional();

export type Badge = z.output<ReturnType<typeof badgeSchema>>;
