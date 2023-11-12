---
title: Referência do Frontmatter
description: Uma visão geral dos campos padrões do frontmatter que o Starlight suporta.
---

Você pode customizar páginas Markdown e MDX no Starlight definindo valores em seu frontmatter. Por exemplo, uma página comum pode definir os campos `title` e `description`:

```md
---
title: Sobre este projeto
description: Aprenda mais sobre o projeto no qual estou trabalhando.
---

Bem-vindo a página "sobre"!
```

## Campos do Frontmatter

### `title` (obrigatório)

**tipo:** `string`

Você deve providenciar um título para cada página. Ele será mostrado no topo da página, em abas do navegador e nos metadados da página.

### `description`

**tipo:** `string`

A descrição da página é utilizada para metadados da página e será utilizada por motores de busca e em pré-visualizações em redes sociais.

### `editUrl`

**tipo:** `string | boolean`

Sobreescreve a [configuração global `editLink`](/pt-br/reference/configuration/#editlink). Defina como `false` para desabilitar o link “Editar página" para uma página específica ou providencie uma URL alternativa onde o conteúdo dessa página é editável.

### `head`

**tipo:** [`HeadConfig[]`](/pt-br/reference/configuration/#headconfig)

Você pode adicionar tags adicionais para ao `<head>` da sua página utilizando o campo frontmatter `head`. Isso significa que você pode adicionar estilos customizados, metadados ou outras tags a uma única página. Similar a [opção global `head`](/pt-br/reference/configuration/#head).

```md
---
title: Sobre nós
head:
  # Utilize uma tag <title> customizada
  - tag: title
    content: Título sobre customizado
---
```

### `tableOfContents`

**tipo:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Sobrescreve a [configuração global `tableOfContents`](/pt-br/reference/configuration/#tableofcontents).
Customize os níveis de cabeçalho a serem incluídos ou defina como `false` para esconder o índice nessa página.

```md
---
title: Página com apenas H2s no índice
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
title: Página sem índice
tableOfContents: false
---
```

### `template`

**tipo:** `'doc' | 'splash'`  
**padrão:** `'doc'`

Define o layout de template para essa página.
Páginas usam o layout `'doc'` por padrão.
Defina para `'splash'` para usar o layout mais largo sem nenhuma barra lateral, projetado para páginas iniciais.

### `hero`

**tipo:** [`HeroConfig`](#heroconfig)

Adiciona um componente hero ao topo dessa página. Funciona bem com `template: splash`.

Por exemplo, essa configuração mostra algumas opções comuns, incluindo carregamento de uma imagem do seu repositório.

```md
---
title: Minha Página Inicial
template: splash
hero:
  title: 'Meu Projeto: Coisas Estelares Cedo'
  tagline: Leve suas coisas ao espaço e de volta em um piscar de olhos.
  image:
    alt: Uma logo reluzente e brilhantemente colorida
    file: ../../assets/logo.png
  actions:
    - text: Me diga mais
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: Veja no GitHub
      link: https://github.com/astronaut/meu-projeto
      icon: external
---
```

Você pode exibir diferentes versões da imagem hero no modo claro e escuro.

```md
---
hero:
  image:
    alt: Um logo brilhante e colorido
    dark: ../../assets/logo-escuro.png
    light: ../../assets/logo-claro.png
---
```

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?:
    | {
        // Caminho relativo de uma imagem no seu repositório.
        file: string;
        // Texto alternativo para tornar a imagem acessível à tecnologia assistiva
        alt?: string;
      }
    | {
        // Caminho relativo de uma imagem em seu repositório para ser usada no modo escuro.
        dark: string;
        // Caminho relativo de uma imagem em seu repositório para ser usada no modo claro.
        light: string;
        // Texto alternativo para tornar a imagem acessível à tecnologia assistiva
        alt?: string;
      }
    | {
        // HTML bruto para utilizar no slot de imagem.
        // Pode ser uma tag `<img>` personalizada ou um `<svg>` inline.
        html: string;
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

**tipo:** `{ content: string }`

Exibe um banner de anúncio no topo desta página.

O valor de `conteúdo` pode incluir HTML para links ou outro conteúdo.
Por exemplo, esta página exibe um banner que inclui um link para `example.com`.

```md
---
title: Página com um banner
banner:
  content: |
    Acabamos de lançar algo legal!
    <a href="https://example.com">Confira</a>
---
```

### `lastUpdated`

**tipo:** `Date | boolean`

Sobrescreve a [opção global `lastUpdated`](/pt-br/reference/configuration/#lastupdated). Se uma data é especificada, ela deve ser um [timestamp YAML](https://yaml.org/type/timestamp.html) válido e irá sobrescrever a data armazenada no histórico do Git para essa página.

```md
---
title: Página com uma data de última atualização customizada
lastUpdated: 2022-08-09
---
```

### `prev`

**tipo:** `boolean | string | { link?: string; label?: string }`

Sobrescreve a [opção global `pagination`](/pt-br/reference/configuration/#pagination). Se uma string é especificada, o texto do link gerado será substituído e se um objeto for especificado, ambos o link e o texto serão sobrescritos.

```md
---
# Esconda o link da página anterior
prev: false
---
```

```md
---
# Sobrescreva o texto do link da página anterior
prev: Continue o tutorial
---
```

```md
---
# Sobrescreva ambos o link e o texto da página anterior
prev:
  link: /pagina-diferente/
  label: Veja essa outra página
---
```

### `next`

**tipo:** `boolean | string | { link?: string; label?: string }`

Mesmo que [`prev`](#prev) mas para o link da próxima página.

```md
---
# Esconda o link da próxima página
next: false
---
```

### `pagefind`

**tipo:** `boolean`  
**padrão:** `true`

Configura se essa página deve ou não ser inclusa no índice de busca do [Pagefind](https://pagefind.app/).
Defina como `false` para excluir a página do resultado de buscas.

```md
---
# Não exibir essa página nas buscas
pagefind: false
---
```

### `sidebar`

**tipo:** [`SidebarConfig`](#sidebarconfig)

Controla como essa página é mostrada na [barra lateral](/pt-br/reference/configuration/#sidebar), quando se utiliza um grupo de links gerados automaticamente.

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

**tipo:** `string`  
**padrão:** [`title`](#title-obrigatório) da página

Define o rótulo para essa página na barra lateral quando mostrado em um grupo de links gerados automaticamente.

```md
---
title: Sobre este projeto
sidebar:
  label: Sobre
---
```

#### `order`

**tipo:** `number`

Controla a ordem dessa página ao ordenar um grupo de links gerados automaticamente.
Números menores são mostrados acima no grupo de links.

```md
---
title: Página para mostrar primeiro
sidebar:
  order: 1
---
```

#### `hidden`

**tipo:** `boolean`
**padrão:** `false`

Previne essa página de ser incluída no no grupo gerado automaticamente da barra lateral.

```md
---
title: Página para esconder da barra lateral gerada automaticamente
sidebar:
  hidden: true
---
```

#### `badge`

**type:** <code>string | <a href="/pt-br/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Adicione um emblema a página na barra lateral ao ser mostrada em um grupo gerado automaticamente de links.
Ao utilizar uma string, o emblema será mostrado com uma cor de destaque padrão.
Opcionalmente, passe um [objeto `BadgeConfig`](/pt-br/reference/configuration/#badgeconfig) com os campos `text` e `variant` para customizar o emblema.

```md
---
title: Página com um emblema
sidebar:
  # Utiliza a variante padrão correspondente a cor de destaque do seu site
  badge: New
---
```

```md
---
title: Página com um emblema
sidebar:
  badge:
    text: Experimental
    variant: caution
---
```

#### `attrs`

**tipo:** `Record<string, string | number | boolean | undefined>`

Atributos HTML que será adicionado ao link da barra lateral da página quando exibido em um grupo de link gerados automaticamente.

```md
---
title: Abrir em nova aba
sidebar:
  # Abre a página em uma nova aba
  attrs:
    target: _blank
---
```
