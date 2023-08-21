---
title: Escrevendo Conteúdo em Markdown
description: Uma visão geral da sintaxe Markdown suportada pelo Starlight.
---

Starlight suporta completamente a sintaxe [Markdown](https://daringfireball.net/projects/markdown/) em arquivos `.md` assim como frontmatter [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) para definir metadados como o título e a descrição.

Por favor verifique a [documentação do MDX](https://mdxjs.com/docs/what-is-mdx/#markdown) ou a [documentação do Markdoc](https://markdoc.dev/docs/syntax) se estiver utilizando esses formatos de arquivo, já que o suporte e uso do Markdown podem variar.

## Estilos Inline

Texto pode estar em **negrito**, _itálico_, ou ~~tachado~~.

```md
Texto pode estar em **negrito**, _itálico_, ou ~~tachado~~.
```

Você pode [fazer links para outras páginas](/pt-br/getting-started/).

```md
Você pode [fazer links para outras páginas](/pt-br/getting-started/).
```

Você pode destacar `código inline` com crases.

```md
Você pode destacar `código inline` com crases.
```

## Imagens

Imagens no Starlight usam o [suporte integrado a assets otimizados do Astro](https://docs.astro.build/pt-br/guides/assets/).

Markdown e MDX suportam a sintaxe do Markdown para mostrar imagens que incluem texto alternativo para leitores de tela e tecnologias assistivas.

![Uma ilustração de planetas e estrelas apresentando a palavra “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![Uma ilustração de planetas e estrelas apresentando a palavra “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

Caminhos de imagem relativos também são suportados para imagens armazenadas localmente no seu projeto.

```md
// src/content/docs/pagina-1.md

![Um foguete no espaço](../../assets/imagens/foguete.svg)
```

## Cabeçalhos

Você pode estruturar o conteúdo utilizando um cabeçalho. Cabeçalhos no Markdown são indicados pelo número de `#` no início de uma linha.

### Como estruturar o conteúdo da página no Starlight

Starlight é configurado para automaticamente utilizar o título da sua página como um cabeçalho superior e irá incluir um cabeçalho "Visão geral" no topo do índice de cada página. Nós recomendamos começar cada página com um parágrafo normal e utilizar cabeçalhos na página a partir de `<h2>` para baixo:

```md
---
title: Guia de Markdown
description: Como utilizar Markdown no Starlight
---

Esta página descreve como utilizar Markdown no Starlight.

## Estilos Inline

## Cabeçalhos
```

### Links de âncora automáticos de cabeçalho

Utilizar cabeçalhos no Markdown irá automaticamente dá-lo links de âncora para que você direcione diretamente a certas seções da sua página:

```md
---
title: Minha página de conteúdo
description: Como utilizar os links de âncora integrados do Starlight
---

## Introdução

Eu posso fazer um link para [minha conclusão](#conclusão) abaixo na mesma página.

## Conclusão

`https://meu-site.com/pagina1/#introdução` navega diretamente para minha Introdução.
```

Cabeçalhos de Nível 2 (`<h2>`) e Nível 3 (`<h3>`) vão aparecer automaticamente no índice da página.

## Asides

Asides (também conhecidos como “advertências” ou “frases de destaque”) são úteis para mostrar informações secundárias ao lado do conteúdo principal de uma página.

Starlight providencia uma sintaxe Markdown customizada para renderizar asides. Blocos Aside são indicados utilizando um par de dois pontos triplo `:::` para envolver o seu conteúdo, e podem ser do tipo `note`, `tip`, `caution` ou `danger`.

Você pode aninhar qualquer outras formas de conteúdo Markdown dentro de um aside, mas asides são mais adequados para blocos curtos e concisos de conteúdo.

### Aside de Nota

:::note
Starlight é um conjunto de ferramentas para websites de documentação feito com [Astro](https://astro.build/). Você pode começar com o comando:

```sh
npm create astro@latest -- --template starlight
```

:::

````md
:::note
Starlight é um conjunto de ferramentas para websites de documentação feito com [Astro](https://astro.build/). Você pode começar com o comando:

```sh
npm create astro@latest -- --template starlight
```

:::
````

### Títulos de aside customizados

Você pode especificar um título customizado para o aside em colchetes seguindo o tipo do aside, e.x. `:::tip[Você sabia?]`.

:::tip[Você sabia?]
Astro te ajuda a construir websites mais rápidos com a [“Arquitetura em Ilhas”](https://docs.astro.build/pt-br/concepts/islands/).
:::

```md
:::tip[Você sabia?]
Astro te ajuda a construir websites mais rápidos com a [“Arquitetura em Ilhas”](https://docs.astro.build/pt-br/concepts/islands/).
:::
```

### Mais tipos de aside

Asides de cuidado e perigo são úteis para chamar a atenção de um usuário a detalhes que podem o atrapalhar.
Se você anda os utilizando muito, pode ser um sinal de que o que você está documentando se beneficiaria com uma mudança.

:::caution
Se você não tem certeza de que você quer um site de documentação incrível, pense novamente antes de utilizar [Starlight](../../).
:::

:::danger
Seus usuários podem ser mais produtivos e considerar seu produto mais fácil de usar graças a funcionalidades úteis do Starlight.

- Navegação compreensível
- Tema de cores configurável pelo usuário
- [Suporte a internacionalização](/pt-br/guides/i18n)

:::

```md
:::caution
Se você não tem certeza de que você quer um site de documentação incrível, pense novamente antes de utilizar [Starlight](../../).
:::

:::danger
Seus usuários podem ser mais produtivos e considerar seu produto mais fácil de usar graças a funcionalidades úteis do Starlight.

- Navegação compreensível
- Tema de cores configurável pelo usuário
- [Suporte a internacionalização](/pt-br/guides/i18n)

:::
```

## Citações

> Esta é uma citação, que é comumente utilizada ao citar outra pessoa ou documento.
>
> Citações são indicadas com um `>` no começo de cada linha.

```md
> Esta é uma citação, que é comumente utilizada ao citar outra pessoa ou documento.
>
> Citações são indicadas com um `>` no começo de cada linha.
```

## Blocos de código

Um bloco de código é indicado por um bloco com três crases <code>```</code> no começo e fim. Você pode indicar a linguagem de programação sendo utilizada após as crases iniciais.

```js
// Código JavaScript com syntax highlighting.
var divertido = function lingua(l) {
  formatodata.i18n = require('./lingua/' + l);
  return true;
};
```

````md
```js
// Código JavaScript com syntax highlighting.
var divertido = function lingua(l) {
  formatodata.i18n = require('./lingua/' + l);
  return true;
};
```
````

```md
Longos blocos de código de linha única não devem quebrar linha. Eles devem rolar horizontalmente se forem muito longos. Esta linha deve ser longa o suficiente para demonstrar isso.
```

## Outras funcionalidades comuns do Markdown

Starlight suporta todo o resto da sintaxe de escrita do Markdown, como listas e tabelas. Veja a [Cheat Sheet de Markdown do The Markdown Guide](https://www.markdownguide.org/cheat-sheet/) para uma visão geral rápida de todos os elementos da sintaxe do Markdown.
