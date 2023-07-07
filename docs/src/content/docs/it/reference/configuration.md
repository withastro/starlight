---
title: Riferimenti configurazione
description: Una panoramica sulle configurazione supportate da Starlight.
---

## Configurare l'integrazione `starlight`

Starlight è un'integrazione costruita sul framework [Astro](https://astro.build). Puoi configurare il tuo progetto nel file `astro.config.mjs` :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Il mio delizioso sito per documentazione',
    }),
  ],
});
```

Puoi configurare le seguenti opzioni nell'integrazione `starlight`.

### `title` (obbligatorio)

**type:** `string`

Definisce il titolo del tuo sito. Sarà usato nei metadati e nel titolo della finestra.

### `description`

**type:** `string`

Definisce la descrizione del tuo sito. Sarà usato nei metadati condivisi con le engine di ricerca nel tag `<meta name="description">` se `description` non è specificato nell'intestazione della pagina.

### `logo`

**type:** [`LogoConfig`](#logoconfig)

Definisce il logo da rappresentare nella barra di navigazione con o al posto del nome del sito. Puoi definire un singolo `src` o indicare due separate immagini per `light` e `dark`.

```js
starlight({
  logo: {
    src: '/src/assets/my-logo.svg',
  },
});
```

#### `LogoConfig`

```ts
type LogoConfig = { alt?: string; replacesTitle?: boolean } & (
  | { src: string }
  | { light: string; dark: string }
);
```

### `tableOfContents`

**type:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`  
**default:** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

Configura la tabella dei contenuti vista a destra di ogni pagina. Per predefinite, i titoli `<h2>` e `<h3>` saranno incluse in essa.

### `editLink`

**type:** `{ baseUrl: string }`

Abilita il link "Modifica questa pagina" definendo l'URL base da usare. Il link finale sarà `editLink.baseUrl` + il percorso corrente. Per esempio, per abilitare la possibilità di modificare la repository `withastro/starlight` su GitHub:

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

Con questa configurazione, una pagina `/introduction` avrà un link di modifica a `https://github.com/withastro/starlight/edit/main/src/docs/introduction.md`.

### `sidebar`

**type:** [`SidebarGroup[]`](#sidebargroup)

Configura la barra laterale di navigazione del tuo sito.

Una barra laterale è un array di gruppi, ognuno avente un `label` e o un array `items` o un oggetto `autogenerate`.

Puoi manualmente impostare i contenuti di un gruppo con `items`, che è un array che può includere link e sottogruppi. Puoi anche automaticamente generare i contenuti di un gruppo da una specifica cartella della documentazione utilizzando `autogenerate`.

```js
starlight({
  sidebar: [
    // Un gruppo intitolato "Inizia qui" contenente due link.
    {
      label: 'Inizia qui',
      items: [
        { label: 'Introduzione', link: '/intro' },
        { label: 'Prossimi passi', link: '/next-steps' },
      ],
    },
    // Un gruppo che si riferisce a tutte le pagine nella cartella reference.
    {
      label: 'Riferimenti',
      autogenerate: { directory: 'reference' },
    },
  ],
});
```

#### Ordinamento

I gruppi generati automaticamente sono ordinati alfabeticamente.
Per esempio, una pagina generata da `astro.md` apparirà sopra a quella generata da `starlight.md`.

#### Tradurre i titoli

Se il tuo sito è multilingua, ogni elemento di `label` è considerato come appartenente alla lingua di default. Puoi definire `translations` per fornire i titoli per le altre lingue:

```js
sidebar: [
  // Un esempio di barra laterale con traduzioni in italiano.
  {
    label: 'Start here',
    translations: { it: 'Inizia qui' },
    items: [
      {
        label: 'Getting Started',
        translations: { it: 'Iniziamo' },
        link: '/getting-started',
      },
      {
        label: 'Project Structure',
        translations: { it: 'Struttura del progetto' },
        link: '/structure',
      },
    ],
  },
];
```

#### `SidebarGroup`

```ts
type SidebarGroup =
  | {
      label: string;
      translations?: Record<string, string>;
      items: Array<LinkItem | SidebarGroup>;
    }
  | {
      label: string;
      translations?: Record<string, string>;
      autogenerate: {
        directory: string;
      };
    };
```

#### `LinkItem`

```ts
interface LinkItem {
  label: string;
  link: string;
}
```

### `locales`

**type:** <code>{ \[dir: string\]: [LocaleConfig](#localeconfig) }</code>

[Configura l'internazionalizzazione (i18n)](/it/guides/i18n/) del sito impostando quali `locales` sono supportati.

Ogni elemento deve utilizzare come chiave la cartella dove i file della lingua associata si trovano.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Site',
      // Imposta inglese come il linguaggio predefinito.
      defaultLocale: 'en',
      locales: {
        // La documentazione in inglese si trova in `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // La documentazione in cinese semplificato si trova in `src/content/docs/zh/`
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // La documentazione in arabo si trova in `src/content/docs/ar/`
        ar: {
          label: 'العربية',
          dir: 'rtl',
        },
      },
    }),
  ],
});
```

#### `LocaleConfig`

```ts
interface LocaleConfig {
  label: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}
