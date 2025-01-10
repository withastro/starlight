---
title: Routendaten Referenz
description: Die vollständige Referenzdokumentation für Starlights Routendatenobjekt.
sidebar:
  label: Routendaten
---

Das Routendatenobjekt von Starlight enthält Informationen über die aktuelle Seite.
Erfahre mehr darüber, wie das Datenmodell von Starlight funktioniert, in der [„Routendaten“-Anleitung](/de/guides/route-data/).

In Astro-Komponenten greifst du auf die Routendaten von `Astro.locals.starlightRoute` zu:

```astro {4}
---
// src/components/Individuell.astro

const { hasSidebar } = Astro.locals.starlightRoute;
---
```

In der [Routen-Middleware](/de/guides/route-data/#anpassen-der-routendaten) greifst du auf die Routendaten aus dem Kontextobjekt zu, das an deine Middleware-Funktion übergeben wird:

```ts {5}
// src/routeData.ts
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
  const { hasSidebar } = context.locals.starlightRoute;
});
```

## `starlightRoute`

Das Objekt `starlightRoute` hat die folgenden Eigenschaften:

### `dir`

**Typ:** `'ltr' | 'rtl'`

Schreibrichtung der Seite.

### `lang`

**Typ:** `string`

BCP-47-Sprachkennzeichen für das Gebietsschema dieser Seite, z.B. `de`, `zh-CN` oder `pt-BR`.

### `locale`

**Typ:** `string | undefined`

Der Basispfad, unter dem eine Sprache angeboten wird. `undefined` für Root-Locale-Slugs.

### `siteTitle`

**Typ:** `string`

Der Seitentitel für das Gebietsschema dieser Seite.

### `siteTitleHref`

**Typ:** `string`

Der Wert für das Attribut `href` des Seitentitels, der auf die Homepage zurückverweist, z. B. `/`.
Bei mehrsprachigen Websites wird hier das aktuelle Gebietsschema angegeben, z. B. `/en/` oder `/zh-cn/`.

### `slug`

**Typ:** `string`

Der aus dem Dateinamen des Inhalts generierte Slug für diese Seite.

Diese Eigenschaft ist veraltet und wird in einer zukünftigen Version von Starlight entfernt werden.
Stelle auf die neue Content Layer API um, indem du [Starlights `docsLoader`](/de/manual-setup/#konfigurieren-von-inhaltssammlungen) benutzt und verwende stattdessen die Eigenschaft [`id`](#id).

### `id`

**Typ:** `string`

Der Slug für diese Seite oder die eindeutige ID für diese Seite, die auf dem Dateinamen des Inhalts basiert, wenn du das Flag [`legacy.collections`](https://docs.astro.build/de/reference/legacy-flags/#collections) benutzt.

### `isFallback`

**Typ:** `true | undefined`

`true`, wenn diese Seite in der aktuellen Sprache unübersetzt ist und Fallback-Inhalte aus dem Standardgebietsschema verwendet.
Wird nur in mehrsprachigen Sites verwendet.

### `entryMeta`

**Typ:** `{ dir: 'ltr' | 'rtl'; lang: string }`

Gebietsschema-Metadaten für den Seiteninhalt. Du kannst von den Werten der Top-Level-Locale unterscheiden, wenn eine Seite Fallback-Inhalte verwendet.

### `entry`

Der Astro-Inhaltssammlungseintrag für die aktuelle Seite.
Beinhaltet Frontmatter-Werte für die aktuelle Seite in `entry.data`.

```ts
entry: {
  data: {
    title: string;
    description: string | undefined;
    // usw.
  }
}
```

Erfahre mehr über die Form dieses Objekts in der [Astros Eintragstyp-Sammlung](https://docs.astro.build/de/reference/modules/astro-content/#collectionentry) Referenz.

### `sidebar`

**Typ:** `SidebarEntry[]`

Seitennavigationseinträge für diese Seite.

### `hasSidebar`

**Typ:** `boolean`

Ob die Seitenleiste auf dieser Seite angezeigt werden soll oder nicht.

### `pagination`

**Typ:** `{ prev?: Link; next?: Link }`

Links zur vorherigen und nächsten Seite in der Seitenleiste, falls aktiviert.

### `toc`

**Typ:** `{ minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] } | undefined`

Inhaltsverzeichnis für diese Seite, falls aktiviert.

### `headings`

**Typ:** `{ depth: number; slug: string; text: string }[]`

Array aller Markdown-Überschriften, die aus der aktuellen Seite extrahiert wurden.
Verwende stattdessen [`toc`](#toc), wenn du einen Inhaltsverzeichnis-Komponenten erstellen willst, welches die Konfigurationsoptionen von Starlight berücksichtigt.

### `lastUpdated`

**Typ:** `Date | undefined`

JavaScript `Date` Objekt, welches angibt, wann diese Seite zuletzt aktualisiert wurde, falls aktiviert.

### `editUrl`

**Typ:** `URL | undefined`

`URL`-Objekt für die Adresse, unter der diese Seite bearbeitet werden kann, falls aktiviert.
