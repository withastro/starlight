import { z } from 'astro/zod';
import type { AstroBuiltinAttributes } from 'astro';
import type { HTMLAttributes } from 'astro/types';

const spanHTMLAttributesSchema = z.record(
	z.union([z.string(), z.number(), z.boolean(), z.undefined()])
) as z.Schema<Omit<HTMLAttributes<'span'>, keyof AstroBuiltinAttributes | 'children'>>;

const defaultSpanHTMLAttributesSchema = () => spanHTMLAttributesSchema.default({});

const badgeSchema = z.object({
	variant: z.enum(['note', 'danger', 'success', 'caution', 'tip', 'default']).default('default'),
	text: z.string(),
});

const badgeSideBarSchema = () =>
	badgeSchema.extend({
		class: z.string().optional(),
	});

export const BadgeComponentSchema = badgeSchema.extend({
	size: z.enum(['small', 'medium', 'large']).default('small'),
	attrs: defaultSpanHTMLAttributesSchema(),
});

export const BadgeConfigSchema = () =>
	z
		.union([z.string(), badgeSideBarSchema()])
		.transform((badge) => {
			if (typeof badge === 'string') {
				return { variant: 'default' as const, text: badge };
			}
			return badge;
		})
		.optional();

export type Badge = z.output<ReturnType<typeof badgeSideBarSchema>>;
export type BadgeProps = Partial<Omit<z.output<typeof BadgeComponentSchema>, 'text'>> & {
	text: string;
};
