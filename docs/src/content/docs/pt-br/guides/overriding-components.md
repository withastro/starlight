---
title: Substituindo Componentes
description: Aprenda como substituir os componentes nativos do Starlight para adicionar elementos personalizados a interface do seu site de documentação.
sidebar:
  badge: New
---

<!---
TODO: Check all links and html anchors
-->

A interface e configuração padrão do Starlight foi projetada para ser flexível a adaptável à uma gama de conteúdos. Boa parte da customização da aparência padrão do Starlight pode ser feita com [CSS](/pt-br/guides/css-and-tailwind/) e via [opções de configuração](/pt-br/guides/customization/).

Para dar suporte a maiores modificações, o Starlight suporta a criação dos seus próprios componentes para estender ou substituir completamente os componentes padrão.

## Em que casos substituir

Substituir os componentes padrão do Starlight pode ser útil nos seguintes casos:

- Você deseja mudar parte da UI do Starlight que com [CSS personalizado](pt-br/guides/css-and-tailwind/) não é possível.
- Você deseja mudar o comportamento de parte da interface do Starlight.
- Você deseja adicionar alguma interface à interface existente do Starlight.

## Como substituir

1. Escolha qual componente você deseja substituir. Você pode encontrar uma lista completa de componentes na [Referência de Substituições](/pt-br/reference/overrides/).
   
   Neste exemplo, substituiremos o componente do Starlight [`SocialIcons`](/pt-br/reference/overrides/#socialicons) que fica na barra de navegação.

2. Crie um componente Astro para substituir o componentes Starlight. 
   O exemplo abaixo é de um link de contato.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">E-mail</a>
   ```

3. Na opção [`componentes`](/pt-br/reference/configuration/#components) do arquivo `astro.config.mjs`, sinalize ao Starlight para utilizar seu componente:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My Docs with Overrides',
         components: {
           // Substitui o componente `SocialIcons` padrão.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Reutilize um componente padrão

É possível criar com os componentes de interface padrão do Starlight da mesma forma que faria com os seus: importando-os e renderizando-os no seu próprios componentes personalizados. Isso permite que você mantenha toda a interface base do Starlight em seu design, e ao mesmo tempo adicionar novos elementos.

O exemplo a seguir mostra um componente personalizado que renderiza um link de email junto do componente `SocialIcons` padrão:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">E-mail</a>
<Default {...Astro.props}><slot /></Default>
```

Quando estiver utilizando um componente padrão dentro de um componente personalizado:

- Utilize a sintaxe de espalhemento com `Astro.props`. Assim garante-se que o componente vai receber todas os dados necessários para renderizar.
- Adicione um [`<slot />`](https://docs.astro.build/pt-br/core-concepts/astro-components/#slots) dentro do componente padrão. Isso é para garantir que o Astro saiba onde renderizar elementos filhos no componente, se algum for passado.

## Utilize dados da página

Quando estiver substituindo um componente Starlight, a sua implementação receberá um objeto padrão `Astro.props` contendo todas as informações da página atual.
Isso permite que você utilize esses valores para controlar como seu componente renderiza.

Por exemplo, você pode ler os valores do frontmatter a partir do `Astro.props.entry.data`. No exemplo a seguir, utilizamos [`PageTitle`](/pt-br/reference/overrides/#pagetitle) para exibir o título da página atual num componente substituto.

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

Aprenda mais sobre todos os props disponíveis na [Referência de Substituição](/pt-br/reference/overrides/#component-props).

### Substituindo apenas em páginas específicas

A substituição de componentes aplica-se a todas as páginas. Porém, você pode fazer o componente
renderizar condicionalmente utilizando `Astro.props` para determinar quando exibir a sua interface personaliza, ou a interface padrão do Starlight, or até mesmo para exibir algo totalmente diferente.

No exemplo a seguir, um componente está substituindo o [`Footer`](/pt-br/reference/overrides/#footer-1) padrão do Starlight para exibir "Feito com Starlight 🌟" apenas na página principal, e nas outras, exibir o rodapé padrão.

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Feito com Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Aprenda mais sobre renderização condicional no [Guia de Sintaxe de Template Astro](https://docs.astro.build/pt-br/core-concepts/astro-syntax/#html-din%C3%A2mico).