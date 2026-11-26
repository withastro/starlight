import { extname } from 'node:path';
import { z } from 'astro/zod';
import { isFaviconExt } from '../plugins/favicon/utils';

export type FaviconUserConfig = string | false | undefined;

export const FaviconSchema = () =>
	z
		.string()
		.superRefine((favicon, ctx) => {
			// favicon can be absolute or relative url
			const { pathname } = new URL(favicon, 'https://example.com');
			const ext = extname(pathname).toLowerCase();

			if (!isFaviconExt(ext)) {
				ctx.addIssue({
					code: 'custom',
					message: 'favicon must be a .ico, .gif, .jpg, .png, or .svg file',
					input: favicon,
				});
			}
		})
		.or(z.literal(false))
		.optional();
