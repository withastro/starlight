---
title: Referencia de Frontmatter
description: Una visión general de los campos de frontmatter predeterminados que admite Starlight.
---

Puedes personalizar individualmente las páginas Markdown y MDX en Starlight estableciendo valores en su frontmatter. Por ejemplo, una página regular podría establecer los campos `title` y `description`:

```md
---
title: Acerca de este proyecto
description: Aprende más sobre el proyecto en el que estoy trabajando.
---

¡Bienvenido a la página Acerca de!
```

## Campos de frontmatter

### `title` (requerido)

**tipo:** `string`

Debes proporcionar un título para cada página. Este se mostrará en la parte superior de la página, en las pestañas del navegador y en los metadatos de la página.

### `description`

**tipo:** `string`

La descripción de la página es usada para los metadatos de la página y será recogida por los motores de búsqueda y en las vistas previas de las redes sociales.

### `editUrl`

**tipo:** `string | boolean`

Reemplaza la [configuración global `editLink`](/reference/configuration/#editlink). Establece a `false` para deshabilitar el enlace "Editar página" para una página específica o proporciona una URL alternativa donde el contenido de esta página es editable.

### `head`

**tipo:** [`HeadConfig[]`](/reference/configuration/#headconfig)

Puedes agregar etiquetas adicionales a la etiqueta `<head>` de tu página usando el campo `head` del frontmatter. Esto significa que puedes agregar estilos personalizados, metadatos u otras etiquetas a una sola página. Similar a la [opción global `head`](/reference/configuration/#head).

```md
---
title: Acerca de nosotros
head:
  # Usa una etiqueta <title> personalizada
  - tag: title
    content: Título personalizado sobre nosotros
---
```

### `tableOfContents`

**tipo:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Reemplaza la [configuración global `tableOfContents`](/reference/configuration/#tableofcontents).
Personaliza los niveles de encabezado que se incluirán o establece en `false` para ocultar la tabla de contenidos en esta página.

### `template`

**tipo:** `'doc' | 'splash'`  
**por defecto:** `'doc'`

Establece la plantilla de diseño para esta página.
Las páginas usan el diseño `'doc'` por defecto.
Establece `'splash'` para usar un diseño más amplio sin barras laterales diseñado para las landing pages.

### `hero`

**tipo:** [`HeroConfig`](#heroconfig)

Agrega un componente hero en la parte superior de esta página. Funciona bien con `template: splash`.

Por ejemplo, esta configuración muestra algunas opciones comunes, incluyendo la carga de una imagen desde tu repositorio.

```md
---
title: Mi página de inicio
template: splash
hero:
  title: 'Mi proyecto: Cosas estelares más pronto'
  tagline: Lleva tus cosas a la luna y de vuelta en un abrir y cerrar de ojos.
  image:
    alt: Un logotipo brillante, de colores brillantes
    file: ../../assets/logo.png
  actions:
    - text: Cuéntame más
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: View on GitHub
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
    // Ruta relativa a una imagen en tu repositorio.
    file?: string;
    // HTML crudo para usar en el espacio de la imagen.
    // Podría ser una etiqueta `<img>` personalizada o un `<svg>` en línea.
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
