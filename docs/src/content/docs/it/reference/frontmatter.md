---
title: Riferimenti frontmatter
description: Una panoramica sui campi predefiniti del frontmatter Starlight.
---

Puoi personalizzare pagine Markdown e MDX in Starlight definendo i valori nel frontmatter. Per esempio, una pagina potrebbe definire `title` e `description` :

```md {3-4}
---
# src/content/docs/example.md
title: A proposito del progetto
description: Scopri di più sul progetto a cui sto lavorando.
---

Benvenuto alla pagina "a proposito del progetto"!
```

## Campi del frontmatter

### `title` (obbligatorio)

**type:** `string`

Devi fornire un titolo ad ogni pagina. Questo sarà usato in testa alla pagina, nelle finestre del browser e nei metadati della pagina.

### `description`

**type:** `string`

La descrizione è utilizzata nei metadati e sarà utilizzata dai motori di ricerca e nelle anteprime nei social.

### `slug`

**type**: `string`

Override the slug of the page. See [“Defining custom slugs”](https://docs.astro.build/en/guides/content-collections/#defining-custom-slugs) in the Astro docs for more details.

### `editUrl`

**type:** `string | boolean`

Sovrascrive la [configurazione globale `editLink`](/it/reference/configuration/#editlink). Metti a `false` per disabilitare "Modifica la pagina" per quella pagina specifica oppure fornisci un link alternativo.

### `head`

**type:** [`HeadConfig[]`](/it/reference/configuration/#headconfig)

Puoi aggiungere tag aggiuntivi nell'`<head>` della pagina utilizzando la chiave `head` nel frontmatter. Questo significa che puoi aggiungere stili personalizzati, metadati o altri tag in una pagina. Il funzionamento è simile [all'opzione globale `head`](/it/reference/configuration/#head).

```md
---
# src/content/docs/example.md
title: Chi siamo
head:
  # Utilizza un <title> personalizzato
  - tag: title
    content: Titolo personalizzato
---
```

### `tableOfContents`

**type:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Sovrascrive la [configurazione globale `tableOfContents`](/it/reference/configuration/#tableofcontents).
Cambia i livelli di titoli inclusi o, se messo a `false`, nasconde la tabella dei contenuti della pagina.

```md
---
# src/content/docs/example.md
title: Pagina con solo H2 nella tabella dei contenuti della pagina
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
# src/content/docs/example.md
title: Pagina senza tabella dei contenuti della pagina
tableOfContents: false
---
```

### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

Definisce il layout per la pagina.
Le pagine utilizzano `'doc'` come predefinita.
Se valorizzato a `'splash'` viene utilizzato un layout senza barre laterali ottimale per la pagina iniziale.

### `hero`

**type:** [`HeroConfig`](#heroconfig)

Aggiunge un componente hero all'inizio della pagina. Funziona bene con `template: splash`.

Per esempio, questa configurazione illustra comuni opzioni, incluso il caricamento di un'immagine.

```md
---
# src/content/docs/example.md
title: La mia pagina principale
template: splash
hero:
  title: 'Il mio progetto: Stellar Stuff Sooner'
  tagline: Porta le tue cose sulla Luna e torna indietro in un battito d'occhio.
  image:
    alt: Un logo brillante e luminoso
    file: ../../assets/logo.png
  actions:
    - text: Dimmi di più
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: Vedi su GitHub
      link: https://github.com/astronaut/my-project
      icon: external
---
```

You can display different versions of the hero image in light and dark modes.

```md
---
# src/content/docs/example.md
hero:
  image:
    alt: A glittering, brightly colored logo
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
        // Relative path to an image in your repository.
        file: string;
        // Alt text to make the image accessible to assistive technology
        alt?: string;
      }
    | {
        // Relative path to an image in your repository to be used for dark mode.
        dark: string;
        // Relative path to an image in your repository to be used for light mode.
        light: string;
        // Alt text to make the image accessible to assistive technology
        alt?: string;
      }
    | {
        // Raw HTML to use in the image slot.
        // Could be a custom `<img>` tag or inline `<svg>`.
        html: string;
      };
  actions?: Array<{
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'minimal';
    icon: string;
  }>;
}
```

### `banner`

**type:** `{ content: string }`

Visualizza un banner di annuncio nella parte superiore di questa pagina.

Il valore `content` può includere HTML per collegamenti o altri contenuti.
Ad esempio, questa pagina visualizza un banner che include un collegamento a `example.com`.

```md
---
# src/content/docs/example.md
title: Pagina con un banner
banner:
  content: |
    Abbiamo appena lanciato qualcosa di interessante!
    <a href="https://example.com">Dai un'occhiata</a>
---
```

### `lastUpdated`

**type:** `Date | boolean`

Sostituisce l'[opzione globale `lastUpdated`](/it/reference/configuration/#lastupdated). Se viene specificata una data, deve essere un [timestamp YAML](https://yaml.org/type/timestamp.html) valido e sovrascriverà la data archiviata nella cronologia Git per questa pagina.

```md
---
# src/content/docs/example.md
title: Pagina con una data di ultimo aggiornamento personalizzata
lastUpdated: 2022-08-09
---
```

### `prev`

**type:** `boolean | string | { link?: string; label?: string }`

Sostituisce l'[opzione globale `paginazione`](/it/reference/configuration/#pagination). Se viene specificata una stringa, il testo del collegamento generato verrà sostituito e se viene specificato un oggetto, sia il collegamento che il testo verranno sovrascritti.

```md
---
# src/content/docs/example.md
# Nascondi il collegamento alla pagina precedente
prev: false
---
```

```md
---
# src/content/docs/example.md
# Sostituisci il testo del collegamento della pagina precedente
prev: Continua il tutorial
---
```

```md
---
# src/content/docs/example.md
# Sostituisci sia il collegamento che il testo della pagina precedente
prev:
  link: /pagina-non-correlata/
  label: Dai un'occhiata a quest'altra pagina
---
```

### `next`

**type:** `boolean | string | { link?: string; label?: string }`

Uguale a [`prev`](#prev) ma per il collegamento alla pagina successiva.

```md
---
# src/content/docs/example.md
# Nascondi il collegamento alla pagina successiva
next: false
---
```

### `pagefind`

**type:** `boolean`  
**default:** `true`

Imposta se questa pagina deve essere inclusa nell'indice di ricerca [Pagefind](https://pagefind.app/). Imposta su `false` per escludere una pagina dai risultati di ricerca:

```md
---
# src/content/docs/example.md
# Nascondi questa pagina dai risultati di ricerca
pagefind: false
---
```

### `sidebar`

**type:** [`SidebarConfig`](#sidebarconfig)

Controlla il modo in cui questa pagina viene visualizzata nella [barra laterale](/it/reference/configuration/#sidebar), quando si utilizza un gruppo di collegamenti generato automaticamente.

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

**type:** `string`  
**default:** the page [`title`](#title-obbligatorio)

Imposta l'etichetta per questa pagina nella barra laterale quando viene visualizzata in un gruppo di collegamenti generato automaticamente.

```md
---
# src/content/docs/example.md
title: Informazioni su questo progetto
sidebar:
  label: Informazioni
---
```

#### `order`

**type:** `number`

Controlla l'ordine di questa pagina quando ordini un gruppo di collegamenti generato automaticamente.
I numeri più bassi vengono visualizzati più in alto nel gruppo di collegamenti.

```md
---
# src/content/docs/example.md
title: Pagina da visualizzare per prima
sidebar:
  order: 1
---
```

#### `hidden`

**type:** `boolean`
**default:** `false`

Impedisce che questa pagina venga inclusa in un gruppo della barra laterale generato automaticamente.

```md
---
# src/content/docs/example.md
title: Pagina da nascondere dalla barra laterale generata automaticamente
sidebar:
  hidden: vero
---
```

#### `badge`

**type:** <code>string | <a href="/it/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Aggiungi un badge alla pagina nella barra laterale quando viene visualizzata in un gruppo di collegamenti generato automaticamente.
Quando si utilizza una stringa, il badge verrà visualizzato con un colore in risalto predefinito.
Facoltativamente, passa un [oggetto `BadgeConfig`](/it/reference/configuration/#badgeconfig) con i campi `text` e `variant` per personalizzare il badge.

```md
---
# src/content/docs/example.md
title: Pagina con un badge
sidebar:
  # Utilizza la variante predefinita corrispondente al colore principale del tuo sito
  badge: nuovo
---
```

```md
---
# src/content/docs/example.md
title: Pagina con un badge
sidebar:
  badge:
    text: Sperimentale
    variant: caution
---
```

#### `attrs`

**type:** `Record<string, string | number | boolean | undefined>`

Attributi HTML da aggiungere al collegamento della pagina nella barra laterale quando viene visualizzato in un gruppo di collegamenti generato automaticamente.

```md
---
# src/content/docs/example.md
title: Pagina che si aprirà in una nuova scheda
sidebar:
  # Apre la pagina in una nuova scheda
  attrs:
    target: _blank
---
```

## Customize frontmatter schema

The frontmatter schema for Starlight’s `docs` content collection is configured in `src/content/config.ts` using the `docsSchema()` helper:

```ts {3,6}
// src/content/config.ts
import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
};
```

Learn more about content collection schemas in [“Defining a collection schema”](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema) in the Astro docs.

`docsSchema()` takes the following options:

### `extend`

**type:** Zod schema or function that returns a Zod schema  
**default:** `z.object({})`

Extend Starlight’s schema with additional fields by setting `extend` in the `docsSchema()` options.
The value should be a [Zod schema](https://docs.astro.build/en/guides/content-collections/#defining-datatypes-with-zod).

In the following example, we provide a stricter type for `description` to make it required and add a new optional `category` field:

```ts {8-13}
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        // Make a built-in field required instead of optional.
        description: z.string(),
        // Add a new field to the schema.
        category: z.enum(['tutorial', 'guide', 'reference']).optional(),
      }),
    }),
  }),
};
```

To take advantage of the [Astro `image()` helper](https://docs.astro.build/en/guides/images/#images-in-content-collections), use a function that returns your schema extension:

```ts {8-13}
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: ({ image }) => {
        return z.object({
          // Add a field that must resolve to a local image.
          cover: image(),
        });
      },
    }),
  }),
};
```
