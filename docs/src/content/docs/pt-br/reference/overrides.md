---
title: Referência de Substituição
description: Visão geral dos componentes e props de componentes que o Starlight dá suporte à substituição
tableOfContents:
  maxHeadingLevel: 4
---

Você pode substituir os componentes padrão do Starlight fornecendo o caminho do componente a ser substituido no campo [`componentes`](/pt-br/reference/configuration#components) as configurações do Starlight.
Essa página lista todos os componentes disponíveis para substituição e links do GitHub para a implementação padrão.

Leia mais em [Guia de Substituição](/pt-br/guides/overriding-components/).

## Props de componentes

Todos os componentes podem acessar o objeto padrão `Astro.props` que contém informações sobre a página em que se encontra.

Para tipar seus componentes personalizados, importe o tipo `Props` do Starlight:

```astro
---
import Tipos { Props } from '@astrojs/starlight/props';

const { hasSidebar } = Astro.props;
//      ^ tipo: boolean
---
```
Assim você terá autocompletar e tipos quando acessar `Astro.props`.


### Props

O Starlight passará os seguintes props aos seus componentes personalizados.

#### `dir`

**Tipos:** `'ltr' | 'rtl'`

Direção de escrita da página.

#### `lang`

**Tipos:** `string`

Etiqueta BCP-47 para o local da página atual, ex: `en`, `zh-CN`, ou `pt-BR`.

#### `local`

**Tipos:** `string | undefined`

O caminho base de onde o idioma é servido. `undefined` para slugs do local raíz.

#### `slug`

**Tipos:** `string`

O slug da página atual, gerado a partir do nome do arquivo.

#### `id`

**Tipos:** `string`

ID único para a página, baseado no nome do arquivo.

#### `isFallback`

**Tipos:** `true | undefined`

Será `true` se a página não tiver tradução no idioma atual e estiver utilizando conteúdo de contigência do idioma padrão.
Usado apenas em site multilíngues.

#### `entryMeta`

**Tipos:** `{ dir: 'ltr' | 'rtl'; lang: string }`

Metadata do local do conteúdo da página. Pode ser diferente do local previsto quando a página estiver utilizando conteúdo de contigência.
local metadata for the page content. Can be different from top-level local values when a page is using fallback content.

#### `entry`

A entrada do content collection do Astro para a página atual
Isso inclui valores do frontmatter para a página atual em `entry.data`.
The Astro content collection entry for the current page.
Includes frontmatter values for the current page at `entry.data`.

```ts
entry: {
  data: {
    title: string;
    description: string | undefined;
    // etc.
  }
}
```
Veja mais sobre o objeto na referencia de [Coleção de Conteúdo Astro](https://docs.astro.build/pt-br/reference/api-reference/#collection-entry-types)

#### `sidebar`

**Tipos:** `SidebarEntry[]`

Entradas de navegação da barra lateral desta página.

#### `hasSidebar`

**Tipos:** `boolean`

Se a barra lateral será ou não exibida nesta página.

#### `pagination`

**Tipos:** `{ prev?: Link; next?: Link }`

Links para para a próxima página e a anterior na barra lateral, se ativado.

#### `toc`

**Tipos:** `{ minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] } | undefined`

Sumário dessa página, se ativado.

#### `headings`

**Tipos:** `{ depth: number; slug: string; text: string }[]`

Arranjo de todos os títulos Markdown extraídos da página atual.
Utilize [`toc`](#toc) ao invés se você deseja construir um sumário que respeita as configurações do Starlight.


#### `lastUpdated`

**Tipos:** `Date | undefined`

Objeto `Date` JavaScript que representa quando a página foi atualizada pela última vez, se ativado.

#### `editUrl`

**Tipos:** `URL | undefined`

Objeto `URL` para o endereço onde a página poderá ser editada, se ativado.

---

## Componentes

### Head

Esses componentes são renderizados dentro do `<head>` de cada página.
Deve-se apenas incluir [elementos permitidos dentro do `<head>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/head#see_also)

#### `Head`

**Componente padrão:** [`Head.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Head.astro)

Componente renderizado dentro do `<head>` de cada página.
Contém tags importantes como `<title>`, e `<meta charset="utf-8">`.

Substitua esse componente em último caso.
Se possível, dê preferência às opções [`head`](/pt-br/reference/configuration#head) de configuração do Starlight.

#### `ThemeProvider`

**Componente padrão:** [`ThemeProvider.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeProvider.astro)


Componente renderizado dentro do `<head>` que configura o suporte para o tema claro/escuro.
A implementação padrão embute um script e um `<template>` utilizado pelo script em [`<ThemeSelect />`](#themeselect).

---

### Acessibilidade

#### `SkipLink`

**Componente padrão:** [`SkipLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SkipLink.astro)

Para acessibilidade, esse componente é renderizado como primeiro elemento do `<body>`, é um link para o conteúdo principal da página atual.
A implementação padrão fica invisível até o usuário focar nela utilizando a tecla Tab no teclado.

---

### Layout

Esses componentes são responsáveis por dispor os componentes do Starlight e gerenciar a visualização através dos breakpoints.
Substitui-los gera uma complexidade significativa.
Se possível, prefira substituir componentes mais específicos.


#### `PageFrame`

**Componente padrão:** [`PageFrame.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageFrame.astro)

Componente de layout que amarra a maioria do conteúda da página.
A implementação padrão monta o layout header–sidebar–main. Nele há slots chamados `header` e `sidebar`, além do slot padrão para o conteúdo principal.
Também renderiza o [`<MobileMenuToggle />`](#mobilemenutoggle) que suporta o botão de abrir ou fechar a barra lateral em viewports menores (mobile).

#### `MobileMenuToggle`

**Componente padrão:** [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro)

Componente renderizado dentro do [`<PageFrame>`](#pageframe) que é responsável por abrir ou fechar a barra lateral em viewports menores (mobile).

#### `TwoColumnContent`

**Componente padrão:** [`TwoColumnContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TwoColumnContent.astro)


Componente de layout que amarra a coluna central e a barra da direita (sumário). 
A implementação padrão alterna o layout entre uma coluna, em viewport estreitas; e duas colunas, em viewports maiores.

---

### Header

Esses componentes renderizam a barra superior do Starlight

#### `Header`

**Componente padrão:** [`Header.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Header.astro)

O componente Header é exibito no início de cada página.
A implementação padrão exibe [`<SiteTitle />`](#sitetitle), [`<Search />`](#search), [`<SocialIcons />`](#socialicons), [`<ThemeSelect />`](#themeselect), e [`<LanguageSelect />`](#languageselect).

#### `SiteTitle`

**Componente padrão:** [`SiteTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SiteTitle.astro)

Componente renderizado no início do Header para renderizar o título do site.
A implementação padrão inclui a lógica para rendezir os logos definidos nas configurações do Starlight.

#### `Search`

**Componente padrão:** [`Search.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Search.astro)

Componente utilizado para renderizar a interface de busca.
A implementação padrão inclui um botão no cabeçalho e o código para exibir um modal de busca quando for clicado e carregar a [interface do Pagefind](https://pagefind.app/).

Component used to render Starlight’s search UI.
The default implementation includes the button in the header and the code for displaying a search modal when it is clicked and loading [Pagefind’s UI](https://pagefind.app/).

#### `SocialIcons`

**Componente padrão:** [`SocialIcons.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SocialIcons.astro)

Componente renderizado no cabeçalho da página, incluindo links das mídias sociais.
A implementação padrão utiliza a opção [`social`](/pt-br/reference/configuration#social) nas configurações do Starlight para renderizar os links e ícones.

#### `ThemeSelect`

**Componente padrão:** [`ThemeSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeSelect.astro)

Componente renderizado no cabeçalho da página que permite aos usuários selecior o tema preferido.

#### `LanguageSelect`

**Componente padrão:** [`LanguageSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LanguageSelect.astro)

Componente renderizado no cabeçalho da página que permite escolher o idioma.

---

### Global Sidebar

A barra lateral do Starlight inclue a navegação principal do site.
Em telas menores fica invisível, podendo ser exibido via botão de dropdown.

#### `Sidebar`

**Componente padrão:** [`Sidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Sidebar.astro)

Componente que contém a navegação global, renderizado ao lado do conteúdo da página.
A implementação padrão exibe a barra lateral em viewports largas o suficiente e escondido sob um menu dropdown em viewports estreitas (mobile).
Também renderiza o [`<MobileMenuFooter />`](#mobilemenufooter) que exibe itens adicionais dentro do menu mobile.

#### `MobileMenuFooter`

**Componente padrão:** [`MobileMenuFooter.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuFooter.astro)

Componente renderizado no final do menu dropdown mobile.
A implementação padrão renderiza [`<ThemeSelect />`](#themeselect) e [`<LanguageSelect />`](#languageselect).

---

### Page Sidebar

A barra lateral do Starlight é responsável por exibir o sumário delineando os subtítulos da página atual.
Em viewports estreitas, fica sob um menu dropdown fixado.


#### `PageSidebar`

**Componente padrão:** [`PageSidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageSidebar.astro)

Componente para exibir o sumário, renderizado ao lado do conteúdo da página principal, para
A implementação padrão renderiza [`<TableOfContents />`](#tableofcontents) e [`<MobileTableOfContents />`](#mobiletableofcontents).

#### `TableOfContents`

**Componente padrão:** [`TableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TableOfContents.astro)

Componente que renderiza o sumário da pagina atual em viewports largas.

#### `MobileTableOfContents`

**Componente padrão:** [`MobileTableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileTableOfContents.astro)

Componente que renderiza o sumário da página atual em viewports estreitas (mobile).

---

### Conteúdo

Componentes renderizados na coluna central da página.

#### `Banner`

**Componente padrão:** [`Banner.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Banner.astro)

Componente de Banner renderizado no início de cada página.
A implmentação padrão utiliza o valor do frontmatter [`banner`](/pt-br/reference/frontmatter#banner) para decidir se renderiza ou não 


#### `ContentPanel`

**Componente padrão:** [`ContentPanel.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ContentPanel.astro)

Componente de layout que amarra as seções da coluna central.

#### `PageTitle`

**Componente padrão:** [`PageTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageTitle.astro)

Componente contendo o elemento `<h1>` da página atual.

As implmentações devem adicionar `id="_top"` no elemento `<h1>` assim como é na implementação padrão.

#### `FallbackContentNotice`

**Componente padrão:** [`FallbackContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/FallbackContentNotice.astro)

Aviso exibido aos visitantes da página quando a tradução para o idioma atual não estiver disponível.
Apenas utilizado em sites multilíngue.


#### `Hero`

**Componente padrão:** [`Hero.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Hero.astro)

Componente rendezirado no início da página quando [`hero`](/pt-br/reference/frontmatter#hero) tiver configurado no frontmatter.
A implementação padrão exibite um título grande, tagline, links de chamada de ação, e opcionalmente, uma imagem junto.

#### `MarkdownContent`

**Componente padrão:** [`MarkdownContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MarkdownContent.astro)

Componente renderizado ao redor do conteúdo principal de cada página.
A implementação padrão adiciona estilos para o conteúdo Markdown.

---

### Footer

Estes componentes são renderizados no final da coluna de conteúdo principal da página.

#### `Footer`

**Componente padrão:** [`Footer.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Footer.astro)

Componente do rodapé exibido no final de cada página.
A implementação padrão exibe [`<LastUpdated />`](#lastupdated), [`<Pagination />`](#pagination), e [`<EditLink />`](#editlink).

#### `LastUpdated`

**Componente padrão:** [`LastUpdated.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LastUpdated.astro)

Componente renderizado no rodapé da página que a data de última atualização

#### `EditLink`

**Componente padrão:** [`EditLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/EditLink.astro)

Componente renderizado no rodapé da página que exibe o link de onde a página poderá ser editada.

#### `Pagination`

**Componente padrão:** [`Pagination.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Pagination.astro)


Componente renderizado no rodapé da página que exibe setas de navegação entre a próxima página e a anterior.
