import { z } from 'astro/zod';

export const TitleConfigSchema = () => z.union([z.string(), z.record(z.string(), z.string())]);

// transform the title for runtime use
export const TitleTransformConfigSchema = (defaultLang: string) =>
	TitleConfigSchema().transform((title, ctx) => {
		if (typeof title === 'string') {
			return { [defaultLang]: title };
		}
		if (!title[defaultLang] && title[defaultLang] !== '') {
			ctx.issues.push({
				code: 'custom',
				message: `Title must have a key for the default language "${defaultLang}"`,
				input: title,
			});
			return z.NEVER;
		}
		return title;
	});
