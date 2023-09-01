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
      title: 'Mi encantador sitio de documentación',
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
    src: './src/assets/mi-logo.svg',
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

**tipo:** [`SidebarItem[]`](#sidebaritem)

Configura los elementos de navegación de la barra lateral de tu sitio.

Una barra lateral es un conjunto de enlaces y grupos de enlaces.
Cada elemento debe tener una propiedad `label` y una de las siguientes propiedades:

- `link` — Un solo enlace a una URL específica, p. ej. `'/home'` o `'https://example.com'`.

- `items` — Un array que contiene más enlaces de la barra lateral y subgrupos.

- `autogenerate` — Un objeto que especifica un directorio de tus documentos para generar automáticamente un grupo de enlaces.

```js
starlight({
  sidebar: [
    // Un solo elemento de enlace etiquetado como “Home”.
    { label: 'Home', link: '/' },
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

#### Ordenación

Los grupos de la barra lateral generados automáticamente se ordenan alfabéticamente por el nombre del archivo.
Por ejemplo, una página generada a partir de `astro.md` aparecería por encima de la página `starlight.md`.

#### Colapsando grupos

Los grupos de enlaces se expanden de forma predeterminada. Puedes cambiar este comportamiento estableciendo la propiedad `collapsed` de un grupo como `true`.

Los subgrupos generados automáticamente respetan por defecto la propiedad `collapsed` de su grupo padre. Puedes establecer la propiedad `autogenerate.collapsed` para anular esto.

```js
sidebar: [
  // Un grupo colapsado de enlaces.
  {
    label: 'Collapsed Links',
    collapsed: true,
    items: [
      { label: 'Introduction', link: '/intro' },
      { label: 'Next Steps', link: '/next-steps' },
    ],
  },
  // Un grupo expandido que contiene subgrupos generados automáticamente colapsados.
  {
    label: 'Reference',
    autogenerate: {
      directory: 'reference',
      collapsed: true,
    },
  },
],
```

#### Traduciendo etiquetas

Si tu sitio es multilingüe, se considera que la etiqueta de cada elemento está en el idioma predeterminado. Puedes establecer una propiedad de `translations` para proporcionar etiquetas en los otros idiomas que tu sitio admita:

```js
sidebar: [
  // Un ejemplo de barra lateral con etiquetas traducidas al francés.
  {
    label: 'Start Here',
    translations: { fr: 'Commencez ici' },
    items: [
      {
        label: 'Getting Started',
        translations: { fr: 'Bien démarrer' },
        link: '/getting-started',
      },
      {
        label: 'Project Structure',
        translations: { fr: 'Structure du projet' },
        link: '/structure',
      },
    ],
  },
],
```

#### `SidebarItem`

```ts
type SidebarItem = {
  label: string;
  translations?: Record<string, string>;
} & (
  | {
      link: string;
      badge?: string | BadgeConfig;
    }
  | { items: SidebarItem[]; collapsed?: boolean }
  | {
      autogenerate: { directory: string; collapsed?: boolean };
      collapsed?: boolean;
    }
);
```

#### `BadgeConfig`

```ts
interface BadgeConfig {
  text: string;
  variant: 'note' | 'tip' | 'caution' | 'danger' | 'success' | 'default';
}
```

### `locales`

**tipo:** <code>{ \[dir: string\]: [LocaleConfig](#localeconfig) }</code>

[Configura la internacionalización (i18n)](/es/guides/i18n/) para tu sitio estableciendo qué `locales` se admiten.

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

#### `LocaleConfig`

```ts
interface LocaleConfig {
  label: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}
```

Puedes establecer las siguientes opciones para cada idioma:

##### `label` (requerido)

**tipo:** `string`

La etiqueta para este idioma que se muestra a los usuarios, por ejemplo, en el selector de idioma. Lo más probable es que quieras que este sea el nombre del idioma como un usuario de ese idioma esperaría leerlo, por ejemplo, `"English"`, `"العربية"` o `"简体中文"`.

##### `lang`

**tipo:** `string`

La etiqueta BCP-47 para este lenguaje, por ejemplo, `"en"`, `"ar"` o `"zh-CN"`. Si no se establece, se utilizará el nombre del directorio del idioma de forma predeterminada. Las etiquetas de idioma con subetiquetas regionales (por ejemplo, `"pt-BR"` o `"en-US"`) utilizarán las traducciones de la interfaz de usuario integradas para su idioma base si no se encuentran traducciones específicas de la región.

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

**tipo:** `Partial<Record<'bitbucket' | 'codeberg' | 'codePen' | 'discord' | 'github' | 'gitlab' | 'gitter' | 'instagram' | 'linkedin' | 'mastodon' | 'microsoftTeams' | 'stackOverflow' | 'threads' | 'twitch' | 'twitter' | 'youtube', string>>`

Detalles opcionales sobre las cuentas de redes sociales para este sitio. Agregar cualquiera de estos los mostrará como enlaces de iconos en el encabezado del sitio.

```js
starlight({
  social: {
    codeberg: 'https://codeberg.org/knut/examples',
    discord: 'https://astro.build/chat',
    github: 'https://github.com/withastro/starlight',
    linkedin: 'https://www.linkedin.com/company/astroinc',
    mastodon: 'https://m.webtoo.ls/@astro',
    threads: 'https://www.threads.net/@nmoodev',
    twitch: 'https://www.twitch.tv/bholmesdev',
    twitter: 'https://twitter.com/astrodotbuild',
    youtube: 'https://youtube.com/@astrodotbuild',
  },
});
```

### `customCss`

**tipo:** `string[]`

Proporciona archivos CSS para personalizar el aspecto y la sensación de tu sitio Starlight.

Admite archivos CSS locales relativos a la raíz de tu proyecto, por ejemplo, `'./src/custom.css'`, y CSS que instalaste como un módulo npm, por ejemplo, `'@fontsource/roboto'`.

```js
starlight({
  customCss: ['./src/custom-styles.css', '@fontsource/roboto'],
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

### `lastUpdated`

**type:** `boolean`  
**default:** `false`

Controla si se muestra el pie de página que indica cuándo se actualizó por última vez la página.

De forma predeterminada, esta función se basa en el historial Git de tu repositorio y puede no ser precisa en algunas plataformas de implementación que realizan [copias superficiales](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---depthltdepthgt). Una página puede anular esta configuración o la fecha basada en Git utilizando el campo [`lastUpdated`](/reference/frontmatter/#lastupdated) en el frontmatter.

### `pagination`

**tipo:** `boolean`  
**por defecto:** `true`

Define si el pie de página debe incluir enlaces a la página anterior y siguiente.

Una página puede anular esta configuración o el texto del enlace y/o la URL utilizando los campos de metadatos [`prev`](/reference/frontmatter/#prev) y [`next`](/reference/frontmatter/#next).

### `favicon`

**tipo:** `string`  
**por defecto:** `'/favicon.svg'`

Establece la ruta del favicon predeterminado para tu sitio web, el cual debería ubicarse en el directorio `public/` y ser un archivo de icono válido (`.ico`, `.gif`, `.jpg`, `.png` o `.svg`).

```js
starlight({
  favicon: '/images/favicon.svg',
}),
```

Si necesitas establecer variantes adicionales o favicons de respaldo, puedes agregar etiquetas utilizando la opción [`head`](#head):

```js
starlight({
  favicon: '/images/favicon.svg'.
  head: [
    // Agregar un favicon ICO de respaldo para Safari.
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        href:'/images/favicon.ico',
        sizes: '32x32',
      },
    },
  ],
});
```
