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

Sovrascrive la [configurazione globale `editLink`](/it/reference/configuration/#editlink). Metti a `false` per disabilitare "Modifica la pagina" per quella specifica oppure fornisci un link alternativo.

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
Cambia i livelli di titoli inclusi o, se messo a  `false`, nasconde la tabella dei contenuti della pagina.

### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

Definisce il layout per la pagina.
Le pagine utilizzano `'doc'` come predefinita.
Se valorizzato a `'splash'` viene utilizzato un layout senza barre laterali ottimale per la pagina iniziale.

### `hero`

**type:** [`HeroConfig`](#heroconfig)

Aggiunge un componente hero all'inizio della pagina. Funziona bene con `template : splash`.

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
    // Chemin relatif vers une image dans votre référentiel.
    file?: string;
    // HTML brut à utiliser dans l'emplacement de l'image.
    // Il peut s'agir d'une balise `<img>` personnalisée ou d'une balise `<svg>` en ligne.
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
