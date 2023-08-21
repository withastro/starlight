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
    src: './src/assets/my-logo.svg',
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

**Typ:** [`SidebarItem[]`](#sidebaritem)

Konfiguriere die Navigationselemente der Seitenleiste deiner Website.

Eine Seitenleiste ist eine Array von Links und Linkgruppen.
Jedes Element muss ein `label` und eine der folgenden Eigenschaften haben:

- `link` - ein einzelner Link zu einer bestimmten URL, z.B. `'/home'` oder `'https://example.com'`.
- `items` - ein Array, das weitere Links und Untergruppen enthält.
- `autogenerate` - ein Objekt, das ein Verzeichnis deiner Dokumentation angibt, aus dem automatisch eine Gruppe von Links erzeugt werden soll.

```js
starlight({
  sidebar: [
    // Ein einzelner Link mit der Bezeichnung "Startseite".
    { label: 'Startseite', link: '/' },
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

#### Sortierung

Die automatisch erstellten Seitenleisten-Gruppen werden alphabetisch nach dem Dateinamen sortiert.
Zum Beispiel würde eine Seite, die aus der Datei `astro.md` erzeugt wurde, über der Seite für `starlight.md` erscheinen.

#### Zusammenklappbare Gruppen

Gruppen von Links sind standardmäßig aufgeklappt. Du kannst dieses Verhalten ändern, indem du die Eigenschaft `collapsed` einer Gruppe auf `true` setzt.

Autogenerierte Untergruppen respektieren standardmäßig die Eigenschaft `collapsed` ihrer übergeordneten Gruppe. Dies kannst du mit der Eigenschaft `autogenerate.collapsed` außer Kraft setzen.

```js
sidebar: [
  // Eine zusammengefasste Gruppe von Links
  {
    label: 'Collapsed Links',
    collapsed: true,
    items: [
        { label: 'Einleitung', link: '/intro' },
        { label: 'Nächste Schritte', link: '/next-steps' },
    ],
  },
  // Eine aufgeklappte Gruppe, die automatisch generierte Untergruppen enthält, welche standardmäßig eingeklappt sind.
  {
    label: 'Referenz',
    autogenerate: {
      directory: 'reference',
      collapsed: true,
    },
  },
],
```

#### Labels übersetzen

Wenn deine Website mehrsprachig ist, wird das `label` jedes Elements als in der Standard-Sprache verfasst betrachtet. Du kannst die Eigenschaft `translations` verwenden, um die Labels für andere unterstützte Sprachen festzulegen:

```js
sidebar: [
  // Ein Beispiel für eine Seitenleiste mit ins Französische übersetzten Beschriftungen
  {
    label: 'Hier anfangen',
    translations: { fr: 'Commencez ici' },
    items: [
      {
        label: 'Erste Schritte',
        translations: { fr: 'Bien démarrer' },
        link: '/getting-started',
      },
      {
        label: 'Projektstruktur',
        translations: { fr: 'Structure du projet' },
        link: '/structure',
      },
    ],
  },
],
```

#### `SidebarItem`

```ts
type SidebarItem = {
  label: string;
  translations?: Record<string, string>;
} & (
  | { link: string }
  | { items: SidebarItem[]; collapsed?: boolean }
  | {
      autogenerate: { directory: string; collapsed?: boolean };
      collapsed?: boolean;
    }
);
```

### `locales`

**Typ:** <code>{ \[dir: string\]: [LocaleConfig](#localeconfig) }</code>

[Konfiguriere die Internationalisierung (i18n)](/de/guides/i18n/) für Ihre Website, indem du festlegst, welche `Locales` unterstützt werden.

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

#### `LocaleConfig`

```ts
interface LocaleConfig {
  label: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}
```

Du kannst die folgenden Optionen für jedes Locale-Schema festlegen:

##### `label` (erforderlich)

**Typ:** `string`

Die Bezeichnung für diese Sprache, die den Benutzern angezeigt werden soll, z. B. im Sprachumschalter. Meistens wird dies der Name der Sprache sein, wie ihn ein Benutzer dieser Sprache erwarten würde, z.B. `"English"`, `"العربية"`, oder `"简体中文"`.

##### `lang`

**Typ:** `string`

Das BCP-47-Tag für diese Sprache, z. B. `"en"`, `"ar"` oder `"zh-CN"`. Wenn nicht gesetzt, wird standardmäßig der Verzeichnisname der Sprache verwendet. Sprach-Tags mit regionalen Unter-Tags (z.B. `"pt-BR"` oder `"en-US"`) verwenden integrierte UI-Übersetzungen für ihre Basissprache, wenn keine regionalspezifischen Übersetzungen gefunden werden.

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

**Typ:** `Partial<Record<'bitbucket' | 'codeberg' | 'codePen' | 'discord' | 'github' | 'gitlab' | 'gitter' | 'instagram' | 'linkedin' | 'mastodon' | 'microsoftTeams' | 'threads' | 'twitch' | 'twitter' | 'youtube', string>>`

Optionale Angaben zu den Social-Media-Konten für diese Site. Wenn du eines dieser Konten hinzufügst, werden sie als Icon-Links in der Kopfzeile der Website angezeigt.

```js
starlight({
  social: {
    codeberg: 'https://codeberg.org/knut/examples',
    discord: 'https://astro.build/chat',
    github: 'https://github.com/withastro/starlight',
    gitlab: 'https://gitlab.com/delucis',
    linkedin: 'https://www.linkedin.com/company/astroinc',
    mastodon: 'https://m.webtoo.ls/@astro',
    threads: 'https://www.threads.net/@nmoodev',
    twitch: 'https://www.twitch.tv/bholmesdev',
    twitter: 'https://twitter.com/astrodotbuild',
    youtube: 'https://youtube.com/@astrodotbuild',
  },
});
```

### `customCss`

**Typ:** `string[]`

Stellen CSS-Dateien zur Verfügung, um das Aussehen deines Starlight-Projekts anzupassen.

Unterstützt lokale CSS-Dateien relativ zum Stammverzeichnis deines Projekts, z.B. `'./src/custom.css'`, und CSS, die du als npm-Modul installiert hast, z.B. `'@fontsource/roboto'`.

```js
starlight({
  customCss: ['./src/custom-styles.css', '@fontsource/roboto'],
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

### `lastUpdated`

**Typ:** `boolean`  
**Standard:** `false`

Legt fest, ob in der Fußzeile angezeigt werden soll, wann die Seite zuletzt aktualisiert wurde.

Standardmäßig verwendet diese Funktion die Git-Historie Ihres Repositorys und kann auf einigen Bereitstellungsplattformen, die [shallow clones](https://git-scm.com/docs/git-clone/de#git-clone---depthltTiefegt) durchführen, nicht genau sein. Eine Seite kann diese Einstellung oder das Git-basierte Datum mit dem [`lastUpdated` Frontmatter-Feld](/de/reference/frontmatter/#lastupdated) überschreiben.

### `pagination`

**Typ:** `boolean`  
**Standard:** `true`

Legt fest, ob die Fußzeile Links zur vorherigen und nächsten Seite enthalten soll.

Eine Seite kann diese Einstellung oder den Linktext und/oder die URL mit Hilfe der Frontmatter-Felder [`prev`](/de/reference/frontmatter/#prev) und [`next`](/de/reference/frontmatter/#next) überschreiben.

### `favicon`

**Typ:** `string`  
**Standard:** `'/favicon.svg'`

Legt den Pfad des Standard-Favicons für deine Website fest. Dieses sollte sich im Verzeichnis `public/` befinden und eine gültige Icon-Datei (`.ico`, `.gif`, `.jpg`, `.png` oder `.svg`) sein.

```js
starlight({
  favicon: '/images/favicon.svg',
}),
```

Wenn du zusätzliche Varianten oder Fallback-Favicons festlegen musst, kannst du diese mit der Option [`head`](#head) Tags hinzufügen:

```js
starlight({
  favicon: '/images/favicon.svg'.
  head: [
    // ICO-Favicon als Fallback für Safari hinzufügen
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        href:'/images/favicon.ico',
        sizes: '32x32',
      },
    },
  ],
});
```
