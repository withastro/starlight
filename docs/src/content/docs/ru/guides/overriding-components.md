---
title: Переопределение Компонентов
description: Узнайте, как переопределить встроенные компоненты Starlight, чтобы добавить пользовательские элементы в UI вашего сайта документации.
sidebar:
  badge: Новое
---

Стандартный UI и параметры конфигурации Starlight разработаны так,
чтобы быть гибкими и работать с различным контентом.
Большая часть стандартного внешнего вида Starlight может быть настроена с использованием [CSS](/ru/guides/css-and-tailwind/)
и [параметров конфигурации](/ru/guides/customization/).

Когда вам нужно больше, чем то, что возможно из коробки,
Starlight поддерживает создание собственных компонентов для расширения или переопределения (полная замена) его стандартных компонентов.

## Когда переопределять

Переопределение стандартных компонентов Starlight может быть полезно, когда:

- Вы хотите изменить внешний вид UI Starlight так, как это невозможно сделать с использованием [пользовательских CSS](/ru/guides/css-and-tailwind/).
- Вы хотите изменить поведение UI Starlight.
- Вы хотите добавить какой-то дополнительный UI наряду с существующим UI Starlight.

## Как выполнить переопределение

1. Выберите компонент Starlight, который вы хотите переопределить.
   Вы можете найти полный список компонентов в [Справочнике по переопределениям](/ru/reference/overrides/).

   В этом примере будет переопределен компонент [`SocialIcons`](/ru/reference/overrides/#socialicons) Starlight в навигационной панели страницы.

2. Создайте компонент Astro для замены компонента Starlight.
   В этом примере отображается ссылка для связи.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">Написать нам на E-mail</a>
   ```

3. Сообщите Starlight использовать ваш компонент, указав его в параметре конфигурации [`components`](/ru/reference/configuration/#components) в `astro.config.mjs`:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'Моя документация, с переопределением',
         components: {
           // Переопределение компонента `SocialIcons`.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Переиспользование встроенного компонента

Вы можете работать со стандартными UI компонентами Starlight так же,
как и со своими собственными: импортировать их и использовать в своих компонентах.
Это позволяет вам сохранить весь UI Starlight в рамках вашего дизайна,
добавляя свой UI рядом с ними.

Пример ниже показывает компонент, который отображает ссылку на электронную почту наряду со стандартным компонентом `SocialIcons`:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">Написать нам на E-mail</a>
<Default {...Astro.props}><slot /></Default>
```

При использовании встроенного компонента внутри вашего компонента:

- Передайте в него `Astro.props`. Это гарантирует, что он получит все данные, необходимые для отображения.
- Добавьте [`<slot />`](https://docs.astro.build/ru/core-concepts/astro-components/#slots) внутрь компонента по умолчанию. Это гарантирует, что если компоненту передаются какие-либо дочерние элементы, Astro знает, где их отображать.

## Использование данных страницы

При переопределении компонента Starlight ваша реализация получает стандартный объект `Astro.props`, содержащий все данные для текущей страницы.
Это позволяет вам использовать эти значения для управления тем, как ваш компонент будет отображаться.

Например, вы можете прочитать метаданные страницы как `Astro.props.entry.data`.
В следующем примере компонент [`PageTitle`](/ru/reference/overrides/#pagetitle) использует этот объект для отображения текущего заголовка страницы:

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

Узнайте больше обо всех доступных свойствах в [Справочнике по переопределениям](/ru/reference/overrides/#component-props).

### Переопределение только на определенных страницах

Переопределение компонентов применяется ко всем страницам. Тем не менее, вы можете осуществлять условный рендеринг,
используя значения из `Astro.props`, чтобы определить, когда показывать ваш UI,
когда показывать UI от Starlight, или даже когда показывать что-то совершенно другое.

В следующем примере компонент, переопределяющий [`Footer`](/ru/reference/overrides/#footer-1) от Starlight,
отображает "Создано с Starlight 🌟" только на главной странице, а на всех остальных страницах показывает футер по умолчанию:

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Создано с Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Узнайте больше о условной отрисовке в руководстве [Astro’s Template Syntax](https://docs.astro.build/ru/core-concepts/astro-syntax/#dynamic-html).
