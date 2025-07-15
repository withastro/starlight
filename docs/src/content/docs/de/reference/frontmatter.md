---
title: Frontmatter Referenz
description: Ein Überblick über die von Starlight unterstützten Standard-Frontmatter-Felder.
sidebar:
  label: Frontmatter
---

Du kannst einzelne Markdown- und MDX-Seiten in Starlight anpassen, indem du Werte in deren Frontmatter setzt. Zum Beispiel könnte eine normale Seite die Felder `title` und `description` setzen:

```md {3-4}
---
# src/content/docs/example.md
title: Über dieses Projekt
description: Erfahre mehr über das Projekt, an dem ich gerade arbeite.
---

Willkommen auf der Info-Seite!
```

## Frontmatter-Felder

### `title` (erforderlich)

**Typ:** `string`

Du musst für jede Seite einen Titel angeben. Dieser wird oben auf der Seite, in Browser-Tabs und in den Seiten-Metadaten angezeigt.

### `description`

**Typ:** `string`

Die Seitenbeschreibung wird für die Metadaten der Seite verwendet und wird von Suchmaschinen und in der Vorschau von sozialen Medien angezeigt.

### `slug`

**Typ**: `string`

Setzt den Slug der Seite außer Kraft. Siehe [„Benutzerdefinierte IDs definieren“](https://docs.astro.build/de/guides/content-collections/#defining-custom-ids) in der Astro-Dokumentation für weitere Details.

### `editUrl`

**Typ:** `string | boolean`

Überschreibt die [globale `editLink`-Konfiguration](/de/reference/configuration/#editlink). Setze die Konfiguration auf `false`, um den Link `Seite bearbeiten` für eine bestimmte Seite zu deaktivieren oder gibt eine alternative URL an, unter welcher der Inhalt dieser Seite bearbeitet werden kann.

### `head`

**Typ:** [`HeadConfig[]`](/de/reference/configuration/#headconfig)

Du kannst zusätzliche Tags zum `<head>` deiner Seite hinzufügen, indem du das Feld `head` Frontmatter verwendest. Dies bedeutet, dass du benutzerdefinierte Stile, Metadaten oder andere Tags zu einer einzelnen Seite hinzufügen kannst. Ähnlich wie bei der [globalen `head` Option](/de/reference/configuration/#head).

```md
---
# src/content/docs/example.md
title: Über uns
head:
  # Benutze einen eigenen <title> Tag
  - tag: title
    content: Benutzerdefinierter "Über uns"-Titel
---
```

### `tableOfContents`

**Typ:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Überschreibt die [globale `tableOfContents`-Konfiguration](/de/reference/configuration/#tableofcontents).
Passe die einzuschließenden Überschriftsebenen an oder setze sie auf `false`, um das Inhaltsverzeichnis auf dieser Seite auszublenden.

```md
---
# src/content/docs/example.md
title: Seite mit nur H2s im Inhaltsverzeichnis
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
# src/content/docs/example.md
title: Seite ohne Inhaltsverzeichnis
tableOfContents: false
---
```

### `template`

**Typ:** `'doc' | 'splash'`  
**Standard:** `'doc'`

Legt die Layoutvorlage für diese Seite fest.
Seiten verwenden standardmäßig das `'doc'`-Layout.
Setze den Typen auf `'splash'`, um ein breiteres Layout ohne Seitenleisten zu verwenden, welches spezifisch für Startseiten entwickelt wurde.

### `hero`

**Typ:** [`HeroConfig`](#heroconfig)

Fügt eine Hero-Komponente oben auf der Seite ein. Kann sehr gut mit `template: splash` kombiniert werden.

Zum Beispiel zeigt diese Konfiguration einige übliche Optionen, einschließlich des Ladens eines Bildes aus deinem Repository.

```md
---
# src/content/docs/example.md
title: Meine Website
template: splash
hero:
  title: 'Mein Projekt: Schnell ins All'
  tagline: Bringe deine Wertgegenstände im Handumdrehen auf den Mond und wieder zurück.
  image:
    alt: Ein glitzerndes, leuchtend farbiges Logo
    file: ~/assets/logo.png
  actions:
    - text: Erzähl mir mehr
      link: /getting-started/
      icon: right-arrow
    - text: Schau mal auf GitHub vorbei
      link: https://github.com/astronaut/mein-projekt
      icon: external
      variant: minimal
      attrs:
        rel: me
---
```

Du kannst verschiedene Versionen der Hero-Komponente im hellen und dunklen Modus anzeigen.

```md
---
# src/content/docs/example.md
hero:
  image:
    alt: Ein glitzerndes, farbenfrohes Logo
    dark: ~/assets/logo-dark.png
    light: ~/assets/logo-light.png
---
```

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?:
    | {
        // Relativer Pfad zu einem Bild in deinem Repository.
        file: string;
        // Alt-Text, um das Bild für unterstützende Technologien zugänglich zu machen
        alt?: string;
      }
    | {
        // Relativer Pfad zu einem Bild in deinem Repository, das für den dunklen Modus verwendet werden soll.
        dark: string;
        // Relativer Pfad zu einem Bild in deinem Repository, das für den hellen Modus verwendet werden soll.
        light: string;
        // Alt-Text, um das Bild für unterstützende Technologien zugänglich zu machen
        alt?: string;
      }
    | {
        // HTML, welches im Bild-Slot verwendet werden soll.
        // Dies kann ein benutzerdefinierter `<img>`-Tag oder ein Inline-`<svg>` sein.
        html: string;
      };
  actions?: Array<{
    text: string;
    link: string;
    variant?: 'primary' | 'secondary' | 'minimal';
    icon?: string;
    attrs?: Record<string, string | number | boolean>;
  }>;
}
```

### `banner`

**Typ:** `{ content: string }`

Zeigt ein Ankündigungsbanner oben auf dieser Seite an.

Der Wert `content` kann HTML für Links oder andere Inhalte enthalten.
Auf dieser Seite wird beispielsweise ein Banner mit einem Link zu `example.com` angezeigt.

```md
---
# src/content/docs/example.md
title: Seite mit Banner
banner:
  content: |
    Wir haben gerade etwas Cooles angefangen!
    <a href="https://example.com">Jetzt besuchen</a>
---
```

### `lastUpdated`

**Typ:** `Date | boolean`

Überschreibt die [globale Option `lastUpdated`](/de/reference/configuration/#lastupdated). Wenn ein Datum angegeben wird, muss es ein gültiger [YAML-Zeitstempel](https://yaml.org/type/timestamp.html) sein und überschreibt somit das im Git-Verlauf für diese Seite gespeicherte Datum.

```md
---
# src/content/docs/example.md
title: Seite mit einem benutzerdefinierten Datum der letzten Aktualisierung
lastUpdated: 2022-08-09
---
```

### `prev`

**Typ:** `boolean | string | { link?: string; label?: string }`

Überschreibt die [globale Option `pagination`](/de/reference/configuration/#pagination). Wenn eine Zeichenkette angegeben wird, wird der generierte Linktext ersetzt und wenn ein Objekt angegeben wird, werden sowohl der Link als auch der Text überschrieben.

```md
---
# src/content/docs/example.md
# Versteckt den Link zur vorherigen Seite
prev: false
---
```

```md
---
# src/content/docs/example.md
# Überschreibe den Linktext der vorherigen Seite
prev: Fortsetzung des Tutorials
---
```

```md
---
# src/content/docs/example.md
# Überschreibe sowohl den Link zur vorherigen Seite als auch den Text
prev:
  link: /unverwandte-seite/
  label: Schau dir diese andere Seite an
---
```

### `next`

**Typ:** `boolean | string | { link?: string; label?: string }`

Dasselbe wie [`prev`](#prev), aber für den Link zur nächsten Seite.

```md
---
# src/content/docs/example.md
# Versteckt den Link zur nächsten Seite
next: false
---
```

### `pagefind`

**Typ:** `boolean`  
**Standard:** `true`

Legt fest, ob diese Seite in den [Pagefind](https://pagefind.app/)-Suchindex aufgenommen werden soll. Setze das Feld auf `false`, um eine Seite von den Suchergebnissen auszuschließen:

```md
---
# src/content/docs/example.md
# Diese Seite aus dem Suchindex ausblenden
pagefind: false
---
```

### `draft`

**Typ:** `boolean`  
**Standard:** `false`

Legt fest, ob diese Seite als Entwurf betrachtet werden soll und nicht in [Produktions-Builds](https://docs.astro.build/de/reference/cli-reference/#astro-build). Setze die Eigenschaft auf `true`, um eine Seite als Entwurf zu markieren und sie nur während der Entwicklung sichtbar zu machen.

```md
---
# src/content/docs/example.md
# Diese Seite von den Produktions-Builds ausschließen
draft: true
---
```

Da Entwurfsseiten nicht in die Build-Ausgabe aufgenommen werden, kannst du keine Entwurfsseiten direkt mit [Slugs](/de/guides/sidebar/#interne-links) zu deiner Seitenleisten&shy;konfiguration hinzufügen.
Entwurfsseiten in Verzeichnissen, die für [autogenerierte Seitenleisten-Gruppen](/de/guides/sidebar/#automatisch-generierte-gruppen) verwendet werden, werden bei Produktions-Builds automatisch ausgeschlossen.

### `sidebar`

**Typ:** [`SidebarConfig`](#sidebarconfig)

Steuert, wie diese Seite in der [Seitenleiste](/de/reference/configuration/#sidebar) angezeigt wird, wenn eine automatisch generierte Linkgruppe verwendet wird.

#### `SidebarConfig`

```ts
interface SidebarConfig {
  label?: string;
  order?: number;
  hidden?: boolean;
  badge?: string | BadgeConfig;
  attrs?: Record<string, string | number | boolean | undefined>;
}
```

#### `label`

**Typ:** `string`  
**Standard:** der Seitentitel ([`title`](#title-erforderlich))

Legt die Bezeichnung für diese Seite in der Seitenleiste fest, wenn sie in einer automatisch generierten Linkgruppe angezeigt wird.

```md
---
# src/content/docs/example.md
title: Über dieses Projekt
sidebar:
  label: Infos
---
```

#### `order`

**Typ:** `number`

Steuere die Reihenfolge dieser Seite beim Sortieren einer automatisch erstellten Gruppe von Links.
Niedrigere Nummern werden in der Linkgruppe weiter oben angezeigt.

```md
---
# src/content/docs/example.md
title: Erste Seite
sidebar:
  order: 1
---
```

#### `hidden`

**Typ:** `boolean`  
**Standard:** `false`

Verhindert, dass diese Seite in eine automatisch generierte Seitenleistengruppe aufgenommen wird.

```md
---
# src/content/docs/example.md
title: Versteckte Seite
sidebar:
  hidden: true
---
```

#### `badge`

**Typ:** <code>string | <a href="/de/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Füge der Seite in der Seitenleiste ein Abzeichen hinzu, wenn es in einer automatisch generierten Gruppe von Links angezeigt wird.
Bei Verwendung einer Zeichenkette wird das Abzeichen mit einer Standard-Akzentfarbe angezeigt.
Optional kann ein [`BadgeConfig` Objekt](/de/reference/configuration/#badgeconfig) mit den Feldern `text`, `variant` and `class` übergeben werden, um das Abzeichen anzupassen.

```md
---
# src/content/docs/example.md
title: Seite mit einem Badge
sidebar:
  # Verwendet die Standardvariante, die der Akzentfarbe deiner Website entspricht
  badge: Neu
---
```

```md
---
# src/content/docs/example.md
title: Seite mit einem Abzeichen
sidebar:
  badge:
    text: Experimentell
    variant: caution
---
```

#### `attrs`

**Typ:** `Record<string, string | number | boolean | undefined>`

HTML-Attribute, die dem Seitenlink in der Seitenleiste hinzugefügt werden, wenn er in einer automatisch generierten Gruppe von Links angezeigt wird.
Wenn [`autogenerate.attrs`](/de/guides/sidebar/#benutzerdefinierte-html-attribute-für-automatisch-generierte-links) für die automatisch generierte Gruppe, zu welcher diese Seite gehört, festgelegt ist, werden Frontmatter-Attribute mit den Gruppenattributen zusammengeführt.

```md
---
# src/content/docs/example.md
title: Seite im neuen Tab öffnen
sidebar:
  # Dies öffnet den Link in einem neuen Tab
  attrs:
    target: _blank
---
```

## Frontmatter-Schema anpassen

Das Frontmatter-Schema für die Starlight-Inhaltssammlung `docs` wird in `src/content.config.ts` mit dem `docsSchema()`-Helper konfiguriert:

```ts {4,7}
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
```

Mehr über Schemata für Inhaltssammlungen erfährst du in [„Definieren eines Sammelschemas“](https://docs.astro.build/de/guides/content-collections/#defining-the-collection-schema) in der Astro-Dokumentation.

`docsSchema()` nimmt die folgenden Optionen an:

### `extend`

**Typ:** Zod-Schema oder Funktion, die ein Zod-Schema zurückgibt  
**Standard:** `z.object({})`

Erweitere das Schema von Starlight um zusätzliche Felder, indem du `extend` in den `docsSchema()` Optionen setzt.
Der Wert sollte ein [Zod-Schema](https://docs.astro.build/de/guides/content-collections/#datentypen-mit-zod-definieren) sein.

Im folgenden Beispiel geben wir einen strengeren Typ für `description` an, um es zur Pflicht zu machen und fügen ein neues optionales Feld `category` hinzu:

```ts {10-15}
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Mache ein eingebautes Feld erforderlich statt optional.
        description: z.string(),
        // Füge dem Schema ein neues Feld hinzu.
        category: z.enum(['tutorial', 'guide', 'reference']).optional(),
      }),
    }),
  }),
};
```

Um die Vorteile der [Astro `image()`-Hilfe](https://docs.astro.build/de/guides/images/#bilder-in-inhaltssammlungen) zu nutzen, verwende eine Funktion, die deine Schemaerweiterung zurückgibt:

```ts {10-15}
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: ({ image }) => {
        return z.object({
          // Füge ein Feld hinzu, das auf ein lokales Bild aufgelöst werden muss.
          cover: image(),
        });
      },
    }),
  }),
};
```
