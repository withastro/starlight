---
title: Référence du frontmatter
description: Une vue d'ensemble des champs du frontmatter par défaut pris en charge par Starlight.
---

Vous pouvez personnaliser des pages Markdown et MDX individuelles dans Starlight en définissant des valeurs dans leur frontmatter. Par exemple, une page normale peut définir les champs `title` et `description` :

```md {3-4}
---
# src/content/docs/exemple.md
title: A propos de ce projet
description: En savoir plus sur le projet sur lequel je travaille.
---

Bienvenue sur la page "à propos" !
```

## Champs du frontmatter

### `title` (obligatoire)

**Type :** `string`

Vous devez fournir un titre pour chaque page. Il sera affiché en haut de la page, dans les onglets du navigateur et dans les métadonnées de la page.

### `description`

**Type :** `string`

La description de la page est utilisée pour les métadonnées de la page et sera reprise par les moteurs de recherche et dans les aperçus des médias sociaux.

### `slug`

**type**: `string`

Remplace le slug de la page. Consultez [« Définition d’identifiants personnalisés »](https://docs.astro.build/fr/guides/content-collections/#définition-didentifiants-personnalisés) dans la documentation d'Astro pour plus de détails.

### `editUrl`

**Type :** `string | boolean`

Remplace la [configuration globale `editLink`](/fr/reference/configuration/#editlink). Mettez `false` pour désactiver le lien « Modifier cette page » pour une page spécifique ou pour fournir une URL alternative où le contenu de cette page est éditable.

### `head`

**Type :** [`HeadConfig[]`](/fr/reference/configuration/#headconfig)

Vous pouvez ajouter des balises supplémentaires au champ `<head>` de votre page en utilisant le champ `head` frontmatter. Cela signifie que vous pouvez ajouter des styles personnalisés, des métadonnées ou d'autres balises à une seule page. Similaire à [l'option globale `head`](/fr/reference/configuration/#head).

```md
---
# src/content/docs/exemple.md
title: A propos de nous
head:
  # Utiliser une balise <title> personnalisée
  - tag: title
    content: Titre personnalisé à propos de nous
---
```

### `tableOfContents`

**Type :** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Remplace la [configuration globale `tableOfContents`](/fr/reference/configuration/#tableofcontents).
Personnalisez les niveaux d'en-tête à inclure ou mettez `false` pour cacher la table des matières sur cette page.

```md
---
# src/content/docs/exemple.md
title: Page avec seulement des H2 dans la table des matières
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
# src/content/docs/exemple.md
title: Page sans table des matières
tableOfContents: false
---
```

### `template`

**Type :** `'doc' | 'splash'`  
**Par défaut :** `'doc'`

Définit le modèle de mise en page pour cette page.
Les pages utilisent la mise en page `'doc'`' par défaut.
La valeur `'splash'` permet d'utiliser une mise en page plus large, sans barres latérales, conçue pour les pages d'atterrissage.

### `hero`

**Type :** [`HeroConfig`](#heroconfig)

Ajoute un composant héros en haut de la page. Fonctionne bien avec `template : splash`.

Par exemple, cette configuration montre quelques options communes, y compris le chargement d'une image depuis votre dépôt.

```md
---
# src/content/docs/exemple.md
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
    - text: Voir sur GitHub
      link: https://github.com/astronaut/my-project
      icon: external
      variant: minimal
      attrs:
        rel: me
---
```

Vous pouvez afficher différentes versions de l'image de premier plan en mode clair et sombre.

```md
---
# src/content/docs/exemple.md
hero:
  image:
    alt: Un logo scintillant aux couleurs vives
    dark: ../../assets/logo-dark.png
    light: ../../assets/logo-light.png
---
```

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?:
    | {
        // Chemin relatif vers une image dans votre dépôt.
        file: string;
        // Alternative textuelle pour rendre l'image accessible aux technologies d'assistance.
        alt?: string;
      }
    | {
        // Chemin relatif vers une image dans votre dépôt à utiliser pour le mode sombre.
        dark: string;
        // Chemin relatif vers une image dans votre dépôt à utiliser pour le mode clair.
        light: string;
        // Alternative textuelle pour rendre l'image accessible aux technologies d'assistance.
        alt?: string;
      }
    | {
        // HTML brut à utiliser dans le slot de l'image.
        // Peut être une balise `<img>` personnalisée ou une balise `<svg>` en ligne.
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

**Type :** `{ content: string }`

Montrera une bannière d'annonce en haut de cette page.

La valeur `content` peut inclure du HTML pour les liens ou d'autres contenus.
Par exemple, cette page affiche une bannière comprenant un lien vers `example.com`.

```md
---
# src/content/docs/exemple.md
title: Page avec une bannière
banner:
  content: |
    On a lancé quelque chose de cool !
    <a href="https://example.com">Allez-y</a>
---
```

### `lastUpdated`

**Type :** `Date | boolean`

Remplace la [configuration globale `lastUpdated`](/fr/reference/configuration/#lastupdated). Si une date est spécifiée, elle doit être un [horodatage YAML](https://yaml.org/type/timestamp.html) valide et remplacera la date stockée dans l'historique Git pour cette page.

```md
---
# src/content/docs/exemple.md
title: Page avec une date de dernière mise à jour personnalisée
lastUpdated: 2022-08-09
---
```

### `prev`

**Type :** `boolean | string | { link?: string; label?: string }`

Remplace la [configuration globale `pagination`](/fr/reference/configuration/#pagination). Si une chaîne de caractères est spécifiée, le texte du lien généré sera remplacé et si un objet est spécifié, le lien et le texte seront remplacés.

```md
---
# src/content/docs/exemple.md
# Masquer le lien de la page précédente
prev: false
---
```

```md
---
# src/content/docs/exemple.md
# Remplacer le texte du lien de la page
prev: Poursuivre le tutoriel
---
```

```md
---
# src/content/docs/exemple.md
# Remplacer le lien et le texte de la page
prev:
  link: /unrelated-page/
  label: Consultez cette autre page
---
```

### `next`

**Type :** `boolean | string | { link?: string; label?: string }`

La même chose que [`prev`](#prev) mais pour le lien de la page suivante.

```md
---
# src/content/docs/exemple.md
# Masquer le lien de la page suivante
next: false
---
```

### `pagefind`

**Type :** `boolean`  
**Par défaut :** `true`

Définit si cette page doit être incluse dans l'index de recherche de [Pagefind](https://pagefind.app/). Définissez la valeur à `false` pour exclure une page des résultats de recherche :

```md
---
# src/content/docs/exemple.md
# Exclut cette page de l'index de recherche
pagefind: false
---
```

### `draft`

**Type :** `boolean`  
**Par défaut :** `false`

Définit si cette page doit être considérée comme une ébauche et ne pas être incluse dans les [déploiements en production](https://docs.astro.build/fr/reference/cli-reference/#astro-build). Définissez la valeur à `true` pour marquer une page comme une ébauche et la rendre visible uniquement pendant le développement.

```md
---
# src/content/docs/exemple.md
# Exclure cette page des déploiements en production
draft: true
---
```

Puisque les ébauches ne sont pas incluses lors d'un déploiement, vous ne pouvez pas ajouter des ébauches directement à la configuration de la barre latérale de navigation de votre site en utilisant des [slugs](/fr/guides/sidebar/#liens-internes).
Les ébauches situées dans des répertoires utilisés pour les [liens de barre latérale générés automatiquement](/fr/guides/sidebar/#liens-générés-automatiquement) sont automatiquement exclues des déploiements en production.

### `sidebar`

**Type :** [`SidebarConfig`](#sidebarconfig)

Contrôler l'affichage de cette page dans la [barre latérale](/fr/reference/configuration/#sidebar), lors de l'utilisation d'un groupe de liens généré automatiquement.

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

**Type :** `string`  
**Par défaut :** [`title`](#title-obligatoire) de la page

Définir l'étiquette de cette page dans la barre latérale lorsqu'elle est affichée dans un groupe de liens généré automatiquement.

```md
---
# src/content/docs/exemple.md
title: À propos de ce projet
sidebar:
  label: À propos
---
```

#### `order`

**Type :** `number`

Contrôler l'ordre de cette page lors du tri d'un groupe de liens généré automatiquement.
Les numéros inférieurs sont affichés plus haut dans le groupe de liens.

```md
---
# src/content/docs/exemple.md
title: Page à afficher en premier
sidebar:
  order: 1
---
```

#### `hidden`

**Type :** `boolean`  
**Par défaut :** `false`

Empêche cette page d'être incluse dans un groupe de liens généré automatiquement.

```md
---
# src/content/docs/exemple.md
title: Page à masquer de la barre latérale générée automatiquement
sidebar:
  hidden: true
---
```

#### `badge`

**Type :** <code>string | <a href="/fr/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Ajoute un badge à la page dans la barre latérale lorsqu'elle est affichée dans un groupe de liens généré automatiquement.
Lors de l'utilisation d'une chaîne de caractères, le badge sera affiché avec une couleur d'accentuation par défaut.
Passez éventuellement un [objet `BadgeConfig`](/fr/reference/configuration/#badgeconfig) avec les propriétés `text`, `variant`, et `class` pour personnaliser le badge.

```md
---
# src/content/docs/exemple.md
title: Page avec un badge
sidebar:
  # Utilise la variante par défaut correspondant à la couleur d'accentuation de votre site
  badge: Nouveau
---
```

```md
---
# src/content/docs/exemple.md
title: Page avec un badge
sidebar:
  badge:
    text: Expérimental
    variant: caution
---
```

#### `attrs`

**Type :** `Record<string, string | number | boolean | undefined>`

Attributs HTML à ajouter au lien de la page dans la barre latérale lorsqu'il est affiché dans un groupe de liens généré automatiquement.
Si [`autogenerate.attrs`](/fr/guides/sidebar/#attributs-html-personnalisés-pour-les-liens-générés-automatiquement) est défini pour le groupe généré automatiquement auquel cette page appartient, les attributs du frontmatter seront fusionnés avec les attributs du groupe.

```md
---
# src/content/docs/exemple.md
title: Page s'ouvrant dans un nouvel onglet
sidebar:
  # Ouvre la page dans un nouvel onglet
  attrs:
    target: _blank
---
```

## Personnaliser le schéma du frontmatter

Le schéma du frontmatter de la collection de contenus `docs` de Starlight est configuré dans `src/content.config.ts` en utilisant l'utilitaire `docsSchema()` :

```ts {4,7}
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
```

Consultez [« Définir un schéma de collection de contenus »](https://docs.astro.build/fr/guides/content-collections/#définition-dun-schéma-de-collection) dans la documentation d'Astro pour en savoir plus sur les schémas de collection de contenus.

`docsSchema()` accepte les options suivantes :

### `extend`

**Type :** Schéma Zod ou fonction qui retourne un schéma Zod  
**Par défaut :** `z.object({})`

Étendez le schéma de Starlight avec des champs supplémentaires en définissant `extend` dans les options de `docsSchema()`.
La valeur doit être un [schéma Zod](https://docs.astro.build/fr/guides/content-collections/#définition-des-types-de-données-avec-zod).

Dans l'exemple suivant, nous définissons un type plus strict pour `description` pour le rendre obligatoire et ajouter un nouveau champ `category` facultatif :

```ts {11-16}
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Rend un champ de base obligatoire au lieu de facultatif.
        description: z.string(),
        // Ajoute un nouveau champ au schéma.
        category: z.enum(['tutoriel', 'guide', 'référence']).optional(),
      }),
    }),
  }),
};
```

Pour tirer parti de l'[utilitaire `image()` d'Astro](https://docs.astro.build/fr/guides/images/#images-dans-les-collections-de-contenu), utilisez une fonction qui retourne votre extension de schéma :

```ts {11-16}
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: ({ image }) => {
        return z.object({
          // Ajoute un champ qui doit être résolu par une image locale.
          cover: image(),
        });
      },
    }),
  }),
};
```
