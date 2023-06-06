---
title: Frontmatter Reference
description: Une vue d'ensemble des champs frontmatter par défaut pris en charge par Starlight.
---

Vous pouvez personnaliser des pages Markdown et MDX individuelles dans Starlight en définissant des valeurs dans leur page de garde. Par exemple, une page normale peut définir les champs `title` et `description` :

```md
---
title: A propos de ce projet
description: En savoir plus sur le projet sur lequel je travaille.
---

Bienvenue sur la page "à propos" !
```

## Champs de la page d'accueil

### `title` (obligatoire)

**type:** `string`

Vous devez fournir un titre pour chaque page. Il sera affiché en haut de la page, dans les onglets du navigateur et dans les métadonnées de la page.

### `description`

**type:** `string`

La description de la page est utilisée pour les métadonnées de la page et sera reprise par les moteurs de recherche et dans les aperçus des médias sociaux.

### `editUrl`

**type:** `string | boolean`

Remplace la [configuration globale `editLink`](/fr/reference/configuration/#editlink). Mettez `false` pour désactiver le lien "Editer la page" pour une page spécifique ou pour fournir une URL alternative où le contenu de cette page est éditable.

### `head`

**type:** [`HeadConfig[]`](/fr-FR/reference/configuration/#headconfig)

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
