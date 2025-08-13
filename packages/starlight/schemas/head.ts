import { z } from 'astro/zod';

export const HeadConfigSchema = () =>
	z
		.array(
			z
				.object({
					/** Name of the HTML tag to add to `<head>`, e.g. `'meta'`, `'link'`, or `'script'`. */
					tag: z.enum(['title', 'base', 'link', 'style', 'meta', 'script', 'noscript', 'template']),
					/** Attributes to set on the tag, e.g. `{ rel: 'stylesheet', href: '/custom.css' }`. */
					attrs: z.record(z.union([z.string(), z.boolean(), z.undefined()])).optional(),
					/** Content to place inside the tag (optional). */
					content: z.string().optional(),
				})
				.superRefine((config, ctx) => {
					if (config.tag !== 'meta' || config.content === undefined) return;
					const { content, ...rest } = config;
					ctx.addIssue({
						code: 'custom',
						message:
							`The \`head\` configuration includes a \`meta\` tag with \`content\` which is invalid HTML.\n` +
							`You should instead use a \`content\` attribute ` +
							(Object.keys(rest.attrs ?? {}).length === 0
								? 'with an additional attribute to identify the kind of metadata it represents '
								: '') +
							`in the \`attrs\` object:\n\n` +
							JSON.stringify(
								{
									...rest,
									attrs: { ...(config.attrs ?? { name: 'identifier' }), content: config.content },
								},
								null,
								2
							),
					});
				})
		)
		.default([]);

export type HeadUserConfig = z.input<ReturnType<typeof HeadConfigSchema>>;
export type HeadConfig = z.output<ReturnType<typeof HeadConfigSchema>>;
