import { extname,  } from 'node:path';
import { z } from 'astro/zod';

const faviconTypeMap = {
	'.ico': 'image/x-icon',
	'.gif': 'image/gif',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
};

function isFaviconExt(ext: string): ext is keyof typeof faviconTypeMap {
	return ext in faviconTypeMap;
}

export const FaviconSchema = () =>
	z
		.string()
		.default('/favicon.svg')
		.transform((favicon, ctx) => {
			const ext = extname(favicon).toLowerCase();
			// Return error when favicon isn't the file type accepted
			if (!isFaviconExt(ext)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'favicon must be a .ico, .gif, .jpg, .png, or .svg file',
				});

				return z.NEVER;
			}
			// check for both http and https
			if (/^https?:\/\//.test(favicon)) {
                ctx.addIssue({
					// Show error message
                    code: z.ZodIssueCode.custom,
                    message: 'Favicons must be a relative URL with a .ico, .gif, .jpg, .png, or .svg file.',
                });
                return z.NEVER;
            }
			// If it is a relative link but with different format, reformat it.
			if (!favicon.startsWith('/')) {
                favicon = `/${favicon}`;
            }

			// Return the relative path (correctly formatted)
			return {
				href: favicon,
				type: faviconTypeMap[ext],
			};
		})
		.describe(
			'The default favicon for your site which should be a path to an image in the `public/` directory.'
		);

