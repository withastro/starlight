---
title: Référence des modules d'extension
description: Une vue d'ensemble de l'API des modules d'extension Starlight.
tableOfContents:
  maxHeadingLevel: 4
---

Les modules d'extension Starlight peuvent personnaliser la configuration, l'interface utilisateur et le comportement de Starlight, tout en étant faciles à partager et à réutiliser.
Cette page de référence documente l'API à laquelle ces modules d'extension ont accès.

Consultez la [référence de configuration](/fr/reference/configuration/#plugins) pour en savoir plus sur l'utilisation d'un module d'extension Starlight ou visitez la [vitrine des modules d'extension](/fr/resources/plugins/) pour voir une liste de modules d'extension disponibles.

## Référence rapide de l'API

Un module d'extension Starlight a la forme suivante.
Voir ci-dessous pour plus de détails sur les différentes propriétés et paramètres des hooks.

<!-- prettier-ignore-start -->
```ts
interface StarlightPlugin {
  name: string;
  hooks: {
    'i18n:setup'?: (options: {
      injectTranslations: (
        translations: Record<string, Record<string, string>>
      ) => void;
    }) => void | Promise<void>;
    'config:setup': (options: {
      config: StarlightUserConfig;
      updateConfig: (newConfig: StarlightUserConfig) => void;
      addIntegration: (integration: AstroIntegration) => void;
      addRouteMiddleware: (config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void;
      astroConfig: AstroConfig;
      command: 'dev' | 'build' | 'preview';
      isRestart: boolean;
      logger: AstroIntegrationLogger;
      useTranslations: (lang: string) => I18nT;
      absolutePathToLang: (path: string) => string;
    }) => void | Promise<void>;
  };
}
```
<!-- prettier-ignore-end -->

## `name`

**Type :** `string`

Un module d'extension doit fournir un nom unique qui le décrit. Le nom est utilisé lors de [l'affichage des messages](#logger) liés à ce module d'extension et peut être utilisé par d'autres modules d'extension pour détecter la présence de ce dernier.

## `hooks`

Les hooks sont des fonctions que Starlight appelle pour exécuter le code du module d'extension à des moments spécifiques.

Pour référencer le type des arguments d'un hook, utilisez le type utilitaire `HookParameters` et passez le nom du hook.
Dans l'exemple suivant, le paramètre `options` est typé pour correspondre aux arguments passés au hook `config:setup` :

```ts
import type { HookParameters } from '@astrojs/starlight/types';

function configSetup(options: HookParameters['config:setup']) {
  options.useTranslations('fr');
}
```

### `i18n:setup`

Fonction de configuration de l'internationalisation du module d'extension appelée lorsque Starlight est initialisé.
Le hook `i18n:setup` peut être utilisé pour injecter des traductions afin que le module d'extension puisse prendre en charge différentes locales.
Ces traductions seront disponibles via [`useTranslations()`](#usetranslations) dans le hook `config:setup` et dans les composants d'interface utilisateur via [`Astro.locals.t()`](/fr/guides/i18n/#utiliser-les-traductions-de-linterface-utilisateur).

Le hook `i18n:setup` est appelé avec les options suivantes :

#### `injectTranslations`

**Type :** `(translations: Record<string, Record<string, string>>) => void`

Une fonction appelée pour ajouter ou mettre à jour des chaînes de traduction utilisées dans les [API de localisation](/fr/guides/i18n/#utiliser-les-traductions-de-linterface-utilisateur) de Starlight.

Dans l'exemple suivant, un module d'extension injecte des traductions pour une chaîne d'interface utilisateur personnalisée nommée `myPlugin.doThing` pour les locales `en` et `fr` :

```ts {6-13} /(injectTranslations)[^(]/
// plugin.ts
export default {
  name: 'plugin-avec-traductions',
  hooks: {
    'i18n:setup'({ injectTranslations }) {
      injectTranslations({
        en: {
          'myPlugin.doThing': 'Do the thing',
        },
        fr: {
          'myPlugin.doThing': 'Faire le truc',
        },
      });
    },
  },
};
```

Pour utiliser les traductions injectées dans l'interface utilisateur de votre module d'extension, suivez le [guide « Utiliser les traductions de l'interface utilisateur »](/fr/guides/i18n/#utiliser-les-traductions-de-linterface-utilisateur).
Si vous avez besoin d'accéder aux traductions dans le contexte du hook [`config:setup`](#configsetup) de votre module d'extension, vous pouvez utiliser la fonction [`useTranslations()`](#usetranslations).

Le typage des chaînes de traduction injectées pour un module d'extension est généré automatiquement dans le projet d'un utilisateur, mais n'est pas encore disponible lors du développement dans le code source de votre module d'extension.
Pour typer l'objet `locals.t` dans le contexte de votre module d'extension, déclarez les espaces de noms globaux suivants dans un fichier de déclaration TypeScript :

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // Definit l'objet `locals.t` dans le contexte d'un module d'extension.
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // Define les traductions supplémentaires du module d'extension dans l'interface `I18n`.
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

Vous pouvez également inférer le typage de l'interface `StarlightApp.I18n` à partir d'un fichier source si vous avez un objet contenant vos traductions.

Par exemple, étant donné le fichier source suivant :

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  fr: { 'myPlugin.doThing': 'Faire le truc' },
};
```

La déclaration suivante inférerait le typage à partir des clés anglaises dans le fichier source :

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```

### `config:setup`

La fonction de configuration du module d'extension appelée lorsque Starlight est initialisé (pendant le hook [`astro:config:setup`](https://docs.astro.build/fr/reference/integrations-reference/#astroconfigsetup) de l'intégration).
Le hook `config:setup` peut être utilisé pour mettre à jour la configuration de Starlight ou ajouter des intégrations Astro.

Ce hook est appelé avec les options suivantes :

#### `config`

**Type :** `StarlightUserConfig`

Une copie en lecture seule de la [configuration de Starlight](/fr/reference/configuration/) fournie par l'utilisateur.
Cette configuration peut avoir été mise à jour par d'autres modules d'extension configurés avant celui en cours.

#### `updateConfig`

**Type :** `(newConfig: StarlightUserConfig) => void`

Une fonction de rappel pour mettre à jour la [configuration de Starlight](/fr/reference/configuration/) fournie par l'utilisateur.
Spécifiez les clés de configuration de niveau racine que vous souhaitez remplacer.
Pour mettre à jour des valeurs de configuration imbriquées, vous devez fournir l'objet imbriqué entier.

Pour étendre une option de configuration existante sans la remplacer, étendez la valeur existante dans votre nouvelle valeur.
Dans l'exemple suivant, un nouveau compte de média [`social`](/fr/reference/configuration/#social) est ajouté à la configuration existante en étendant `config.social` dans le nouveau tableau `social` :

```ts {6-15}
// module-extension.ts
export default {
  name: 'ajout-twitter-plugin',
  hooks: {
    'config:setup'({ config, updateConfig }) {
      updateConfig({
        social: [
          ...config.social,
          {
            icon: 'twitter',
            label: 'Twitter',
            href: 'https://twitter.com/astrodotbuild',
          },
        ],
      });
    },
  },
};
```

#### `addIntegration`

**Type :** `(integration: AstroIntegration) => void`

Une fonction de rappel pour ajouter une [intégration Astro](https://docs.astro.build/fr/reference/integrations-reference/) requise par le module d'extension.

Dans l'exemple suivant, le module d'extension vérifie d'abord si [l'intégration React d'Astro](https://docs.astro.build/fr/guides/integrations-guide/react/) est configurée et, si ce n'est pas le cas, utilise `addIntegration()` pour l'ajouter :

```ts {14} "addIntegration,"
// module-extension.ts
import react from '@astrojs/react';

export default {
  name: 'plugin-utilisant-react',
  hooks: {
    'config:setup'({ addIntegration, astroConfig }) {
      const isReactLoaded = astroConfig.integrations.find(
        ({ name }) => name === '@astrojs/react'
      );

      // Ajoute seulement l'intégration React si elle n'est pas déjà chargée.
      if (!isReactLoaded) {
        addIntegration(react());
      }
    },
  },
};
```

#### `addRouteMiddleware`

**Type :** `(config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void`

Une fonction appelée pour ajouter un [middleware de route](/fr/guides/route-data/) pour le site.

La propriété `entrypoint` doit être un spécificateur de module pour le fichier middleware de votre module d'extension qui exporte une fonction `onRequest`.

Dans l'exemple suivant, un module d'extension publié sous `@exemple/starlight-module-extension` ajoute un middleware de route utilisant un spécificateur de module npm :

```js {6-9}
// module-extension.ts
export default {
  name: '@exemple/starlight-module-extension',
  hooks: {
    'config:setup'({ addRouteMiddleware }) {
      addRouteMiddleware({
        entrypoint: '@exemple/starlight-module-extension/route-middleware',
      });
    },
  },
};
```

##### Contrôle de l'ordre d'exécution

Par défaut, le middleware du module d'extension s'exécute dans l'ordre d'ajout des modules d'extension.

Utilisez la propriété `order` facultative si vous avez besoin de plus de contrôle sur le moment où votre middleware s'exécute.
Définissez `order: "pre"` pour s'exécuter avant le middleware d'un utilisateur.
Définissez `order: "post"` pour s'exécuter après tout autre middleware.

Si deux modules d'extension ajoutent un middleware avec la même valeur `order`, le module d'extension ajouté en premier s'exécutera en premier.

#### `astroConfig`

**Type :** `AstroConfig`

Une copie en lecture seule de la [configuration d'Astro](https://docs.astro.build/fr/reference/configuration-reference/) fournie par l'utilisateur.

#### `command`

**Type :** `'dev' | 'build' | 'preview'`

La commande utilisée pour exécuter Starlight :

- `dev` - Le projet est exécuté avec `astro dev`
- `build` - Le projet est exécuté avec `astro build`
- `preview` - Le projet est exécuté avec `astro preview`

#### `isRestart`

**Type :** `boolean`

`false` lorsque le serveur de développement démarre, `true` lorsqu'un rechargement est déclenché.
Les raisons courantes d'un redémarrage incluent un utilisateur qui modifie son fichier `astro.config.mjs` pendant que le serveur de développement est en cours d'exécution.

#### `logger`

**Type :** `AstroIntegrationLogger`

Une instance du [journaliseur (logger) d'intégration Astro](https://docs.astro.build/fr/reference/integrations-reference/#astrointegrationlogger) que vous pouvez utiliser pour écrire des messages de journalisation.
Tous les messages seront préfixés par le nom du module d'extension.

```ts {6}
// module-extension.ts
export default {
  name: 'plugin-long-processus',
  hooks: {
    'config:setup'({ logger }) {
      logger.info("Démarrage d'un long processus…");
      // Un long processus…
    },
  },
};
```

L'exemple ci-dessus affichera un message qui inclut le message d'information fourni :

```plaintext frame="terminal"
[plugin-long-processus] Démarrage d'un long processus…
```

#### `useTranslations`

**Type :** `(lang: string) => I18nT`

Appelez `useTranslations()` avec une étiquette de langue BCP-47 pour générer une fonction utilitaire qui fournit l'accès aux chaînes d'interface utilisateur pour cette langue.
`useTranslations()` retourne une fonction équivalente à l'API `Astro.locals.t()` disponible dans les composants Astro.
Pour en savoir plus sur les APIs disponibles, consultez le [guide « Utiliser les traductions de l'interface utilisateur »](/fr/guides/i18n/#utiliser-les-traductions-de-linterface-utilisateur).

```ts {6}
// module-extension.ts
export default {
  name: 'plugin-utilisant-traductions',
  hooks: {
    'config:setup'({ useTranslations, logger }) {
      const t = useTranslations('zh-CN');
      logger.info(t('builtWithStarlight.label'));
    },
  },
};
```

L'exemple ci-dessus affichera un message qui inclut une chaîne d'interface utilisateur intégrée pour la langue chinoise simplifiée :

```shell
[plugin-utilisant-traductions] 基于 Starlight 构建
```

#### `absolutePathToLang`

**Type :** `(path: string) => string`

Appelez `absolutePathToLang()` avec un chemin de fichier absolu pour obtenir la langue de ce fichier.

Cela peut être particulièrement utile lors de l'ajout de [modules d'extension remark ou rehype](https://docs.astro.build/fr/guides/markdown-content/#modules-dextension-markdown) pour traiter les fichiers Markdown ou MDX.
Le [format de fichier virtuel](https://github.com/vfile/vfile) utilisé par ces modules d'extension inclut le [chemin absolu](https://github.com/vfile/vfile#filepath) du fichier en cours de traitement, qui peut être utilisé avec `absolutePathToLang()` pour déterminer la langue du fichier.
La langue retournée peut être utilisé avec l'utilitaire [`useTranslations()`](#usetranslations) pour obtenir des chaînes d'interface utilisateur pour cette langue.

Par exemple, étant donné la configuration de Starlight suivante :

```js
starlight({
  title: 'Ma documentation',
  defaultLocale: 'fr',
  locales: {
    // Documentation en anglais dans `src/content/docs/en/`
    en: { label: 'English' },
    // Documentation en français dans `src/content/docs/fr/`
    fr: { label: 'Français', lang: 'fr' },
  },
});
```

Un module d'extension peut déterminer la langue d'un fichier en utilisant son chemin absolu :

```ts {6-8} //(en)//
// module-extension.ts
export default {
  name: 'plugin-utilisant-traductions',
  hooks: {
    'config:setup'({ absolutePathToLang, useTranslations, logger }) {
      const lang = absolutePathToLang(
        '/chemin/absolu/vers/projet/src/content/docs/en/index.mdx'
      );
      const t = useTranslations(lang);
      logger.info(t('aside.tip'));
    },
  },
};
```

L'exemple ci-dessus affichera un message qui inclut une chaîne d'interface utilisateur intégrée pour la langue anglaise :

```shell
[plugin-utilisant-traductions] Tip
```
