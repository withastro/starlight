import { z } from 'astro/zod';
import { IconSchema } from './icon';

const LinksSchema = z
	.object({ icon: IconSchema(), label: z.string().min(1), href: z.string() })
	.array()
	.optional();

export const SocialLinksSchema = () =>
	// Add a more specific error message to help people migrate from the old object syntax.
	// TODO: remove once most people have updated to v0.33 or higher (e.g. when releasing Starlight v1)
	z.preprocess((value, ctx) => {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'Starlight v0.33.0 changed the `social` configuration syntax. Please specify an array of link items instead of an object.\n' +
					'See the Starlight changelog for details: https://github.com/withastro/starlight/blob/main/packages/starlight/CHANGELOG.md#0330\n',
			});
		}
		return value;
	}, LinksSchema) as unknown as typeof LinksSchema;
