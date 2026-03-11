import { z } from 'astro/zod';
import type { StarlightExpressiveCodeOptions } from '../integrations/expressive-code';

export const ExpressiveCodeSchema = () =>
	z
		.union([
			z.custom<StarlightExpressiveCodeOptions>(
				(value) => typeof value === 'object' && (value as StarlightExpressiveCodeOptions)
			),
			z.boolean(),
		])
		.optional();
