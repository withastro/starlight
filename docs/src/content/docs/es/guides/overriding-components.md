---
title: Sobreescribiendo Componentes
description: Aprende como sobreescribir los componentes integrados de Starlight para agregar elementos personalizados a la interfaz de tu sitio de documentación.
sidebar:
  badge: Nuevo
---

La UI por defecto de Starlight y las opciones de configuración están diseñadas para ser flexibles y funcionar para una variedad de contenidos. Gran parte de la apariencia predeterminada de Starlight se puede personalizar con [CSS](/es/guides/css-and-tailwind/) y [opciones de configuración](/es/guides/customization/).

Cuando necesites más de lo que es posible por defecto, Starlight soporta la construcción de tus propios componentes personalizados para extender o sobreescribir (reemplazar completamente) sus componentes por defecto.

## Cuando sobreescribir

Sobreescribir los componentes por defecto de Starlight puede ser útil cuando:

- Quieres cambiar como una parte de la UI de Starlight se ve de una manera que no es posible con [CSS personalizado](/es/guides/css-and-tailwind/).
- Quieres cambiar como una parte de la UI de Starlight se comporta.
- Quieres agregar partes adicionales de la UI junto a la UI existente de Starlight.

## Cómo sobreescribir

1. Escoge el componente de Starlight que quieres sobreescribir.
   Puedes encontrar una lista completa de componentes en la [Referencia de Personalización de Componentes](/es/reference/overrides/).

   Este ejemplo sobreescribe el componente [`SocialIcons`](/es/reference/overrides/#socialicons) de Starlight en la barra de navegación de la página.

2. Crea un componente de Astro para reemplazar el componente de Starlight.
   Este ejemplo renderiza un enlace de contacto.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">Escríbeme</a>
   ```

3. Dile a Starlight que use tu componente personalizado en la opción de configuración [`components`](/es/reference/configuration/#components) en `astro.config.mjs`:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My Docs with Overrides',
         components: {
           // Sobreescribe el componente `SocialIcons` por defecto.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Reusa un componente integrado

Puedes construir con los componentes de UI por defecto de Starlight de la misma manera que lo harías con los tuyos: importándolos y renderizándolos en tus propios componentes personalizados. Esto te permite mantener toda la UI básica de Starlight dentro de tu diseño, mientras agregas UI adicional junto a ellos.

El ejemplo a continuación muestra un componente personalizado que renderiza un enlace de correo electrónico junto con el componente `SocialIcons` por defecto:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">Escríbeme</a>
<Default {...Astro.props}><slot /></Default>
```

Cuando renderizas un componente integrado dentro de un componente personalizado:

- Propaga `Astro.props` dentro de él. Esto se asegura de que reciba todos los datos que necesita para renderizar.
- Agrega un [`<slot />`](https://docs.astro.build/es/core-concepts/astro-components/#slots) dentro del componente por defecto. Esto se asegura de que si el componente recibe cualquier elemento hijo, Astro sepa donde renderizarlos.

## Usa los datos de la página

Cuando sobreescribes un componente de Starlight, tu implementación personalizada recibe un objeto `Astro.props` estándar que contiene todos los datos de la página actual.
Esto te permite usar estos valores para controlar como se renderiza tu plantilla de componente.

Por ejemplo, puedes leer los valores de frontmatter de la página como `Astro.props.entry.data`. En el siguiente ejemplo, un componente de reemplazo [`PageTitle`](/es/reference/overrides/#pagetitle) usa esto para mostrar el título de la página actual:

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

Aprende más sobre todas las props disponibles en la [Referencia de Sobreescripciones](/es/reference/overrides/#props-de-componentes).

### Solo sobreescribe en páginas específicas

Los cambios de componentes se aplican a todas las páginas. Sin embargo, puedes renderizar condicionalmente usando los valores de `Astro.props` para determinar cuando mostrar tu UI personalizada, cuando mostrar la UI por defecto de Starlight, o incluso cuando mostrar algo completamente diferente.

En el siguiente ejemplo, un componente que sobreescribe el [`Footer`](/es/reference/overrides/#footer) de Starlight muestra "Construido con Starlight 🌟" solo en la página de inicio, y de otra manera muestra el footer por defecto en todas las otras páginas:

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Construido con Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Aprende más sobre el renderizado condicional en la [Guía de Sintaxis de Astro](https://docs.astro.build/es/core-concepts/astro-syntax/#html-dinamico).
