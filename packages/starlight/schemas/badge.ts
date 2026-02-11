import { z } from 'astro/zod';

const badgeBaseSchema = z.object({
	variant: z.enum(['note', 'danger', 'success', 'caution', 'tip', 'default']).default('default'),
	class: z.string().optional(),
});

const badgeSchema = z.object({
	...badgeBaseSchema.shape,
	text: z.string(),
});

const i18nBadgeSchema = z.object({
	...badgeBaseSchema.shape,
	text: z.union([z.string(), z.record(z.string(), z.string())]),
});

export const BadgeComponentSchema = z.looseObject({
	...badgeSchema.shape,
	size: z.enum(['small', 'medium', 'large']).default('small'),
});

export type BadgeComponentProps = z.input<typeof BadgeComponentSchema>;

export const BadgeConfigSchema = () =>
	z
		.union([z.string(), badgeSchema])
		.transform((badge) => {
			if (typeof badge === 'string') {
				return { variant: 'default' as const, text: badge };
			}
			return badge;
		})
		.optional();

export const I18nBadgeConfigSchema = () => z.union([z.string(), i18nBadgeSchema]).optional();

export type Badge = z.output<typeof badgeSchema>;
export type I18nBadge = z.output<typeof i18nBadgeSchema>;
export type I18nBadgeConfig = z.output<ReturnType<typeof I18nBadgeConfigSchema>>;
