---
title: Referência da Configuração
description: Uma visão geral de todas as opções de configuração que o Starlight suporta.
---

## Configure a integração `starlight`

Starlight é uma integração construída acima do framework web [Astro](https://astro.build). Você pode configurar o seu projeto dentro do arquivo de configuração `astro.config.mjs`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Minha documentação de iluminar os olhos',
    }),
  ],
});
```

Você pode passar as seguintes opções para a integração `starlight`.

### `title` (obrigatório)

**tipo:** `string`

Define o título do seu site. Será usado em metadados e no título da aba do navegador.

### `description`

**tipo:** `string`

Define a descrição do seu website. Usado em metadados compartilhados com motores de busca na tag `<meta name="description">` se `description` não for definido no frontmatter de uma página.

### `logo`

**tipo:** [`LogoConfig`](#logoconfig)

Define a imagem da logo a ser mostrada na barra de navegação ao lado ou no lugar do título da página. Você pode definir uma única propriedade `src` ou definir fontes de imagem separadas para os modos `light` e `dark`.

```js
starlight({
  logo: {
    src: './src/assets/minha-logo.svg',
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
**padrão:** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

Configura o índice mostrado a direita de cada página. Por padrão, cabeçalhos `<h2>` e `<h3>` serão incluídos no índice.

### `editLink`

**tipo:** `{ baseUrl: string }`

Habilita links “Editar página” definindo a URL base que deve ser utilizada. O link final será `editLink.baseUrl` + o caminho da página atual. Por exemplo, para habilitar editar páginas no repositório `withastro/starlight` no GitHub:

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

Com essa configuração, uma página `/introducao` teria um link de edição apontando para `https://github.com/withastro/starlight/edit/main/src/docs/introducao.md`.

### `sidebar`

**tipo:** [`SidebarItem[]`](#sidebaritem)

Configura os itens de navegação da barra lateral do seu site.

Uma barra lateral é um array de links e grupos de links.
Cada item deve ter um `label` e uma das seguintes propriedades:

- `link` — um único link para uma URL específica, e.x. `'/inicio'` ou `'https://exemplo.com'`.

- `items` — um array contendo mais links da barra lateral e subgrupos.

- `autogenerate` — um objeto especificando um diretório da sua documentação para gerar automaticamente um grupo de links.

```js
starlight({
  sidebar: [
    // Um único link rotulado como "Início”.
    { label: 'Início', link: '/' },
    // Um grupo rotulado "Comece Aqui" contendo dois links.
    {
      label: 'Comece Aqui',
      items: [
        { label: 'Introdução', link: '/intro' },
        { label: 'Próximos Passos', link: '/proximos-passos' },
      ],
    },
    // Um grupo com links para todas as páginas no diretório referencia.
    {
      label: 'Referência',
      autogenerate: { directory: 'referencia' },
    },
  ],
});
```

#### Ordenação

Grupos da barra lateral gerados automaticamente são ordenados pelo nome de arquivo alfabeticamente.
Por exemplo, uma página gerada de `astro.md` apareceria acima da página de `starlight.md`.

#### Escondendo grupos

Grupos de links são expandidos por padrão. Você pode modificar esse comportamento definindo a propriedade `collapsed` de um grupo para `true`.

Subgrupos gerados automaticamente respeitam a propriedade `collapsed` de seu grupo pai por padrão. Defina a propriedade `autogenerate.collapsed` para sobrescrever isso.

```js
sidebar: [
  // Um grupo escondido de links.
  {
    label: 'Links Escondidos',
    collapsed: true,
    items: [
      { label: 'Introdução', link: '/intro' },
      { label: 'Próximos Passos', link: '/proximos-passos' },
    ],
  },
  // Um grupo expandido contendo subgrupos gerados automaticamente escondidos.
  {
    label: 'Referência',
    autogenerate: {
      directory: 'referencia',
      collapsed: true,
    },
  },
],
```

#### Traduzindo rótulos

Se o seu site é multilíngue, a `label` de cada item é considerada como estando no seu local padrão. Você pode definir uma propriedade `translations` para providenciar rótulos para suas outras línguas suportadas:

```js
sidebar: [
  // um exemplo de barra lateral com rótulos traduzidos para o Francês.
  {
    label: 'Comece Aqui',
    translations: { fr: 'Commencez ici' },
    items: [
      {
        label: 'Introdução',
        translations: { fr: 'Bien démarrer' },
        link: '/introducao',
      },
      {
        label: 'Estrutura de Projetos',
        translations: { fr: 'Structure du projet' },
        link: '/estrutura',
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

[Configure internacionalização (i18n)](/pt-br/guides/i18n/) para o seu site definindo quais `locales` são suportados.

Cada entrada deve usar o diretório onde os arquivos daquela língua estão salvos como a chave.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Meu Site',
      // Define Inglês como a língua padrão para esse site.
      defaultLocale: 'en',
      locales: {
        // Documentação em Inglês em `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // Documentação em Chinês Simplificado em `src/content/docs/zh/`
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // Documentação em Árabe em `src/content/docs/ar/`
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

Você pode definir as seguintes opções para cada local:

##### `label` (obrigatório)

**tipo:** `string`

O rótulo para essa língua para mostrar aos usuários, por exemplo no seletor de língua. Geralmente você vai querer que isso seja o nome da língua da forma com que um usuário da língua esperaria lê-lo, e.x. `"English"`, `"العربية"` ou `"简体中文"`.

##### `lang`

**tipo:** `string`

A tag BCP-47 para essa língua, e.x. `"en"`, `"ar"` ou `"zh-CN"`. Se não definido, o diretório da língua será usado por padrão. Tags de línguas com subtags regionais (e.x. `"pt-BR"` ou `"en-US"`) irão utilizar as traduções de UI integradas de sua língua base se nenhuma tradução específica da região for encontrada.

##### `dir`

**tipo:** `'ltr' | 'rtl'`

A direção de escrita dessa língua; `"ltr"` para esquerda-para-direita (o padrão) ou `"rtl"` para direita-para-esquerda.

#### Local raiz

Você pode definir a língua padrão sem um diretório `/lingua/` definindo um local `root`:

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

Por exemplo, isso te permite servir `/getting-started/` como uma rota em Inglês e utiliazr `/fr/getting-started/` como a página equivalente em Francês.

### `defaultLocale`

**tipo:** `string`

Define a língua que é padrão para esse site.
O valor deve corresponder uma das chaves do seu objeto [`locales`](#locales).
(Se sua língua padrão é seu [local raiz](#local-raiz), você pode pular isso.)

O local padrãoserá utilizado para providenciar conteúdo de fallback onde está se faltando traduções.

### `social`

**tipo:** `Partial<Record<'bitbucket' | 'codeberg' | 'codePen' | 'discord' | 'github' | 'gitlab' | 'gitter' | 'instagram' | 'linkedin' | 'mastodon' | 'microsoftTeams' | 'stackOverflow' | 'threads' | 'twitch' | 'twitter' | 'youtube', string>>`

Detalhes opcionais sobre as contas de redes sociais para esse site. Adicionar qualquer um desses irá os mostrar como links de ícone no cabeçalho do site.

```js
starlight({
  social: {
    codeberg: 'https://codeberg.org/knut/examples',
    discord: 'https://astro.build/chat',
    github: 'https://github.com/withastro/starlight',
    gitlab: 'https://gitlab.com/delucis',
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

Fornece arquivos CSS para customizar a aparência e sensação do seu site Starlight.

Suporta arquivos CSS locais relativos a raiz do seu projeto, e.x. `'./src/customizado.css'` e CSS que você instalou como um módulo do npm, e.x. `'@fontsource/roboto'`.

```js
starlight({
  customCss: ['./src/estilos-customizados.css', '@fontsource/roboto'],
});
```

### `head`

**tipo:** [`HeadConfig[]`](#headconfig)

Adiciona tags customizadas ao `<head>` do seu site Starlight.
Pode ser útil para adicionar rastreamento de analytics e outros scripts e recursos de terceiros.

```js
starlight({
  head: [
    // Exemplo: adiciona a tag de script de analytics do Fathom.
    {
      tag: 'script',
      attrs: {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'MEU-ID-FATHOM',
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

**tipo:** `boolean`  
**padrão:** `false`

Controla se o rodapé mostra quando a página foi atualizada pela última vez.

Por padrão, essa funcionalidade depende no histórico do Git do seu repositório e pode não ser preciso em algumas plataformas de deployment utilizando [shallow clones](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---depthltdepthgt). Uma página pode sobrescrever essa opção ou a data baseada no Git utilizando o [campo frontmatter `lastUpdated`](/pt-br/reference/frontmatter/#lastupdated).

### `pagination`

**tipo:** `boolean`  
**padrão:** `true`

Define se o rodapé deve incluir links para a próxima página e a anterior.

Uma página pode sobrescrever essa opção ou o texto do link e/ou a URL usando os campos do frontmatter [`prev`](/pt-br/reference/frontmatter/#prev) e [`next`](/pt-br/reference/frontmatter/#next).

### `favicon`

**tipo:** `string`  
**padrão:** `'/favicon.svg'`

Define o caminho do favicon padrão para seu website que deve estar localizado no diretório `public/` e ser um arquivo de ícone válido (`.ico`, `.gif`, `.jpg`, `.png` ou `.svg`).

```js
starlight({
  favicon: '/imagens/favicon.svg',
}),
```

Se você precisa definir variantes adicionais ou favicons de fallback, você pode adicionar tags utilizando a [opção `head`](#head):

```js
starlight({
  favicon: '/imagens/favicon.svg'.
  head: [
    // Adiciona um favicon ICO de fallback para o Safari.
    {
      tag: 'link',
      attrs: {
        rel: 'icon',
        href:'/imagens/favicon.ico',
        sizes: '32x32',
      },
    },
  ],
});
```
