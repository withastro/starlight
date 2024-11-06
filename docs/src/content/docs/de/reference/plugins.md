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

Erfahre mehr über die Verwendung eines Starlight-Plugins in der [Konfigurationsreferenz](/de/reference/configuration/#plugins) oder besuche das [Plugins Schaufenster](/de/resources/plugins/#plugins), um eine Liste der verfügbaren Plugins zu sehen.

## API-Schnellreferenz

Ein Starlight-Plugin hat die folgende Form.
Siehe unten für Details zu den verschiedenen Eigenschaften und Hook-Parametern.

```ts
interface StarlightPlugin {
  name: string;
  hooks: {
    setup: (options: {
      config: StarlightUserConfig;
      updateConfig: (newConfig: StarlightUserConfig) => void;
      addIntegration: (integration: AstroIntegration) => void;
      astroConfig: AstroConfig;
      command: 'dev' | 'build' | 'preview';
      isRestart: boolean;
      logger: AstroIntegrationLogger;
      injectTranslations: (Record<string, Record<string, string>>) => void;
    }) => void | Promise<void>;
  };
}
```

## `name`

**Typ:** `string`

Ein Plugin muss einen eindeutigen Namen angeben, der es beschreibt. Der Name wird verwendet, wenn [Logging-Nachrichten](#logger) sich auf dieses Plugin bezieht und kann von anderen Plugins verwendet werden, um das Vorhandensein dieses Plugins zu erkennen.

## `hooks`

Hooks sind Funktionen, die Starlight aufruft, um Plugin-Code zu bestimmten Zeiten auszuführen. Derzeit unterstützt Starlight nur einen einzigen `setup`-Hook.

### `hooks.setup`

Plugin-Setup-Funktion, die aufgerufen wird, wenn Starlight initialisiert wird (während des [`astro:config:setup`](https://docs.astro.build/de/reference/integrations-reference/#astroconfigsetup) Integrations-Hooks).
Der `setup`-Hook kann verwendet werden, um die Starlight-Konfiguration zu aktualisieren oder Astro-Integrationen hinzuzufügen.

Dieser Hook wird mit den folgenden Optionen aufgerufen:

#### `config`

**Typ:** `StarlightUserConfig`

Eine schreibgeschützte Kopie der vom Benutzer bereitgestellten [Starlight-Konfiguration](/de/reference/configuration/).
Diese Konfiguration kann durch andere Plugins, die vor dem aktuellen Plugin konfiguriert wurden, aktualisiert worden sein.

#### `updateConfig`

**Typ:** `(newConfig: StarlightUserConfig) => void`

Eine Callback-Funktion zur Aktualisierung der vom Benutzer bereitgestellten [Starlight-Konfiguration](/de/reference/configuration/).
Gib die Konfigurationsschlüssel der root-Ebene an, die du überschreiben möchtest.
Um verschachtelte Konfigurationswerte zu aktualisieren, musst du das gesamte verschachtelte Objekt bereitstellen.

Um eine vorhandene Konfigurationsoption zu erweitern, ohne sie außer Kraft zu setzen, wird der vorhandene Wert in den neuen Wert übertragen.
Im folgenden Beispiel wird ein neues [`social`](/de/reference/configuration/#social) Medienkonto zur bestehenden Konfiguration hinzugefügt, indem `config.social` in das neue `social` Objekt übertragen wird:

```ts {6-11}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
  hooks: {
    setup({ config, updateConfig }) {
      updateConfig({
        social: {
          ...config.social,
          twitter: 'https://twitter.com/astrodotbuild',
        },
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
    setup({ addIntegration, astroConfig }) {
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
    setup({ logger }) {
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

#### `injectTranslations`

**Typ:** `(translations: Record<string, Record<string, string>>) => void`

Eine Callback-Funktion zum Hinzufügen oder Aktualisieren von Übersetzungsstrings, die in Starlights [Lokalisierungs-APIs](/de/guides/i18n/#ui-übersetzungen-verwenden) verwendet werden.

Im folgenden Beispiel injiziert ein Plugin Übersetzungen für einen benutzerdefinierten UI-String mit dem Namen `myPlugin.doThing` für die Gebietsschemata `en` und `fr`:

```ts {6-13} /(injectTranslations)[^(]/
// plugin.ts
export default {
  name: 'plugin-with-translations',
  hooks: {
    setup({ injectTranslations }) {
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

Um die eingefügten Übersetzungen in der Benutzeroberfläche deines Plugins zu verwenden, folge der Anleitung [„UI-Übersetzungen verwenden“](/de/guides/i18n/#ui-übersetzungen-verwenden).

Typen für die injizierten Übersetzungsstrings eines Plugins werden automatisch im Projekt eines Benutzers generiert, sind aber noch nicht verfügbar, wenn du in der Codebasis deines Plugins arbeitest.
Um das `locals.t`-Objekt im Kontext deines Plugins einzugeben, deklariere die folgenden globalen Namespaces in einer TypeScript-Deklarationsdatei:

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // Definiere das Objekt `locals.t` im Kontext eines Plugins.
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // Definiere die zusätzlichen Plugin-Übersetzungen in der Schnittstelle `I18n`.
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

Die folgende Deklaration würde Typen aus den englischen Schlüsseln in der Quelldatei ableiten:

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```
