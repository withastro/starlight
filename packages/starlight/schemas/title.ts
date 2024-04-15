import { z } from 'astro/zod';

export const TitleConfigSchema = () =>
	z
		.union([z.string(), z.record(z.string())])
		.describe('Title for your website. Will be used in metadata and as browser tab title.');

// transform the title for runtime use
export const TitleTransformConfigSchema = (defaultLang: string) =>
	z.union([z.string(), z.record(z.string())]).transform((title, ctx) => {
		if (typeof title === 'string') {
			return { [defaultLang]: title };
		}
		if (!title[defaultLang]) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Title must have a key for the default language "${defaultLang}"`,
			});
			return z.NEVER;
		}
		return title;
	});

export type TitleUserConfig = z.input<ReturnType<typeof TitleConfigSchema>>;
export type TitleConfig = z.output<ReturnType<typeof TitleConfigSchema>>;
