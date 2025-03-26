import { z } from 'astro/zod';
import { IconSchema } from './icon';

export const SocialLinksSchema = () =>
	z
		.object({ icon: IconSchema(), label: z.string().min(1), href: z.string() })
		.array()
		.optional();
