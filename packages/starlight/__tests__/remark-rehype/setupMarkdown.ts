import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { starlightAutolinkHeadings } from '../../integrations/heading-links';
import { createTranslationSystemFromFs } from '../../utils/translations-fs';
import { absolutePathToLang as getAbsolutePathFromLang } from '../../integrations/shared/absolutePathToLang';
import { StarlightConfigSchema, type StarlightUserConfig } from '../../utils/user-config';
import { starlightAsides, remarkDirectivesRestoration } from '../../integrations/asides';

export type AstroMarkdownOptions = Array<'rehype' | 'remark'>;

export async function createMarkdownTestHelper({
  userConfig = {},
  remarkPlugins,
  rehypePlugins,
  astroMarkdownOptions = [],
}: {
  userConfig?: Partial<StarlightUserConfig>;
  remarkPlugins?: any[] | undefined;
  rehypePlugins?: any[] | undefined;
    astroMarkdownOptions: AstroMarkdownOptions;
}) {
  const starlightConfig = StarlightConfigSchema.parse({
    title: 'Markdown render Tests',
    locales: { en: { label: 'English' }, fr: { label: 'French' } },
    defaultLocale: 'en',
    ...userConfig,
  } satisfies StarlightUserConfig);

  const astroConfig = {
    root: new URL(import.meta.url),
    srcDir: new URL('./_src/', import.meta.url),
  };

  const useTranslations = createTranslationSystemFromFs(starlightConfig, {
    srcDir: astroConfig.srcDir,
  });

  const absolutePathToLang = (path: string) =>
    getAbsolutePathFromLang(path, { astroConfig, starlightConfig });

  const defaultRehypePlugins = [
    ...starlightAutolinkHeadings({
      starlightConfig,
      astroConfig: {
        srcDir: astroConfig.srcDir,
        experimental: { headingIdCompat: false },
      },
      useTranslations,
      absolutePathToLang,
    }),
  ];

  const defaultRemarkPlugins = [
    ...starlightAsides({
      starlightConfig,
      astroConfig,
      useTranslations,
      absolutePathToLang,
    }),
    // The restoration plugin is run after the asides and any other plugin that may have been
    // injected by Starlight plugins.
    remarkDirectivesRestoration,
  ];

  const processorOptions: Record<string, any> = {};

  if (astroMarkdownOptions.includes('rehype')) {
    processorOptions.rehypePlugins = rehypePlugins ?? defaultRehypePlugins;
  }

  if (astroMarkdownOptions.includes('remark')) {
    processorOptions.remarkPlugins = remarkPlugins ?? defaultRemarkPlugins;
  }

  const processor = await createMarkdownProcessor(processorOptions);

  function renderMarkdown(
    content: string,
    options: { fileURL?: URL } = {}
  ) {
    return processor.render(
      content,
      {
        // @ts-expect-error fileURL is part of MarkdownProcessor's options
        fileURL:
          options.fileURL ??
          new URL(`./_src/content/docs/index.md`, import.meta.url),
      }
    );
  }

  return { renderMarkdown, starlightConfig, processor };
}
