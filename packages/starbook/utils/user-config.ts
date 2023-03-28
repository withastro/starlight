import { z } from 'astro/zod';
import { parse as bcpParse, stringify as bcpStringify } from 'bcp-47';

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

const ProcessedLocaleSchema = LocaleSchema.required({ lang: true });

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
    .transform((locales, ctx) => {
      for (const key in locales) {
        const locale = locales[key]!;
        // Fall back to the key in the locales object as the lang.
        let lang = locale.lang || key;

        // Parse the lang tag so we can check it is valid according to BCP-47.
        const schema = bcpParse(lang, { forgiving: true });
        schema.region = schema.region?.toUpperCase();
        const normalizedLang = bcpStringify(schema);

        // Error if parsing the language tag failed.
        if (!normalizedLang) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Could not validate language tag "${lang}" at locales.${key}.lang.`,
          });
          return z.NEVER;
        }

        // Let users know we’re modifying their configured `lang`.
        if (normalizedLang !== lang) {
          console.warn(
            `Warning: using "${normalizedLang}" language tag for locales.${key}.lang instead of "${lang}".`
          );
          lang = normalizedLang;
        }

        // Set the final value as the normalized lang, based on the key if needed.
        locale.lang = lang;
      }
      return locales;
    })
    .optional()
    .describe('Configure locales for internationalization (i18n).'),
});

export type StarbookConfig = z.infer<typeof StarbookConfigSchema>;
