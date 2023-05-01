import { defineConfig } from 'astro/config';
import starbook from 'starbook';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starbook({
      title: 'StarBook Docs',
      editLink: {
        baseUrl: 'https://github.com/withastro/starbook/edit/main/docs/',
      },
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        de: {
          label: 'Deutsch',
          lang: 'de',
        },
        'fr-ca': {
          label: 'Français canadien',
          lang: 'fr-CA',
        },
      },
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Welcome, world', link: '/' },
            { label: 'Getting Started', link: 'getting-started' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Internationalization (i18n)', link: 'guides/i18n' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
      ],
    }),
  ],
});
