---
title: 重写组件
description: 学习如何通过替换 Starlight 的内置组件来给你的文档站点 UI 添加自定义元素。
sidebar:
  badge: 新功能
---

Starlight 的默认 UI 和配置选项被设计成能灵活地适用于各种内容。大部分 Starlight 的默认外观可以通过 [CSS](/zh-cn/guides/css-and-tailwind/) 和 [配置选项](/zh-cn/guides/customization/) 进行自定义。

当你的需求超出了默认提供的功能时，Starlight 支持使用你自己的自定义组件来扩展或重写（完全替换）它的默认组件。

## 什么时候重写

重写 Starlight 的默认组件在以下情况下很有用：

- 你想要修改 Starlight 的一部分 UI 的样式，但是无法通过使用[自定义 CSS](/zh-cn/guides/css-and-tailwind/) 实现。
- 你想要修改 Starlight 的一部分 UI 的行为。
- 你想要在 Starlight 的现有 UI 旁边添加一些额外的 UI。

## 如何重写

1. 选择你想要重写的 Starlight 组件。
   你可以在[重写参考](/zh-cn/reference/overrides/)中找到完整的组件列表。

   本示例将重写 Starlight 页面导航栏中的 [`SocialIcons`](/zh-cn/reference/overrides/#socialicons) 组件。

2. 创建一个 Astro 组件来替换 Starlight 组件。
   本示例渲染了一个联系方式链接。

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">E-mail Me</a>
   ```

3. 在 `astro.config.mjs` 的 [`components`](/zh-cn/reference/configuration/#components) 配置选项中告诉 Starlight 使用你的自定义组件：

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My Docs with Overrides',
         components: {
           // 重写默认的 `SocialIcons` 组件。
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## 复用内置组件

你可以像使用自己的组件一样使用 Starlight 的默认 UI 组件：导入并在你自己的自定义组件中渲染它们。这样你就可以在你的设计中保留 Starlight 的基本 UI，同时在它们旁边添加额外的 UI。

下面的示例是一个自定义组件，它渲染了一个电子邮件链接以及默认的 `SocialIcons` 组件：

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">E-mail Me</a>
<Default {...Astro.props}><slot /></Default>
```

在自定义组件中渲染内置组件时：

- 展开传入 `Astro.props`。这样可以确保它接收到渲染所需的所有数据。
- 在默认组件内部添加一个 [`<slot />`](https://docs.astro.build/zh-cn/core-concepts/astro-components/#插槽)。这样，如果组件传入了任何子元素，Astro 就知道在哪里渲染它们。

## 使用页面数据

当重写 Starlight 组件时，你的自定义实现会接收一个标准的 `Astro.props` 对象，其中包含当前页面的所有数据。
这使得你可以使用这些值来控制你的组件模板的渲染方式。

例如，你可以通过 `Astro.props.entry.data` 读取页面的 frontmatter 数据。在下面的示例中，一个 [`PageTitle`](/zh-cn/reference/overrides/#pagetitle) 的替代组件使用它来显示当前页面的标题：

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

要了解更多关于可用的参数的信息，请参阅[重写参考](/zh-cn/reference/overrides/#组件参数)。

### 仅在特定页面上重写

组件重写在所有页面上生效。但是，你可以使用 `Astro.props` 中的值来条件性渲染，决定何时显示你的自定义 UI，何时显示 Starlight 的默认 UI，甚至何时显示完全不同的内容。

在下面的示例中，一个重写 [`Footer`](/zh-cn/reference/overrides/#footer) 的组件只在首页上显示“Built with Starlight 🌟”，在其他页面上显示默认的页脚：

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Built with Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

了解更多关于条件渲染的内容，请参阅 [Astro 模板语法指南](https://docs.astro.build/zh-cn/core-concepts/astro-syntax/#动态-html)。
