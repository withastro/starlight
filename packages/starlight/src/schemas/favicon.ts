import { extname } from 'node:path';
import { z } from 'astro/zod';

const faviconTypeMap = {
	'.ico': 'image/x-icon',
	'.gif': 'image/gif',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
};

export type FaviconUserConfig = string | undefined;

export const FaviconSchema = () =>
	z
		.string()
		.default('/favicon.svg')
		.transform((favicon, ctx) => {
			// favicon can be absolute or relative url
			const { pathname } = new URL(favicon, 'https://example.com');
			const ext = extname(pathname).toLowerCase();

			if (!isFaviconExt(ext)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'favicon must be a .ico, .gif, .jpg, .png, or .svg file',
				});

				return z.NEVER;
			}

			return {
				href: favicon,
				type: faviconTypeMap[ext],
			};
		});

function isFaviconExt(ext: string): ext is keyof typeof faviconTypeMap {
	return ext in faviconTypeMap;
}
