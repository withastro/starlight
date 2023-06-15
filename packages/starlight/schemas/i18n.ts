import { z } from 'astro/zod';

export function i18nSchema() {
  return z
    .object({
      'skipLink.label': z
        .string()
        .describe(
          'Text displayed in the accessible “Skip link” when a keyboard user first tabs into a page.'
        ),

      'search.label': z.string().describe('Text displayed in the search bar.'),

      'search.shortcutLabel': z
        .string()
        .describe(
          'Accessible label for the shortcut key to open the search modal.'
        ),

      'search.cancelLabel': z
        .string()
        .describe('Text for the “Cancel” button that closes the search modal.'),

      'themeSelect.accessibleLabel': z
        .string()
        .describe('Accessible label for the theme selection dropdown.'),

      'themeSelect.dark': z.string().describe('Name of the dark color theme.'),

      'themeSelect.light': z
        .string()
        .describe('Name of the light color theme.'),

      'themeSelect.auto': z
        .string()
        .describe(
          'Name of the automatic color theme that syncs with system preferences.'
        ),

      'languageSelect.accessibleLabel': z
        .string()
        .describe('Accessible label for the language selection dropdown.'),

      'menuButton.accessibleLabel': z
        .string()
        .describe('Accessible label for he mobile menu button.'),

      'sidebarNav.accessibleLabel': z
        .string()
        .describe(
          'Accessible label for the main sidebar `<nav>` element to distinguish it fom other `<nav>` landmarks on the page.'
        ),

      'tableOfContents.onThisPage': z
        .string()
        .describe('Title for the table of contents component.'),

      'tableOfContents.overview': z
        .string()
        .describe(
          'Label used for the first link in the table of contents, linking to the page title.'
        ),

      'i18n.untranslatedContent': z
        .string()
        .describe(
          'Notice informing users they are on a page that is not yet translated to their language.'
        ),

      'page.editLink': z.string().describe('Text for the link to edit a page.'),

      'page.lastUpdated': z
        .string()
        .describe(
          'Text displayed in front of the last updated date in the page footer.'
        ),

      'page.previousLink': z
        .string()
        .describe(
          'Label shown on the “previous page” pagination arrow in the page footer.'
        ),

      'page.nextLink': z
        .string()
        .describe(
          'Label shown on the “next page” pagination arrow in the page footer.'
        ),
    })
    .partial();
}
