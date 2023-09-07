---
title: Référence du frontmatter
description: Une vue d'ensemble des champs du frontmatter par défaut pris en charge par Starlight.
---

Vous pouvez personnaliser des pages Markdown et MDX individuelles dans Starlight en définissant des valeurs dans leur frontmatter. Par exemple, une page normale peut définir les champs `title` et `description` :

```md
---
title: A propos de ce projet
description: En savoir plus sur le projet sur lequel je travaille.
---

Bienvenue sur la page "à propos" !
```

## Champs du frontmatter

### `title` (obligatoire)

**type:** `string`

Vous devez fournir un titre pour chaque page. Il sera affiché en haut de la page, dans les onglets du navigateur et dans les métadonnées de la page.

### `description`

**type:** `string`

La description de la page est utilisée pour les métadonnées de la page et sera reprise par les moteurs de recherche et dans les aperçus des médias sociaux.

### `editUrl`

**type:** `string | boolean`

Remplace la [configuration globale `editLink`](/fr/reference/configuration/#editlink). Mettez `false` pour désactiver le lien "Modifier cette page" pour une page spécifique ou pour fournir une URL alternative où le contenu de cette page est éditable.

### `head`

**type:** [`HeadConfig[]`](/fr/reference/configuration/#headconfig)

Vous pouvez ajouter des balises supplémentaires au champ `<head>` de votre page en utilisant le champ `head` frontmatter. Cela signifie que vous pouvez ajouter des styles personnalisés, des métadonnées ou d'autres balises à une seule page. Similaire à [l'option globale `head`](/fr/reference/configuration/#head).

```md
---
title: A propos de nous
head:
  # Utiliser une balise <title> personnalisée
  - tag: title
    content: Titre personnalisé à propos de nous
---
```

### `tableOfContents`

**type:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Remplace la [configuration globale `tableOfContents`](/fr/reference/configuration/#tableofcontents).
Personnalisez les niveaux d'en-tête à inclure ou mettez `false` pour cacher la table des matières sur cette page.

```md
---
title: Pagee avec seulement des H2s dans la table des matières
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
title: Page sans table des matières
tableOfContents: false
---
```

### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

Définit le modèle de mise en page pour cette page.
Les pages utilisent la mise en page `'doc'`' par défaut.
La valeur `'splash''` permet d'utiliser une mise en page plus large, sans barres latérales, conçue pour les pages d'atterrissage.

### `hero`

**type:** [`HeroConfig`](#heroconfig)

Ajoute un composant héros en haut de la page. Fonctionne bien avec `template : splash`.

Par exemple, cette configuration montre quelques options communes, y compris le chargement d'une image depuis votre dépôt.

```md
---
title: Ma page d'accueil
template: splash
hero:
  title: 'Mon projet : Stellar Stuffer Sooner'
  tagline: Emmenez vos affaires sur la lune et revenez-y en un clin d'œil.
  image:
    alt: Un logo aux couleurs vives et scintillantes
    file: ../../assets/logo.png
  actions:
    - text: En savoir plus
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: Voir sur GitHub
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
    // Chemin relatif vers une image dans votre dépôt.
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

### `banner`

**type:** `{ content: string }`

Montrera une bannière d'annonce en haut de cette page.

La valeur `content` peut inclure du HTML pour les liens ou d'autres contenus.
Par exemple, cette page affiche une bannière comprenant un lien vers `example.com`.

```md
---
title: Page avec une bannière
banner:
  content: |
    On a lancé quelque chose de cool !
    <a href="https://example.com">Allez-y</a>
---
```

### `lastUpdated`

**type:** `Date | boolean`

Remplace la [configuration globale `lastUpdated`](/fr/reference/configuration/#lastupdated). Si une date est spécifiée, elle doit être un [horodatage YAML](https://yaml.org/type/timestamp.html) valide et remplacera la date stockée dans l'historique Git pour cette page.

```md
---
title: Page avec une date de dernière mise à jour personnalisée
lastUpdated: 2022-08-09
---
```

### `prev`

**type:** `boolean | string | { link?: string; label?: string }`

Remplace la [configuration globale `pagination`](/fr/reference/configuration/#pagination). Si un string est spécifié, le texte du lien généré sera remplacé et si un objet est spécifié, le lien et le texte seront remplacés.

```md
---
# Masquer le lien de la page précédente
prev: false
---
```

```md
---
# Remplacer le texte du lien de la page
prev: Poursuivre the tutorial
---
```

```md
---
# Remplacer le lien et le texte de la page
prev:
  link: /unrelated-page/
  label: Consultez cette autre page
---
```

### `next`

**type:** `boolean | string | { link?: string; label?: string }`

La même chose que [`prev`](#prev) mais pour le lien de la page suivante.

```md
---
# Masquer le lien de la page suivante
next: false
---
```

### `pagefind`

**type:** `boolean`  
**default:** `true`

Définit si cette page doit être incluse dans l'index de recherche de [Pagefind](https://pagefind.app/). Définissez la valeur à `false` pour exclure une page des résultats de recherche :

```md
---
# Exclut cette page de l'index de recherche
pagefind: false
---
```

### `sidebar`

**type:** `{ label?: string; order?: number; hidden?: boolean; badge?: string | BadgeConfig }`

Contrôler l'affichage de cette page dans la [barre latérale](/fr/reference/configuration/#sidebar), lors de l'utilisation d'un groupe de liens généré automatiquement.

#### `label`

**type:** `string`  
**default:** the page [`title`](#title-required)

Définir l'étiquette de cette page dans la barre latérale lorsqu'elle est affichée dans un groupe de liens généré automatiquement.

```md
---
title: About this project
sidebar:
  label: About
---
```

#### `order`

**type:** `number`

Contrôler l'ordre de cette page lors du tri d'un groupe de liens généré automatiquement.
Les numéros inférieurs sont affichés plus haut dans le groupe de liens.

```md
---
title: Page à afficher en premier
sidebar:
  order: 1
---
```

#### `hidden`

**type:** `boolean`  
**default:** `false`

Empêche cette page d'être incluse dans un groupe de liens généré automatiquement.

```md
---
title: Page à masquer de la barre latérale générée automatiquement
sidebar:
  hidden: true
---
```

#### `badge`

**type:** <code>string | <a href="/fr/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Ajoute un badge à la page dans la barre latérale lorsqu'elle est affichée dans un groupe de liens généré automatiquement.
Lors de l'utilisation d'une chaîne de caractères, le badge sera affiché avec une couleur d'accentuation par défaut.
Passez éventuellement un [objet `BadgeConfig`](/fr/reference/configuration/#badgeconfig) avec les propriétés `text` et `variant` pour personnaliser le badge.

```md
---
title: Page avec un badge
sidebar:
  # Utilise la variante par défaut correspondant à la couleur d'accentuation de votre site
  badge: Nouveau
---
```

```md
---
title: Page avec un badge
sidebar:
  badge:
    text: Expérimental
    variant: caution
---
```
