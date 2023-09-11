---
title: Riferimenti frontmatter
description: Una panoramica sui campi predefiniti del frontmatter Starlight.
---

Puoi personalizzare pagine Markdown e MDX in Starlight definendo i valori nel frontmatter. Per esempio, una pagina potrebbe definire `title` e `description` :

```md
---
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

### `editUrl`

**type:** `string | boolean`

Sovrascrive la [configurazione globale `editLink`](/it/reference/configuration/#editlink). Metti a `false` per disabilitare "Modifica la pagina" per quella pagina specifica oppure fornisci un link alternativo.

### `head`

**type:** [`HeadConfig[]`](/it/reference/configuration/#headconfig)

Puoi aggiungere tag aggiuntivi nell'`<head>` della pagina utilizzando la chiave `head` nel frontmatter. Questo significa che puoi aggiungere stili personalizzati, metadati o altri tag in una pagina. Il funzionamento è simile [all'opzione globale `head`](/it/reference/configuration/#head).

```md
---
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
title: Pagina con solo H2 nella tabella dei contenuti della pagina
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
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

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?: {
    alt?: string;
    // Percorso relativo ad un’immagine dentro il tuo progetto.
    file?: string;
    // HTML non elaborato da utilizzare al posto dell'immagine.
    // Potrebbe essere un tag personalizzato `<img>` o `<svg>` in linea.
    html?: string;
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
title: Pagina con una data di ultimo aggiornamento personalizzata
lastUpdated: 2022-08-09
---
```

### `prev`

**type:** `boolean | string | { link?: string; label?: string }`

Sostituisce l'[opzione globale `paginazione`](/it/reference/configuration/#pagination). Se viene specificata una stringa, il testo del collegamento generato verrà sostituito e se viene specificato un oggetto, sia il collegamento che il testo verranno sovrascritti.

```md
---
# Nascondi il collegamento alla pagina precedente
prev: false
---
```

```md
---
# Sostituisci il testo del collegamento della pagina precedente
prev: Continua il tutorial
---
```

```md
---
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
# Nascondi il collegamento alla pagina successiva
next: false
---
```

### `sidebar`

**type:** `{ label?: string; order?: number; hidden?: boolean; badge?: string | BadgeConfig }`

Controlla il modo in cui questa pagina viene visualizzata nella [barra laterale](/it/reference/configuration/#sidebar), quando si utilizza un gruppo di collegamenti generato automaticamente.

#### `label`

**type:** `string`  
**default:** the page [`title`](#title-required)

Imposta l'etichetta per questa pagina nella barra laterale quando viene visualizzata in un gruppo di collegamenti generato automaticamente.

```md
---
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
title: Pagina da nascondere dalla barra laterale generata automaticamente
sidebar:
  hidden: vero
---
```

#### `badge`

**type:** <code>string | <a href="/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Aggiungi un badge alla pagina nella barra laterale quando viene visualizzata in un gruppo di collegamenti generato automaticamente.
Quando si utilizza una stringa, il badge verrà visualizzato con un colore in risalto predefinito.
Facoltativamente, passa un [oggetto `BadgeConfig`](/it/reference/configuration/#badgeconfig) con i campi `text` e `variant` per personalizzare il badge.

```md
---
title: Pagina con un badge
sidebar:
  # Utilizza la variante predefinita corrispondente al colore principale del tuo sito
  badge: nuovo
---
```

```md
---
title: Pagina con un badge
sidebar:
  badge:
    text: Sperimentale
    variant: caution
---
```
