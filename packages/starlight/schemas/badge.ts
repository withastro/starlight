import { z } from 'astro/zod';

const badgeSchema = () =>
	z.object({
		variant: z.enum(['blue', 'pink', 'green', 'yellow', 'purple']).default('blue'),
		text: z.string(),
	});

export const BadgeConfigSchema = () => z.union([z.string(), badgeSchema()]).optional();

export type Badge = z.output<ReturnType<typeof badgeSchema>>;
