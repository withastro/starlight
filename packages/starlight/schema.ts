import { z } from 'astro/zod';
import { HeadConfigSchema } from './schemas/head';
import { TableOfContentsSchema } from './schemas/tableOfContents';
import { Icons } from './components/Icons';
export { i18nSchema } from './schemas/i18n';

type IconName = keyof typeof Icons;
const iconNames = Object.keys(Icons) as [IconName, ...IconName[]];

type ImageFunction = () => z.ZodObject<{
  src: z.ZodString;
  width: z.ZodNumber;
  height: z.ZodNumber;
  format: z.ZodUnion<
    [
      z.ZodLiteral<'png'>,
      z.ZodLiteral<'jpg'>,
      z.ZodLiteral<'jpeg'>,
      z.ZodLiteral<'tiff'>,
      z.ZodLiteral<'webp'>,
      z.ZodLiteral<'gif'>,
      z.ZodLiteral<'svg'>
    ]
  >;
}>;

export function docsSchema() {
  return ({ image }: { image: ImageFunction }) =>
    z.object({
      /** The title of the current page. Required. */
      title: z.string(),

      /**
       * A short description of the current page’s content. Optional, but recommended.
       * A good description is 150–160 characters long and outlines the key content
       * of the page in a clear and engaging way.
       */
      description: z.string().optional(),

      /**
       * Custom URL where a reader can edit this page.
       * Overrides the `editLink.baseUrl` global config if set.
       *
       * Can also be set to `false` to disable showing an edit link on this page.
       */
      editUrl: z
        .union([z.string().url(), z.boolean()])
        .optional()
        .default(true),

      /** Set custom `<head>` tags just for this page. */
      head: HeadConfigSchema(),

      /** Override global table of contents configuration for this page. */
      tableOfContents: TableOfContentsSchema().optional(),

      /**
       * Set the layout style for this page.
       * Can be `'doc'` (the default) or `'splash'` for a wider layout without any sidebars.
       */
      template: z.enum(['doc', 'splash']).default('doc'),

      /** Display a hero section on this page. */
      hero: z
        .object({
          /**
           * The large title text to show. If not provided, will default to the top-level `title`.
           * Can include HTML.
           */
          title: z.string().optional(),
          /**
           * A short bit of text about your project.
           * Will be displayed in a smaller size below the title.
           */
          tagline: z.string().optional(),
          /** The image to use in the hero. You can provide either a relative `file` path or raw `html`. */
          image: z
            .object({
              /** Alt text for screenreaders and other assistive technologies describing your hero image. */
              alt: z.string().default(''),
              /** Relative path to an image file in your repo, e.g. `../../assets/hero.png`. */
              file: image().optional(),
              /** Raw HTML string instead of an image file. Useful for inline SVGs or more complex hero content. */
              html: z.string().optional(),
            })
            .optional(),
          /** An array of call-to-action links displayed at the bottom of the hero. */
          actions: z
            .object({
              /** Text label displayed in the link. */
              text: z.string(),
              /** Value for the link’s `href` attribute, e.g. `/page` or `https://mysite.com`. */
              link: z.string(),
              /** Button style to use. One of `primary`, `secondary`, or `minimal` (the default). */
              variant: z
                .enum(['primary', 'secondary', 'minimal'])
                .default('minimal'),
              /**
               * An optional icon to display alongside the link text.
               * Can be an inline `<svg>` or the name of one of Starlight’s built-in icons.
               */
              icon: z
                .union([z.enum(iconNames), z.string().startsWith('<svg')])
                .transform((icon) => {
                  const parsedIcon = z.enum(iconNames).safeParse(icon);
                  return parsedIcon.success
                    ? ({ type: 'icon', name: parsedIcon.data } as const)
                    : ({ type: 'raw', html: icon } as const);
                })
                .optional(),
            })
            .array()
            .default([]),
        })
        .optional(),
    });
}
