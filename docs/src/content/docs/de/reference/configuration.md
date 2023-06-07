---
title: Konfigurations­referenz
description: Ein Überblick über alle von Starlight unterstützten Konfigurationsoptionen.
---

## Konfiguriere die `starlight` Integration

Starlight ist eine Integration, die auf dem [Astro](https://astro.build) Web-Framework aufbaut. Du kannst dein Projekt innerhalb der Astro-Konfigurationsdatei `astro.config.mjs` anpassen:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My delightful docs site',
    }),
  ],
});
```

Du kannst die folgenden Optionen an die `starlight` Integration übergeben.

### `title` (erforderlich)

**Typ:** `string`

Lege den Titel für deine Website fest. Wird in den Metadaten und im Titel der Browser-Tabs verwendet.

### `description`

**Typ:** `string`

Lege die Beschreibung für deine Website fest. Wird in den Metadaten verwendet, die mit Suchmaschinen im `<meta name="description">`-Tag geteilt werden, für Seiten wo `description` nicht im Frontmatter festgelegt ist.

### `logo`

**Typ:** [`LogoConfig`](#logoconfig)

Legt ein Logobild fest, das in der Navigationsleiste neben oder anstelle des Seitentitels angezeigt wird. Du kannst entweder eine einzige `src`-Eigenschaft oder separate Bildquellen für `light` und `dark` festlegen.

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

**Typ:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`  
**Voreinstellung:** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

Konfiguriere das Inhaltsverzeichnis, das rechts auf jeder Seite angezeigt wird. Standardmäßig werden `<h2>` und `<h3>` Überschriften in dieses Inhaltsverzeichnis aufgenommen.

### `editLink`

**Typ:** `{ baseUrl: string }`

Aktiviere "Diese Seite bearbeiten"-Links, indem du die Basis-URL für diese festlegst. Der endgültige Link wird `editLink.baseUrl` + der aktuelle Seitenpfad sein. Zum Beispiel, um das Bearbeiten von Seiten im `withastro/starlight` Repo auf GitHub zu ermöglichen:

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

Mit dieser Konfiguration würde eine `/einfuehrung` einen Bearbeitungslink haben, der auf `https://github.com/withastro/starlight/edit/main/src/docs/einfuehrung.md` zeigt.

### `sidebar`

**Typ:** [`SidebarGroup[]`](#sidebargroup)

Konfiguriere die Navigationselemente der Seitenleiste deiner Website.

Ein Sidebar ist ein Array von Gruppen, jede mit einem `Label` für die Gruppe und entweder einem `items`-Array oder einem `autogenerate` Konfigurationsobjekt.

Du kannst den Inhalt einer Gruppe manuell festlegen, indem du `items` verwendest, welches ein Array ist, das Links und Untergruppen enthalten kann. Du kannst den Inhalt einer Gruppe auch automatisch aus einem bestimmten Verzeichnis erzeugen, indem du `autogenerate` verwendest.

```js
starlight({
  sidebar: [
    // Eine Gruppe mit der Bezeichnung "Hier anfangen", die zwei Links enthält.
    {
      label: 'Hier anfangen',
      items: [
        { label: 'Einleitung', link: '/intro' },
        { label: 'Nächste Schritte', link: '/next-steps' },
      ],
    },
    // Eine Gruppe, die auf alle Seiten im Referenzverzeichnis verweist.
    {
      label: 'Referenz',
      autogenerate: {
        directory: 'referenz',
      },
    },
  ],
});
```

#### `SidebarGroup`

```ts
type SidebarGroup =
  | {
      label: string;
      items: Array<LinkItem | SidebarGroup>;
    }
  | {
      label: string;
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

**Typ:** `{ [dir: string]: LocaleConfig }`

Konfiguriere die Internationalisierung (i18n) für Ihre Website, indem du festlegst, welche `Locales` unterstützt werden.

Jeder Eintrag sollte das Verzeichnis, in dem die Dateien der jeweiligen Sprache gespeichert sind, als Schlüssel verwenden.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      // Englisch als Standardsprache festlegen.
      defaultLocale: 'en',
      locales: {
        // Englische Seiten in `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // Chinesische Seiten in `src/content/docs/zh/`
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // Arabische Seiten in `src/content/docs/ar/`
        ar: {
          label: 'العربية',
          dir: 'rtl',
        },
      },
    }),
  ],
});
```

#### Locale-Optionen

Du kannst die folgenden Optionen für jedes Locale-Schema festlegen:

##### `label` (erforderlich)

**Typ:** `string`

Die Bezeichnung für diese Sprache, die den Benutzern angezeigt werden soll, z. B. im Sprachumschalter. Meistens wird dies der Name der Sprache sein, wie ihn ein Benutzer dieser Sprache erwarten würde, z.B. `"English"`, `"العربية"`, oder `"简体中文"`.

##### `lang`

**Typ:** `string`

Das BCP-47-Tag für diese Sprache, z. B. `"en"`, `"ar"` oder `"zh-CN"`. Wenn nicht gesetzt, wird standardmäßig der Verzeichnisname der Sprache verwendet.

##### `dir`

**Typ:** `'ltr' | 'rtl'`

Die Schreibrichtung dieser Sprache; `"ltr"` für links-nach-rechts (die Voreinstellung) oder `"rtl"` für rechts-nach-links.

#### Root-Locale

Du kannst die Standardsprache ohne ein `/lang/`-Verzeichnis anbieten, indem du ein `root`-Locale setzst:

```js
starlight({
  locales: {
    root: {
      label: 'Englisch',
      lang: 'en',
    },
    fr: {
      label: 'Français',
    },
  },
});
```

So kannst du zum Beispiel `/getting-started/` als englische Seite und `/fr/getting-started/` als entsprechende französische Seite verwenden.

### `defaultLocale`

**Typ:** `string`

Legt die Sprache fest, die als Standard für diese Webseite gilt.
Der Wert sollte mit einem der Schlüssel deines [`locales`](#locales)-Objekts übereinstimmen.
(Wenn deine Standardsprache deiner [Root-Locale](#root-locale) ist, kannst du dies überspringen).

Das `defaultLocale` wird verwendet, um Ersatzinhalte bereitzustellen, wenn Übersetzungen fehlen.

### `social`

**Typ:** `{ discord?: string; github?: string; mastodon?: string; twitter?: string }`

Optionale Angaben zu den Social-Media-Konten für diese Site. Wenn du eines dieser Konten hinzufügst, werden sie als Icon-Links in der Kopfzeile der Website angezeigt.

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

**Typ:** `string[]`

Stellen CSS-Dateien zur Verfügung, um das Aussehen deines Starlight-Projekts anzupassen.

Unterstützt lokale CSS-Dateien relativ zum Stammverzeichnis deines Projekts, z.B. `'/src/custom.css'`, und CSS, die du als npm-Modul installiert hast, z.B. `'@fontsource/roboto'`.

```js
starlight({
  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**Typ:** [`HeadConfig[]`](#headconfig)

Füge zusätzliche Tags in den `<head>` deines Starlight-Projekts ein.
Kann nützlich sein, um Analytics und andere Skripte und Ressourcen von Drittanbietern hinzuzufügen.

```js
starlight({
  head: [
    // Beispiel: Fathom Analytics Skript-Tag hinzufügen.
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
