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
    .optional()
    .default('ltr')
    .describe(
      'The writing direction of this language; `"ltr"` for left-to-right (the default) or `"rtl"` for right-to-left.'
    ),
});

const SidebarLinkItemSchema = z.object({
  /** The visible label for this item in the sidebar. */
  label: z.string(),
  /** The link to this item’s content. Can be a relative link to local files or the full URL of an external page. */
  link: z.string(),
});
export type SidebarLinkItem = z.infer<typeof SidebarLinkItemSchema>;

const AutoSidebarGroupSchema = z.object({
  /** The visible label for this item in the sidebar. */
  label: z.string(),
  /** Enable autogenerating a sidebar category from a specific docs directory. */
  autogenerate: z.object({
    /** The directory to generate sidebar items for. */
    directory: z.string(),
    // TODO: not supported by Docusaurus but would be good to have
    /** How many directories deep to include from this directory in the sidebar. Default: `Infinity`. */
    // depth: z.number().optional(),
  }),
});
export type AutoSidebarGroup = z.infer<typeof AutoSidebarGroupSchema>;

type ManualSidebarGroup = {
  /** The visible label for this item in the sidebar. */
  label: string;
  /** Array of links and subcategories to display in this category. */
  items: Array<
    | SidebarLinkItem
    | z.infer<typeof AutoSidebarGroupSchema>
    | ManualSidebarGroup
  >;
};

const ManualSidebarGroupSchema: z.ZodType<ManualSidebarGroup> = z.object({
  /** The visible label for this item in the sidebar. */
  label: z.string(),
  /** Array of links and subcategories to display in this category. */
  items: z.lazy(() =>
    z
      .union([
        SidebarLinkItemSchema,
        ManualSidebarGroupSchema,
        AutoSidebarGroupSchema,
      ])
      .array()
  ),
});

const SidebarItemSchema = z.union([
  SidebarLinkItemSchema,
  ManualSidebarGroupSchema,
  AutoSidebarGroupSchema,
]);
export type SidebarItem = z.infer<typeof SidebarItemSchema>;

const SidebarGroupSchema: z.ZodType<
  ManualSidebarGroup | z.infer<typeof AutoSidebarGroupSchema>
> = z.union([ManualSidebarGroupSchema, AutoSidebarGroupSchema]);

const StarbookUserConfigSchema = z.object({
  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: z
    .string()
    .describe(
      'Title for your website. Will be used in metadata and as browser tab title.'
    ),

  /** Description metadata for your website. Can be used in page metadata. */
  description: z
    .string()
    .optional()
    .describe(
      'Description metadata for your website. Can be used in page metadata.'
    ),

  /** Optional details about the social media accounts for this site. */
  social: z
    .object({
      /** Main Twitter handle for this site, e.g. `'astrodotbuild'`. */
      twitter: z.string().optional(),
    })
    .optional(),

  /** The tagline for your website. */
  tagline: z.string().optional().describe('The tagline for your website.'),

  /** Configure the defaults for the table of contents on each page. */
  tableOfContents: z
    .object({
      /** The level to start including headings at in the table of contents. Default: 2. */
      minHeadingLevel: z.number().int().min(1).max(6).optional().default(2),
      /** The level to stop including headings at in the table of contents. Default: 3. */
      maxHeadingLevel: z.number().int().min(1).max(6).optional().default(3),
    })
    .optional()
    .default({ minHeadingLevel: 2, maxHeadingLevel: 3 })
    .refine((toc) => toc.minHeadingLevel <= toc.maxHeadingLevel, {
      message: 'minHeadingLevel must be less than or equal to maxHeadingLevel',
    }),

  /** Enable and configure “Edit this page” links. */
  editLink: z
    .object({
      /** Set the base URL for edit links. The final link will be `baseUrl` + the current page path. */
      baseUrl: z.string().url().optional(),
    })
    .optional()
    .default({}),

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

  /**
   * Specify the default language for this site.
   *
   * The default locale will be used to provide fallback content where translations are missing.
   */
  defaultLocale: z.string().optional(),

  /** Configure your site’s sidebar navigation items. */
  sidebar: SidebarGroupSchema.array().optional(),

  /**
   * Provide CSS files to customize the look and feel of StarBook.
   *
   * Supports local CSS files relative to the root of your project,
   * e.g. `'/src/custom.css'`, and CSS you installed as an npm
   * module, e.g. `'@fontsource/roboto'`.
   *
   * @example
   * starbook({
   *  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
   * })
   */
  customCss: z.string().array().optional().default([]),
});

export const StarbookConfigSchema = StarbookUserConfigSchema.strict().transform(
  ({ locales, defaultLocale, ...config }, ctx) => {
    if (locales !== undefined && Object.keys(locales).length > 1) {
      // This is a multilingual site (more than one locale configured).
      // Make sure we can find the default locale and if not, help the user set it.
      // We treat the root locale as the default if present and no explicit default is set.
      const defaultLocaleConfig = locales[defaultLocale || 'root'];

      if (!defaultLocaleConfig) {
        const availableLocales = Object.keys(locales)
          .map((l) => `"${l}"`)
          .join(', ');
        ctx.addIssue({
          code: 'custom',
          message:
            'Could not determine the default locale. ' +
            'Please make sure `defaultLocale` in your StarBook config is one of ' +
            availableLocales,
        });
        return z.NEVER;
      }

      return {
        ...config,
        /** Flag indicating if this site has multiple locales set up. */
        isMultilingual: true,
        /** Full locale object for this site’s default language. */
        defaultLocale: { ...defaultLocaleConfig, locale: defaultLocale },
        locales,
      } as const;
    }

    // This is a monolingual site, so things are pretty simple.
    return {
      ...config,
      /** Flag indicating if this site has multiple locales set up. */
      isMultilingual: false,
      /** Full locale object for this site’s default language. */
      defaultLocale: undefined,
      locales: undefined,
    } as const;
  }
);

export type StarbookConfig = z.infer<typeof StarbookConfigSchema>;
export type StarBookUserConfig = z.input<typeof StarbookConfigSchema>;
