---
title: Plugins Referenz
description: Ein Überblick über die Starlight-Plugin-API.
tableOfContents:
  maxHeadingLevel: 4
sidebar:
  label: Plugins
---

Starlight-Plugins können die Konfiguration, die Benutzeroberfläche und das Verhalten von Starlight anpassen und sind gleichzeitig einfach weiterzugeben und wiederzuverwenden.
Diese Referenzseite dokumentiert die API, auf die Plugins Zugriff haben.

Erfahre mehr über die Verwendung eines Starlight-Plugins in der [Konfigurations&shy;referenz](/de/reference/configuration/#plugins) oder besuche das [Plugins Schaufenster](/de/resources/plugins/#plugins), um eine Liste der verfügbaren Plugins zu sehen.

## API-Schnellreferenz

Ein Starlight-Plugin hat die folgende Form.
Siehe unten für Details zu den verschiedenen Eigenschaften und Hook-Parametern.

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

**Typ:** `string`

Ein Plugin muss einen eindeutigen Namen angeben, der es beschreibt. Der Name wird verwendet, wenn [Logging-Nachrichten](#logger) sich auf dieses Plugin bezieht und kann von anderen Plugins verwendet werden, um das Vorhandensein dieses Plugins zu erkennen.

## `hooks`

Hooks sind Funktionen, die Starlight aufruft, um Plugin-Code zu bestimmten Zeiten auszuführen.

Um den Typ der Argumente eines Hooks zu erhalten, verwende den Utility-Typ `HookParameters` und gib den Namen des Hooks an.
Im folgenden Beispiel wird der Parameter `options` so eingegeben, dass er mit den Argumenten übereinstimmt, die an den Hook `config:setup` übergeben werden:

```ts
import type { HookParameters } from '@astrojs/starlight/types';

function configSetup(options: HookParameters['config:setup']) {
  options.useTranslations('de');
}
```

### `i18n:setup`

Die Funktion zum Einrichten der Plugin-Internationalisierung wird beim Initialisieren von Starlight aufgerufen.
Der `i18n:setup`-Hook kann verwendet werden, um Übersetzungsstrings zu injizieren, damit ein Plugin verschiedene Locales unterstützen kann.
Diese Übersetzungen werden über [`useTranslations()`](#usetranslations) im `config:setup`-Hook und in UI-Komponenten über [`Astro.locals.t()`](/de/guides/i18n/#ui-übersetzungen-verwenden) verfügbar sein.

Der `i18n:setup`-Hook wird mit den folgenden Optionen aufgerufen:

#### `injectTranslations`

**Typ:** `(translations: Record<string, Record<string, string>>) => void`

Eine Callback-Funktion zum Hinzufügen oder Aktualisieren von Übersetzungsstrings, die in Starlights [Lokalisierungs-APIs](/de/guides/i18n/#ui-übersetzungen-verwenden) verwendet werden.

Im folgenden Beispiel injiziert ein Plugin Übersetzungen für einen benutzerdefinierten UI-String mit dem Namen `myPlugin.doThing` für die Sprachumgebungen `en` und `fr`:

```ts {6-13} /(injectTranslations)[^(]/
// plugin.ts
export default {
  name: 'plugin-use-translations',
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

Um die injizierten Übersetzungen in der Benutzeroberfläche deines Plugins zu verwenden, befolge die [„UI-Übersetzungen verwenden“-Anleitung](/de/guides/i18n/#ui-übersetzungen-verwenden).
Wenn du UI-Strings im Zusammenhang mit dem [`config:setup`](#configsetup)-Hook deines Plugins verwenden musst, kannst du den [`useTranslations()`](#usetranslations)-Callback verwenden.

Die Typen für die injizierten Übersetzungsstrings eines Plugins werden im Projekt des Benutzers automatisch generiert, sind aber bei der Arbeit in der Codebasis deines Plugins noch nicht verfügbar.
Um das Objekt `locals.t` im Kontext deines Plugins zu typisieren, deklariere die folgenden globalen Namespaces in einer TypeScript-Deklarationsdatei:

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // Definiere das Objekt `locals.t` im Kontext eines Plugins.
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // Definiere die zusätzlichen Plugin-Übersetzungen in der `I18n`-Schnittstelle.
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

Du kannst die Typen für die Schnittstelle `StarlightApp.I18n` auch aus einer Quelldatei ableiten, wenn du ein Objekt hast, das deine Übersetzungen enthält.

Nehmen wir zum Beispiel die folgende Quelldatei:

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  fr: { 'myPlugin.doThing': 'Faire le truc' },
};
```

Die folgende Deklaration würde die Typen aus den englischen Schlüsseln in der Quelldatei ableiten:

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```

### `config:setup`

Plugin-Konfiguration-Setup-Funktion, die aufgerufen wird, wenn Starlight initialisiert wird (während des [`astro:config:setup`](https://docs.astro.build/de/reference/integrations-reference/#astroconfigsetup) Integrations-Hooks).
Der `config:setup`-Hook kann verwendet werden, um die Starlight-Konfiguration zu aktualisieren oder Astro-Integrationen hinzuzufügen.

Dieser Hook wird mit den folgenden Optionen aufgerufen:

#### `config`

**Typ:** `StarlightUserConfig`

Eine schreibgeschützte Kopie der vom Benutzer bereitgestellten [Starlight-Konfiguration](/de/reference/configuration/).
Diese Konfiguration kann durch andere Plugins, die vor dem aktuellen Plugin konfiguriert wurden, aktualisiert worden sein.

#### `updateConfig`

**Typ:** `(newConfig: StarlightUserConfig) => void`

Eine Callback-Funktion zur Aktualisierung der vom Benutzer bereitgestellten [Starlight-Konfiguration](/de/reference/configuration/).
Gib die Konfigurations&shy;schlüssel der root-Ebene an, die du überschreiben möchtest.
Um verschachtelte Konfigurationswerte zu aktualisieren, musst du das gesamte verschachtelte Objekt bereitstellen.

Um eine vorhandene Konfigurations&shy;option zu erweitern, ohne sie außer Kraft zu setzen, wird der vorhandene Wert in den neuen Wert übertragen.
Im folgenden Beispiel wird ein neues [`social`](/de/reference/configuration/#social) Medienkonto zur bestehenden Konfiguration hinzugefügt, indem `config.social` in das neue `social`-Array übertragen wird:

```ts {6-15}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
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

**Typ:** `(integration: AstroIntegration) => void`

Eine Callback-Funktion zum Hinzufügen einer [Astro-Integration](https://docs.astro.build/de/reference/integrations-reference/), die vom Plugin benötigt wird.

Im folgenden Beispiel prüft das Plugin zunächst, ob [Astros React-Integration](https://docs.astro.build/de/guides/integrations-guide/react/) konfiguriert ist, und fügt sie, falls nicht, mit `addIntegration()` hinzu:

```ts {14} "addIntegration,"
// plugin.ts
import react from '@astrojs/react';

export default {
  name: 'plugin-using-react',
  hooks: {
    'config:setup'({ addIntegration, astroConfig }) {
      const isReactLoaded = astroConfig.integrations.find(
        ({ name }) => name === '@astrojs/react'
      );

      // Füge die React-Integration nur hinzu, wenn sie nicht bereits geladen ist.
      if (!isReactLoaded) {
        addIntegration(react());
      }
    },
  },
};
```

#### `addRouteMiddleware`

**Typ:** `(config: { entrypoint: string; order?: 'pre' | 'post' | 'default'}) => void`

Eine Callback-Funktion, um der Website einen [Routen-Middleware-Handler](/de/guides/route-data/) hinzuzufügen.

Die Eigenschaft `entrypoint` muss ein Modulbezeichner für die Middleware-Datei deines Plugins sein, die einen `onRequest`-Handler exportiert.

Im folgenden Beispiel fügt ein Plugin, das unter dem Namen `@example/starlight-plugin` veröffentlicht wurde, eine Route-Middleware über einen npm-Modul-Spezifizierer hinzu:

```js {6-9}
// plugin.ts
export default {
  name: '@example/starlight-plugin',
  hooks: {
    'config:setup'({ addRouteMiddleware }) {
      addRouteMiddleware({
        entrypoint: '@example/starlight-plugin/route-middleware',
      });
    },
  },
};
```

##### Kontrolle der Ausführungs&shy;reihenfolge

Standardmäßig wird die Plugin-Middleware in der Reihenfolge ausgeführt, in der die Plugins hinzugefügt werden.

Verwende die optionale Eigenschaft `order`, wenn du mehr Kontrolle darüber brauchst, wann deine Middleware läuft.
Setze `order: "pre"`, um vor der Middleware eines Benutzers zu laufen.
Setze `order: "post"`, um nach allen anderen Middlewares zu laufen.

Wenn zwei Plugins Middleware mit demselben `order`-Wert hinzufügen, wird das zuerst hinzugefügte Plugin zuerst ausgeführt.

#### `astroConfig`

**Typ:** `AstroConfig`

Eine schreibgeschützte Kopie der vom Benutzer bereitgestellten [Astro-Konfiguration](https://docs.astro.build/de/reference/configuration-reference/).

#### `command`

**Typ:** `'dev' | 'build' | 'preview'`

Der Befehl, mit dem Starlight gestartet wird:

- `dev` - Projekt wird mit `astro dev` ausgeführt
- `build` - Projekt wird mit `astro build` ausgeführt
- `preview` - Projekt wird mit `astro preview` ausgeführt

#### `isRestart`

**Typ:** `boolean`

`false`, wenn der Dev-Server startet, `true`, wenn ein Reload ausgelöst wird.
Häufige Gründe für einen Neustart sind, dass ein Benutzer seine `astro.config.mjs` bearbeitet, während der Dev-Server läuft.

#### `logger`

**Typ:** `AstroIntegrationLogger`

Eine Instanz des [Astro-Integrationsloggers](https://docs.astro.build/de/reference/integrations-reference/#astrointegrationlogger), die du zum Schreiben von Protokollen verwenden kannst.
Allen protokollierten Meldungen wird der Name des Plugins vorangestellt.

```ts {6}
// plugin.ts
export default {
  name: 'long-process-plugin',
  hooks: {
    'config:setup'({ logger }) {
      logger.info('Beginn eines langen Prozesses…');
      // Ein langer Prozess…
    },
  },
};
```

Im obigen Beispiel wird eine Meldung protokolliert, die die angegebene Info-Meldung enthält:

```shell
[long-process-plugin] Beginn eines langen Prozesses…
```

#### `useTranslations`

**Typ:** `(lang: string) => I18nT`

Rufe `useTranslations()` mit einem BCP-47-Sprach-Tag auf, um eine Utility-Funktion zu generieren, die Zugriff auf UI-Strings für diese Sprache bietet.
`useTranslations()` gibt ein Äquivalent der API `Astro.locals.t()` zurück, die in Astro-Komponenten verfügbar ist.
Weitere Informationen zu den verfügbaren APIs findest du im Leitfaden [„UI-Übersetzungen verwenden“](/de/guides/i18n/#ui-übersetzungen-verwenden).

```ts {6}
// plugin.ts
export default {
  name: 'plugin-use-translations',
  hooks: {
    'config:setup'({ useTranslations, logger }) {
      const t = useTranslations('zh-CN');
      logger.info(t('builtWithStarlight.label'));
    },
  },
};
```

Im obigen Beispiel wird eine Meldung protokolliert, die einen integrierten UI-String für die vereinfachte chinesische Sprache enthält:

```shell
[plugin-use-translations] 基于 Starlight 构建
```

#### `absolutePathToLang`

**Typ:** `(path: string) => string`

Rufe `absolutePathToLang()` mit einem absoluten Dateipfad auf, um die Sprache für diese Datei zu erhalten.

Dies kann besonders nützlich sein, wenn du [remark oder rehype Plugins](https://docs.astro.build/de/guides/markdown-content/#markdown-plugins) hinzufügst, um Markdown- oder MDX-Dateien zu verarbeiten.
Das von diesen Plugins verwendete [virtuelle Dateiformat](https://github.com/vfile/vfile) enthält den [absoluten Pfad](https://github.com/vfile/vfile#filepath) der zu verarbeitenden Datei, der mit `absolutePathToLang()` verwendet werden kann, um die Sprache der Datei zu bestimmen.
Die zurückgegebene Sprache kann mit dem Helfer [`useTranslations()`](#usetranslations) verwendet werden, um UI-Strings für diese Sprache zu erhalten.

Nehmen wir zum Beispiel die folgende Starlight-Konfiguration:

```js
starlight({
  title: 'Meine Dokumentation',
  defaultLocale: 'en',
  locales: {
    // Englische Dokumentationen in `src/content/docs/en/`
    en: { label: 'English' },
    // Französische Dokumentationen in `src/content/docs/fr/`
    fr: { label: 'Français', lang: 'fr' },
  },
});
```

Ein Plugin kann die Sprache einer Datei anhand ihres absoluten Pfads bestimmen:

```ts {6-8} /fr/
// plugin.ts
export default {
  name: 'plugin-use-translations',
  hooks: {
    'config:setup'({ absolutePathToLang, useTranslations, logger }) {
      const lang = absolutePathToLang(
        '/absolute/path/to/project/src/content/docs/fr/index.mdx'
      );
      const t = useTranslations(lang);
      logger.info(t('aside.tip'));
    },
  },
};
```

Im obigen Beispiel wird eine Meldung protokolliert, die einen integrierten UI-String für die französische Sprache enthält:

```shell
[plugin-use-translations] Astuce
```
