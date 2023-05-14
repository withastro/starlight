import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://starlight.astro.build',
  integrations: [
    starlight({
      title: 'Starlight',
      editLink: {
        baseUrl: 'https://github.com/withastro/starlight/edit/main/docs/',
      },
      social: {
        github: 'https://github.com/withastro/starlight',
        discord: 'https://astro.build/chat',
      },
      head: [
        {
          tag: 'script',
          attrs: {
            src: 'https://cdn.usefathom.com/script.js',
            'data-site': 'EZBHTSIG',
            defer: true,
          },
        },
      ],
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
            { label: 'Environmental Impact', link: 'environmental-impact' },
          ],
        },
        {
          label: 'Guides',
          autogenerate: {
            directory: 'guides',
          },
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