```

Puoi impostare le seguenti opzioni per ogni locale:

##### `label` (obbligatorio)

**type:** `string`

L'etichetta per questa lingua da rappresentare agli utenti, per esempio nel selettore di lingue. Spesso vorrai usare il nome della lingua per come l'utente si aspetta di leggere, per esempio `"English"`, `"العربية"`, o `"简体中文"`.

##### `lang`

**type:** `string`

Il tag BCP-47 per la lingua, per esempio `"en"`, `"ar"`, o `"zh-CN"`. Se non lo imposti sarà utilizzato il nome della cartella.

##### `dir`

**type:** `'ltr' | 'rtl'`

Il verso di scrittura della lingua; `"ltr"` per sinistra a destra (predefinita) e `"rtl"` per destra a sinistra.

#### Lingua principale

Puoi definire un linguaggio principale senza una cartella `/lang/` definendo `root`:

```js
starlight({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    it: {
      label: 'Italiano',
    },
  },
});
```

Per esempio, questo ti permette di fornire `/getting-started/` come un percorso in inglese e `/it/getting-started/` come quello equivalente in italiano.

### `defaultLocale`

**type:** `string`

Definisce la lingua predefinita del sito.
Il valore deve corrispondere ad una chiave di [`locales`](#locales).
(Se la lingua predefinita è il [root](#lingua-principale), non è necessario).

Verrà utilizzato come fallback per le pagine non tradotte.

### `social`

**type:** `{ discord?: string; github?: string; mastodon?: string; twitter?: string }`

Dettagli opzionali per gli account social del sito. Se vengono aggiunti apparirà l'icona corrispondente nella barra superiore.

```js
starlight({
  social: {
    discord: 'https://astro.build/chat',
    github: 'https://github.com/withastro/starlight',
    mastodon: 'https://m.webtoo.ls/@astro',
    twitter: 'https://twitter.com/astrodotbuild',
  },
});
```

### `customCss`

**type:** `string[]`

Utilizza file CSS aggiuntivi per personalizzare il sito Starlight.

Supporta file CSS locali relativi alla cartella principale del progetto, ad esempio `'/src/custom.css'`, e CSS installato come modulo npm, per esempio `'@fontsource/roboto'`.

```js
starlight({
  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**type:** [`HeadConfig[]`](#headconfig)

Aggiunge tag all'`<head>` del sito Starlight.
Può essere utile per aggiungere script e risorse di terze parti.

```js
starlight({
  head: [
    // Esempio : aggiunge Fathom analytics.
    {
      tag: 'script',
      attrs: {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'MY-FATHOM-ID',
        defer: true,
      },
    },
  ],
});
```

#### `HeadConfig`

```ts
interface HeadConfig {
  tag: string;
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}
```
