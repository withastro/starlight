---
title: Référence de configuration
description: Une vue d'ensemble de toutes les options de configuration prises en charge par Starlight.
---

## Configuration de l'intégration `starlight`

Starlight est une intégration construite sur le framework web [Astro](https://astro.build). Vous pouvez configurer votre projet dans le fichier de configuration `astro.config.mjs` :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Mon délicieux site de docs',
    }),
  ],
});
```

Vous pouvez passer les options suivantes à l'intégration `starlight`.

### `title` (obligatoire)

**type:** `string`

Définissez le titre de votre site web. Il sera utilisé dans les métadonnées et dans le titre de l'onglet du navigateur.

### `description`

**type:** `string`

Définissez la description de votre site web. Utilisée dans les métadonnées partagées avec les moteurs de recherche dans la balise `<meta name="description">` si `description` n'est pas définie dans le frontmatter d'une page.

### `logo`

**type:** [`LogoConfig`](#logoconfig)

Définit une image de logo à afficher dans la barre de navigation à côté ou à la place du titre du site. Vous pouvez soit définir une seule propriété `src`, soit définir des sources d'images séparées pour `light` et `dark`.

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

Configurez la table des matières affichée à droite de chaque page. Par défaut, les titres `<h2>` et `<h3>` seront inclus dans cette table des matières.

### `editLink`

**type:** `{ baseUrl: string }`

Permet d'activer les liens "Modifier cette page" en définissant l'URL de base qu'ils doivent utiliser. Le lien final sera `editLink.baseUrl` + le chemin de la page actuelle. Par exemple, pour permettre l'édition de pages dans le repo `withastro/starlight` sur GitHub :

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

Avec cette configuration, une page `/introduction` aurait un lien d'édition pointant vers `https://github.com/withastro/starlight/edit/main/src/docs/introduction.md`.

### `sidebar`

**type:** [`SidebarGroup[]`](#sidebargroup)

Configure les éléments de navigation de la barre latérale de votre site.

Une barre latérale est un tableau de groupes, chacun avec un `label` pour le groupe et un tableau `items` ou un objet de configuration `autogenerate`.

Vous pouvez définir manuellement le contenu d'un groupe en utilisant `items`, qui est un tableau pouvant inclure des liens et des sous-groupes. Vous pouvez aussi générer automatiquement le contenu d'un groupe à partir d'un répertoire spécifique de votre documentation, en utilisant `autogenerate`.

```js
starlight({
  sidebar: [
    // Un groupe intitulé "Commencer ici" contenant deux liens.
    {
      label: 'Commencer ici',
      items: [
        { label: 'Introduction', link: '/intro' },
        { label: 'Etapes', link: '/next-steps' },
      ],
    },
    // Un groupe qui renvoie à toutes les pages du répertoire de référence.
    {
      label: 'Référence',
      autogenerate: { directory: 'reference' },
    },
  ],
});
```

#### Tri

Les groupes de barres latérales générées automatiquement sont triés par nom de fichier et par ordre alphabétique.
Par exemple, une page générée à partir de `astro.md` apparaîtrait au-dessus de la page de `starlight.md`.

#### Traduire les étiquettes

Si votre site est multilingue, le `label` de chaque élément est considéré comme étant dans la locale par défaut. Vous pouvez définir une propriété `translations` pour fournir des étiquettes pour les autres langues supportées :

```js
sidebar: [
  // Un exemple de barre latérale avec des étiquettes traduites en anglais.
  {
    label: 'Commencer ici',
    translations: { en: 'Start here' },
    items: [
      {
        label: 'Bien démarrer',
        translations: { en: 'Getting Started' },
        link: '/getting-started',
      },
      {
        label: 'Structure du projet',
        translations: { en: 'Project Structure' },
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

**type:** `{ [dir: string]: LocaleConfig }`

Configurez l'internationalisation (i18n) de votre site en définissant les `locales` supportées.

Chaque entrée doit utiliser comme clé le répertoire dans lequel les fichiers de cette langue sont sauvegardés.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Site',
      // Définit l'anglais comme langue par défaut pour ce site.
      defaultLocale: 'en',
      locales: {
        // Documentations en anglais danse trouve dans `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // Documentations en Chinois simplifié se trouve dans `src/content/docs/zh/`
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // Documentations en Arabe se trouve dans `src/content/docs/ar/`
        ar: {
          label: 'العربية',
          dir: 'rtl',
        },
      },
    }),
  ],
});
```

#### Options des paramètres linguistiques

Vous pouvez définir les options suivantes pour chaque locale :

##### `label` (obligatoire)

**type:** `string`

L'étiquette de cette langue à afficher aux utilisateurs, par exemple dans le sélecteur de langue. Le plus souvent, il s'agit du nom de la langue tel qu'un utilisateur de cette langue s'attendrait à le lire, par exemple `"English"`, `"العربية"`, ou `"简体中文"`.

##### `lang`

**type:** `string`

La balise BCP-47 pour cette langue, par exemple `"en"`, `"ar"`, ou `"zh-CN"`. S'il n'est pas défini, le nom du répertoire de la langue sera utilisé par défaut.

##### `dir`

**type:** `'ltr' | 'rtl'`

Le sens d'écriture de cette langue ; `"ltr"` pour gauche à droite (par défaut) ou `"rtl"` pour droite à gauche.

#### Locale racine

Vous pouvez servir la langue par défaut sans répertoire `/lang/` en définissant une locale `root` :

```js
starlight({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    fr: {
      label: 'Français',
    },
  },
});
```

Par exemple, cela vous permet de servir `/getting-started/` comme une route anglaise et d'utiliser `/fr/getting-started/` comme la page française équivalente.

### `defaultLocale`

**type:** `string`

Définit la langue par défaut pour ce site.
La valeur doit correspondre à l'une des clés de votre objet [`locales`](#locales).
(Si votre langue par défaut est votre [root locale](#root-locale), vous pouvez sauter cette étape).

La locale par défaut sera utilisée pour fournir un contenu de remplacement lorsque les traductions sont manquantes.

### `social`

**type:** `{ discord?: string; github?: string; mastodon?: string; twitter?: string }`

Détails optionnels sur les comptes de médias sociaux pour ce site. L'ajout de l'un d'entre eux les affichera sous forme de liens iconiques dans l'en-tête du site.

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

Fournit des fichiers CSS pour personnaliser l'aspect et la convivialité de votre site Starlight.

Prend en charge les fichiers CSS locaux relatifs à la racine de votre projet, par exemple `'/src/custom.css'`, et les CSS que vous avez installés en tant que module npm, par exemple `'@fontsource/roboto'`.

```js
starlight({
  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**type:** [`HeadConfig[]`](#headconfig)

Ajoute des balises personnalisées au `<head>` de votre site Starlight.
Cela peut être utile pour ajouter des analyses et d'autres scripts et ressources tiers.

```js
starlight({
  head: [
    // Exemple : ajouter un script d'analyse Fathom tag.
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
