import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://starlight.astro.build',
  integrations: [
    starlight({
      title: 'Starlight',
      logo: {
        light: '/src/assets/logo-light.svg',
        dark: '/src/assets/logo-dark.svg',
        replacesTitle: true,
      },
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
        root: { label: 'English', lang: 'en' },
        de: { label: 'Deutsch', lang: 'de' },
        es: { label: 'Español', lang: 'es' },
        ja: { label: '日本語', lang: 'ja' },
      },
      sidebar: [
        {
          label: 'Start Here',
          translations: { de: 'Beginne hier', es: 'Comienza aqui', ja: 'ここから始める' },
          items: [
            { label: 'Welcome, world', link: '/' },
            { label: 'Getting Started', link: 'getting-started' },
            { label: 'Environmental Impact', link: 'environmental-impact' },
          ],
        },
        {
          label: 'Guides',
          translations: { de: 'Anleitungen', es: 'Guías', ja: 'ガイド' },
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Reference',
          translations: { de: 'Referenz', es: 'Referencias', ja: 'リファレンス' },
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
});
