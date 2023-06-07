---
title: Referencia de Configuración
description: Una descripción general de todas las opciones de configuración que admite Starlight.
---

## Configurar la integración `starlight`

Starlight es una integración construida sobre el framework [Astro](https://astro.build). Puedes configurar tu proyecto dentro del archivo de configuración `astro.config.mjs`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  integrations: [
    starlight({
      title: 'My delightful docs site',
    }),
  ],
});
```

Puedes pasar las siguientes opciones a la integración `starlight`.

### `title` (requerido)

**tipo:** `string`

Establece el título de tu sitio web. Se utilizará en los metadatos y en el título de la pestaña del navegador.

### `description`

**tipo:** `string`

Establece la descripción de tu sitio web. Es usada en los metadatos compartidos con los motores de búsqueda en la etiqueta `<meta name="description">` si no se establece `description` en el frontmatter de una página.

### `logo`

**tipo:** [`LogoConfig`](#logoconfig)

Establece un logotipo para mostrarlo en la barra de navegación junto al título del sitio o en su lugar. Puedes establecer una única propiedad `src` o establecer fuentes de imagen separadas para `light` y `dark`.

```js
starlight({
  logo: {
    src: '/src/assets/my-logo.svg',
  },
});
```

#### `LogoConfig`

```ts
type LogoConfig = { alt?: string; replacesTitle?: boolean } & (
  | { src: string }
  | { light: string; dark: string }
);
```

### `tableOfContents`

**tipo:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`  
**por defecto:** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

Configura la tabla de contenidos que se muestra a la derecha de cada página. De forma predeterminada, los encabezados `<h2>` y `<h3>` se incluirán en esta tabla de contenidos.

### `editLink`

**tipo:** `{ baseUrl: string }`

Hablita "Editar los enlaces" de está página estableciendo la URL base que se debe usar. El enlace final será `editLink.baseUrl` + la ruta de la página actual. Por ejemplo, para habilitar la edición de páginas en el repositorio `withastro/starlight` en GitHub:

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

Con esta configuración, una página `/introduction` tendría un enlace de edición que apunta a `https://github.com/withastro/starlight/edit/main/src/docs/introduction.md`.

### `sidebar`

**tipo:** [`SidebarGroup[]`](#sidebargroup)

Configura los elementos de navegación de la barra lateral de tu sitio.

Una barra lateral es una matriz de grupos, cada uno con una `label` para el grupo y una matriz de `items` o un objeto de configuración `autogenerate`.

Puedes establecer manualmente los contenidos de un grupo usando `items`, que es una matriz que puede incluir enlaces y subgrupos. También puedes generar automáticamente el contenido de un grupo a partir de un directorio específico de tu documentación, usando `autogenerate`.

```js
starlight({
  sidebar: [
    // Un grupo etiquetado como "Start Here" que contiene dos enlaces.
    {
      label: 'Start Here',
      items: [
        { label: 'Introduction', link: '/intro' },
        { label: 'Next Steps', link: '/next-steps' },
      ],
    },
    // Un grupo que enlaza a todas las páginas del directorio de referencia.
    {
      label: 'Reference',
      autogenerate: {
        directory: 'reference',
      },
    },
  ],
});
```

#### `SidebarGroup`

```ts
type SidebarGroup =
  | {
      label: string;
      items: Array<LinkItem | SidebarGroup>;
    }
  | {
      label: string;
      autogenerate: {
        directory: string;
      };
    };
```

#### `LinkItem`

```ts
interface LinkItem {
  label: string;
  link: string;
}
```

### `locales`

**tipo:** `{ [dir: string]: LocaleConfig }`

Configura la internacionalización (i18n) para tu sitio estableciendo qué `locales` se admiten.

Cada entrada debe usar el directorio donde se guardan los archivos de ese idioma como clave.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      // Establece el inglés como el idioma predeterminado para este sitio.
      defaultLocale: 'en',
      locales: {
        // Los documentos en inglés en `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // Los documentos en chino simplificado en `src/content/docs/zh/`
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // Los documentos en árabe en `src/content/docs/ar/`
        ar: {
          label: 'العربية',
          dir: 'rtl',
        },
      },
    }),
  ],
});
```

#### Opciones de configuración de idioma

Puedes establecer las siguientes opciones para cada idioma:

##### `label` (requerido)

**tipo:** `string`

La etiqueta para este idioma que se muestra a los usuarios, por ejemplo, en el selector de idioma. Lo más probable es que quieras que este sea el nombre del idioma como un usuario de ese idioma esperaría leerlo, por ejemplo, `"English"`, `"العربية"` o `"简体中文"`.

##### `lang`

**tipo:** `string`

La etiqueta BCP-47 para este lenguaje, por ejemplo, `"en"`, `"ar"` o `"zh-CN"`. Si no se establece, se utilizará el nombre del directorio del idioma de forma predeterminada.

##### `dir`

**tipo:** `'ltr' | 'rtl'`

La dirección de escritura de este idioma; `"ltr"` para de izquierda a derecha (el valor predeterminado) o `"rtl"` para de derecha a izquierda.

#### Idioma raíz

Puedes servir el idioma predeterminado sin un directorio `/lang/` estableciendo un idioma `root`:

```js
starlight({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    fr: {
      label: 'Français',
    },
  },
});
```

Por ejemplo, esto te permite servir `/getting-started/` como una ruta en inglés y usar `/fr/getting-started/` como la página francesa equivalente.

### `defaultLocale`

**tipo:** `string`

Establece el idioma que es el predeterminado para este sitio.
Este valor debe coincidir con una de las claves de tu objeto [`locales`](#locales).
(Si tu idioma predeterminado es tu [idioma raíz](#idioma-raíz), puedes omitir esto.)

El idioma predeterminado se utilizará para proporcionar contenido de respaldo donde faltan las traducciones.

### `social`

**tipo:** `{ discord?: string; github?: string; mastodon?: string; twitter?: string }`

Detalles opcionales sobre las cuentas de redes sociales para este sitio. Agregar cualquiera de estos los mostrará como enlaces de iconos en el encabezado del sitio.

```js
starlight({
  social: {
    discord: 'https://astro.build/chat',
    github: 'https://github.com/withastro/starlight',
    mastodon: 'https://m.webtoo.ls/@astro',
    twitter: 'https://twitter.com/astrodotbuild',
  },
});
```

### `customCss`

**tipo:** `string[]`

Proporciona archivos CSS para personalizar el aspecto y la sensación de tu sitio Starlight.

Admite archivos CSS locales relativos a la raíz de tu proyecto, por ejemplo, `'/src/custom.css'`, y CSS que instalaste como un módulo npm, por ejemplo, `'@fontsource/roboto'`.

```js
starlight({
  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**tipo:** [`HeadConfig[]`](#headconfig)

Agrega etiquetas personalizadas a la etiqueta `<head>` de tu sitio Starlight.
Puede ser útil para agregar análisis y otros scripts y recursos de terceros.

```js
starlight({
  head: [
    // Ejemplo: agregar etiqueta de script de análisis de Fathom.
    {
      tag: 'script',
      attrs: {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'MY-FATHOM-ID',
        defer: true,
      },
    },
  ],
});
```

#### `HeadConfig`

```ts
interface HeadConfig {
  tag: string;
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}
```
