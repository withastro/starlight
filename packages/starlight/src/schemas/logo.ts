import { z } from 'astro/zod';

export type LogoUserConfig =
	| {
			/** Source of the image file to use. */
			src: string;
			/** Alternative text description of the logo. */
			alt?: string | undefined;
			/** Set to `true` to hide the site title text and only show the logo. */
			replacesTitle?: boolean | undefined;
	  }
	| {
			/** Source of the image file to use in dark mode. */
			dark: string;
			/** Source of the image file to use in light mode. */
			light: string;
			/** Alternative text description of the logo. */
			alt?: string | undefined;
			/** Set to `true` to hide the site title text and only show the logo. */
			replacesTitle?: boolean | undefined;
	  }
	| undefined;

export const LogoConfigSchema = () =>
	z
		.union([
			z.object({
				src: z.string(),
				alt: z.string().default(''),
				replacesTitle: z.boolean().default(false),
			}),
			z.object({
				dark: z.string(),
				light: z.string(),
				alt: z.string().default(''),
				replacesTitle: z.boolean().default(false),
			}),
		])
		.optional();

export type LogoConfig = z.output<ReturnType<typeof LogoConfigSchema>>;
