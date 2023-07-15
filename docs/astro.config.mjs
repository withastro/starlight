import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const locales = {
  root: { label: 'English', lang: 'en' },
  de: { label: 'Deutsch', lang: 'de' },
  es: { label: 'Español', lang: 'es' },
  ja: { label: '日本語', lang: 'ja' },
  fr: { label: 'Français', lang: 'fr' },
  it: { label: 'Italiano', lang: 'it' },
};

const site = 'https://starlight.astro.build/';

export default defineConfig({
  site,
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
        additional: [{
          displayName: "Astro",
          url: "https://astro.build",
          icon: '<svg viewBox="0 0 63 79" xmlns="http://www.w3.org/2000/svg"><path d="M19.4924 65.9282C15.6165 62.432 14.4851 55.0859 16.0999 49.7638C18.8998 53.1193 22.7793 54.1822 26.7977 54.7822C33.0013 55.7081 39.0937 55.3618 44.8565 52.5637C45.5158 52.2434 46.125 51.8174 46.8454 51.386C47.3861 52.9341 47.5268 54.497 47.338 56.0877C46.8787 59.9617 44.9251 62.9542 41.8177 65.2227C40.5752 66.13 39.2604 66.9411 37.9771 67.7967C34.0346 70.4262 32.9679 73.5095 34.4494 77.9946C34.4846 78.1038 34.5161 78.2131 34.5957 78.4797C32.5828 77.5909 31.1124 76.2965 29.9921 74.5946C28.8088 72.7984 28.2458 70.8114 28.2162 68.6615C28.2014 67.6152 28.2014 66.5597 28.0588 65.5282C27.7107 63.0135 26.5144 61.8876 24.2608 61.8227C21.9479 61.7561 20.1183 63.1672 19.6331 65.3893C19.5961 65.5597 19.5424 65.7282 19.4887 65.9263L19.4924 65.9282Z"/><path d="M0 51.3932C0 51.3932 10.5979 46.2433 21.2254 46.2433L29.2382 21.5069C29.5381 20.3106 30.4141 19.4977 31.4029 19.4977C32.3918 19.4977 33.2677 20.3106 33.5677 21.5069L41.5804 46.2433C54.1672 46.2433 62.8058 51.3932 62.8058 51.3932C62.8058 51.3932 44.8044 2.47586 44.7692 2.37772C44.2526 0.931458 43.3804 0 42.2045 0H20.6032C19.4273 0 18.5903 0.931458 18.0384 2.37772C17.9995 2.47401 0 51.3932 0 51.3932Z"/></svg>'
        }]
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
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: site + 'og.jpg?v=1' },
        },
        {
          tag: 'meta',
          attrs: { property: 'twitter:image', content: site + 'og.jpg?v=1' },
        },
      ],
      customCss: process.env.NO_GRADIENTS ? [] : ['./src/assets/landing.css'],
      locales,
      sidebar: [
        {
          label: 'Start Here',
          translations: {
            de: 'Beginne hier',
            es: 'Comienza aqui',
            ja: 'ここからはじめる',
            fr: 'Commencez ici',
            it: 'Inizia qui',
          },
          items: [
            {
              label: 'Getting Started',
              link: 'getting-started',
              translations: {
                de: 'Erste Schritte',
                es: 'Empezando',
                ja: '入門',
                fr: 'Mise en route',
                it: 'Iniziamo',
              },
            },
            {
              label: 'Environmental Impact',
              link: 'environmental-impact',
              translations: {
                // de: '',
                es: 'Documentación ecológica',
                ja: '環境への負荷',
                fr: 'Impact environnemental',
                it: 'Impatto ambientale',
              },
            },
            {
              label: 'Showcase',
              link: 'showcase',
              translations: {
                // de: '',
                // es: '',
                ja: 'ショーケース',
                // fr: '',
                // it: '',
              },
            },
          ],
        },
        {
          label: 'Guides',
          translations: { de: 'Anleitungen', es: 'Guías', ja: 'ガイド', fr: 'Guides', it: "Guide", },
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Reference',
          translations: {
            de: 'Referenz',
            es: 'Referencias',
            ja: 'リファレンス',
            fr: 'Référence',
            it: 'Riferimenti',
          },
          autogenerate: { directory: 'reference' },
        },
      ],
      lastUpdated: true,
    }),
  ],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
