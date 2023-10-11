---
title: Redéfinition de composants
description: Apprenez à redéfinir les composants intégrés à Starlight pour ajouter des éléments personnalisés à l’interface utilisateur de votre site de documentation.
sidebar:
  badge: Nouveau
---

L'interface utilisateur et les options de configuration par défaut de Starlight sont conçues pour être flexibles et fonctionner pour une variété de contenus. Une grande partie de l'apparence par défaut de Starlight peut être personnalisée grâce au [CSS](/fr/guides/css-and-tailwind/) et aux [options de configuration](/fr/guides/customization/).

Quand vos besoins dépassent ce qui est possible de base, Starlight supporte la création de vos propres composants personnalisés pour étendre ou redéfinir (remplacer complètement) ses composants par défaut.

## Quand redéfinir

Redéfinir les composants par défaut de Starlight peut être utile lorsque :

- Vous souhaitez modifier l'apparence d'une partie de l'interface utilisateur de Starlight d'une manière qui n'est pas possible avec du [CSS personnalisé](/fr/guides/css-and-tailwind/).
- Vous souhaitez modifier le comportement d'une partie de l'interface utilisateur de Starlight.
- Vous souhaitez ajouter certains éléments supplémentaires à l'interface utilisateur existante de Starlight.

## Comment redéfinir

1. Choisissez le composant de Starlight que vous souhaitez redéfinir.
   Vous pouvez trouver une liste complète des composants dans la [référence des redéfinitions](/fr/reference/overrides/).

   Cet exemple va redéfinir le composant [`SocialIcons`](/fr/reference/overrides/#socialicons) de Starlight dans la barre de navigation de la page.

2. Créez un composant Astro pour remplacer le composant de Starlight.
   Cet exemple affiche un lien de contact.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">Me contacter par courriel</a>
   ```

3. Configurez Starlight pour utiliser votre composant personnalisé avec l'option de configuration [`components`](/fr/reference/configuration/#components) dans le fichier `astro.config.mjs` :

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'Ma documentation avec redéfinitions',
         components: {
           // Redéfinit le composant par défaut `SocialIcons`.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Réutiliser un composant intégré

Vous pouvez utiliser avec les composants par défaut de Starlight comme vous le feriez avec les vôtres : en les important et en les affichant dans vos propres composants personnalisés. Cela vous permet de conserver toute l'interface utilisateur de base de Starlight dans votre design, tout en ajoutant des éléments supplémentaires à côté.

L'exemple ci-dessous montre un composant personnalisé qui affiche un lien de courriel suivi du composant `SocialIcons` par défaut :

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">Me contacter par courriel</a>
<Default {...Astro.props}><slot /></Default>
```

Lorsque vous affichez un composant intégré dans un composant personnalisé :

- Décomposez `Astro.props` dans celui-ci. Cela permet de s'assurer qu'il reçoit toutes les données dont il a besoin pour être affiché.
- Ajoutez un élément [`<slot />`](https://docs.astro.build/fr/core-concepts/astro-components/#les-emplacements-slots) à l'intérieur du composant par défaut. Cela permet de s'assurer que si le composant reçoit des éléments enfants, Astro sait où les afficher.

## Utiliser les données de la page

Lorsque vous redéfinissez un composant de Starlight, votre implémentation personnalisée reçoit un objet `Astro.props` standard contenant toutes les données de la page courante.
Cela vous permet d'utiliser ces valeurs pour contrôler la manière dont votre composant est affiché.

Par exemple, vous pouvez lire les valeurs du frontmatter de la page via `Astro.props.entry.data`. Dans l'exemple suivant, un composant [`PageTitle`](/fr/reference/overrides/#pagetitle) de remplacement utilise ces données pour afficher le titre de la page courante :

```astro {5} "{title}"
---
// src/components/Title.astro
import type { Props } from '@astrojs/starlight/props';

const { title } = Astro.props.entry.data;
---

<h1 id="_top">{title}</h1>

<style>
  h1 {
    font-family: 'Comic Sans';
  }
</style>
```

Pour en savoir plus sur les props disponibles, consultez la [référence des redéfinitions](/fr/reference/overrides/#props-des-composants).

### Redéfinir uniquement sur des pages spécifiques

Les redéfinitions de composants s'appliquent à toutes les pages. Cependant, vous pouvez les utiliser conditionnellement grâce aux valeurs de `Astro.props` pour déterminer quand afficher votre interface utilisateur personnalisée, quand afficher l'interface utilisateur par défaut de Starlight, ou même quand afficher quelque chose de complètement différent.

Dans l'exemple suivant, un composant redéfinissant le composant [`Footer`](/fr/reference/overrides/#footer) de Starlight affiche "Construit avec Starlight 🌟" sur la page d'accueil uniquement, et affiche sinon le pied de page par défaut sur toutes les autres pages :

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Construit avec Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Pour en savoir plus sur le rendu conditionnel, consultez le [guide de syntaxe d'Astro](https://docs.astro.build/fr/core-concepts/astro-syntax/#html-dynamique).
