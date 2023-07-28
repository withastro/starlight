---
title: Création de contenu en Markdown
description: Un aperçu de la syntaxe Markdown prise en charge par Starlight.
---

Starlight prend en charge l'ensemble de la syntaxe [Markdown](https://daringfireball.net/projects/markdown/) dans les fichiers `.md` ainsi que la syntaxe frontale [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) pour définir des métadonnées telles qu'un titre et une description.

Veillez à consulter les [MDX docs](https://mdxjs.com/docs/what-is-mdx/#markdown) ou les [Markdoc docs](https://markdoc.dev/docs/syntax) si vous utilisez ces formats de fichiers, car la prise en charge et l'utilisation de Markdown peuvent varier.

## Styles en ligne

Le texte peut être **gras**, _italique_, ou ~~barré~~.

```md
Le texte peut être **gras**, _italique_, ou ~~barré~~.
```

Vous pouvez [faire un lien vers une autre page](/fr/getting-started/).

```md
Vous pouvez [faire un lien vers une autre page](/fr/getting-started/).
```

Vous pouvez mettre en évidence le `code en ligne` à l'aide d'un astérisque.

```md
Vous pouvez mettre en évidence le `code en ligne` à l'aide de barres de défilement.
```

## Images

Les images dans Starlight utilisent [la prise en charge intégrée des ressources optimisées d'Astro](https://docs.astro.build/en/guides/assets/).

Markdown et MDX supportent la syntaxe Markdown pour l'affichage des images qui inclut le texte alt pour les lecteurs d'écran et les technologies d'assistance.

![Une illustration de planètes et d'étoiles avec le mot "astro"](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![Une illustration de planètes et d'étoiles avec le mot "astro"](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

Les chemins d'accès relatifs aux images sont également supportés pour les images stockées localement dans votre projet.

```md
// src/content/docs/page-1.md

![Une fusée dans l'espace](../../assets/images/rocket.svg)
```

## En-têtes

Vous pouvez structurer le contenu à l'aide d'un titre. En Markdown, les titres sont indiqués par un nombre de `#` en début de ligne.

### Comment structurer le contenu d'une page dans Starlight

Starlight est configuré pour utiliser automatiquement le titre de votre page comme titre de premier niveau et inclura un titre "Aperçu" en haut de la table des matières de chaque page. Nous vous recommandons de commencer chaque page par un paragraphe de texte normal et d'utiliser des titres de page à partir de `<h2>` :

```md
---
title: Guide Markdown
description: Comment utiliser Markdown dans Starlight
---

Cette page décrit comment utiliser Markdown dans Starlight.

## Styles en ligne

## Titres
```

### Liens d'ancrage automatiques pour les titres

L'utilisation de titres en Markdown vous donnera automatiquement des liens d'ancrage afin que vous puissiez accéder directement à certaines sections de votre page :

```md
---
title: Ma page de contenu
description: Comment utiliser les liens d'ancrage intégrés de Starlight
---

## Introduction

Je peux faire un lien vers [ma conclusion](#conclusion) plus bas sur la même page.

## Conclusion

`https://my-site.com/page1/#introduction` renvoie directement à mon Introduction.
```

Les titres de niveau 2 (`<h2>`) et de niveau 3 (`<h3>`) apparaissent automatiquement dans la table des matières de la page.

## Asides

Les Asides (également connus sous le nom de "callouts") sont utiles pour afficher des informations secondaires à côté du contenu principal d'une page.

Starlight fournit une syntaxe Markdown personnalisée pour le rendu des apartés. Les blocs d'apartés sont indiqués en utilisant une paire de triples points `:::` pour envelopper votre contenu, et peuvent être de type `note`, `tip`, `caution` ou `danger`.

Vous pouvez imbriquer n'importe quel autre type de contenu Markdown à l'intérieur d'un aparté, mais les aparté sont mieux adaptés à des morceaux de contenu courts et concis.

### Note aside

:::note
Starlight est une boîte à outils pour sites web de documentation construite avec [Astro](https://astro.build/). Vous pouvez démarrer avec cette commande :

```sh
npm run create astro@latest --template starlight
```

:::

````md
:::note
Starlight est une boîte à outils pour sites web de documentation construite avec [Astro](https://astro.build/). Vous pouvez démarrer avec cette commande :

```sh
npm run create astro@latest --template starlight
```

:::
````

### Titres personnalisés dans les asides

Vous pouvez spécifier un titre personnalisé pour l'aparté entre crochets après le type d'aparté, par exemple `:::tip[Le saviez-vous ?]`.

:::tip[Le saviez-vous ?]
Astro vous aide à construire des sites Web plus rapides grâce à ["Islands Architecture"](https://docs.astro.build/fr/concepts/islands/).
:::

```md
:::tip[Le saviez-vous ?]
Astro vous aide à construire des sites Web plus rapides grâce à ["Islands Architecture"](https://docs.astro.build/fr/concepts/islands/).
:::
```

### Plus de types pour l'aside

Les apartés de type Attention et Danger sont utiles pour attirer l'attention de l'utilisateur sur des détails qui pourraient le perturber. Si vous vous retrouvez à utiliser ces derniers fréquemment, cela pourrait aussi être un signe que ce que vous documentez pourrait bénéficier d'une refonte.

:::caution
Si vous n'êtes pas sûr de vouloir un site de documentation génial, réfléchissez à deux fois avant d'utiliser [Starlight](../../../).
:::

:::danger
Vos utilisateurs peuvent être plus productifs et trouver votre produit plus facile à utiliser grâce aux fonctionnalités utiles de Starlight.

- Navigation claire
- Thème de couleurs configurable par l'utilisateur
- [Support i18n](/fr/guides/i18n)

:::

```md
:::caution
Si vous n'êtes pas sûr de vouloir un site de documentation génial, réfléchissez à deux fois avant d'utiliser [Starlight](../../../).
:::

:::danger
Vos utilisateurs peuvent être plus productifs et trouver votre produit plus facile à utiliser grâce aux fonctionnalités utiles de Starlight.

- Navigation claire
- Thème de couleurs configurable par l'utilisateur
- [Support i18n](/fr/guides/i18n)

:::
```

## Blockquotes

> Il s'agit d'une citation en bloc, couramment utilisée pour citer une autre personne ou un document.
>
> Les guillemets sont indiqués par un `>` au début de chaque ligne.

```md
> Il s'agit d'une citation en bloc, couramment utilisée pour citer une autre personne ou un document.
>
> Les guillemets sont indiqués par un `>` au début de chaque ligne.
```

## Code blocks

Un bloc de code est indiqué par un bloc avec trois crochets <code>```</code> au début et à la fin. Vous pouvez indiquer le langage de programmation utilisé après les premiers crochets.

```js
// Code Javascript avec mise en évidence de la syntaxe.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// Code Javascript avec mise en évidence de la syntaxe.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
Les longs blocs de code d'une seule ligne ne doivent pas être enveloppés. Ils doivent défiler horizontalement s'ils sont trop longs. Cette ligne devrait être suffisamment longue pour le démontrer.
```

## Autres fonctionnalités courantes de Markdown

Starlight prend en charge toutes les autres syntaxes de rédaction Markdown, telles que les listes et les tableaux. Voir [Markdown Cheat Sheet from The Markdown Guide](https://www.markdownguide.org/cheat-sheet/) pour un aperçu rapide de tous les éléments de la syntaxe Markdown.
