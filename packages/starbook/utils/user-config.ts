import { z } from 'astro/zod';

const LocaleSchema = z.object({
  /** The label for this language to show in UI, e.g. `"English"`, `"العربية"`, or `"简体中文"`. */
  label: z
    .string()
    .describe(
      'The label for this language to show in UI, e.g. `"English"`, `"العربية"`, or `"简体中文"`.'
    ),
  /** The BCP-47 tag for this language, e.g. `"en"`, `"ar"`, or `"zh-CN"`. */
  lang: z
    .string()
    .optional()
    .describe(
      'The BCP-47 tag for this language, e.g. `"en"`, `"ar"`, or `"zh-CN"`.'
    ),
  /** The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left. */
  dir: z
    .enum(['rtl', 'ltr'])
    .default('ltr')
    .optional()
    .describe(
      'The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left.'
    ),
});

export const StarbookConfigSchema = z.object({
  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: z
    .string()
    .describe(
      'Title for your website. Will be used in metadata and as browser tab title.'
    ),
  /** The tagline for your website. */
  tagline: z.string().optional().describe('The tagline for your website.'),
  /** Configure locales for internationalization (i18n). */
  locales: z
    .object({
      /** Configure a “root” locale to serve a default language from `/`. */
      root: LocaleSchema.required({ lang: true }).optional(),
    })
    .catchall(LocaleSchema)
    .optional()
    .describe('Configure locales for internationalization (i18n).'),
});

export type StarbookConfig = z.infer<typeof StarbookConfigSchema>;
