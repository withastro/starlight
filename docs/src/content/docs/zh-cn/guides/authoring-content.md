---
title: 在 Markdown 中创作内容
description: Starlight 支持的 Markdown 语法概述
---

Starlight 支持在 `.md` 文件中使用完整的 [Markdown](https://daringfireball.net/projects/markdown/) 语法，以及使用 [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) 定义metadata 元数据，例如标题和描述。

如果使用这些文件格式，请务必检查 [MDX 文档](https://mdxjs.com/docs/what-is-mdx/#markdown) 或 [Markdoc 文档](https://markdoc.dev/docs/syntax)，因为 Markdown 的支持和用法可能会有所不同。

## 内联样式

文本可以是**粗体**，_斜体_，或~~删除线~~。

```md
文本可以是**粗体**，_斜体_，或~~删除线~~。
```

你可以 [链接到另一个页面](/zh/getting-started/)。

```md
你可以 [链接到另一个页面](/zh/getting-started/)。
```

你可以使用反引号高亮 `内联代码`。

```md
你可以使用反引号高亮 `内联代码`。
```

## 图片

Starlight 中的图片使用 [Astro 的内置优化资源支持](https://docs.astro.build/zh-cn/guides/assets/)。

Markdown 和 MDX 支持用于显示图片的 Markdown 语法，其中包括屏幕阅读器和辅助技术的 alt-text。

![一个星球和星星的插图，上面写着“astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![一个星球和星星的插图，上面写着“astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

对于在项目中本地存储的图片，也支持图片的相对路径。

```md
// src/content/docs/page-1.md

![A rocketship in space](../../assets/images/rocket.svg)
```

## 标题

你可以使用标题来组织内容。Markdown 中的标题由行首的 `#` 数量来表示。

### 如何在 Starlight 中组织页面内容

Starlight 配置为自动使用页面标题作为一级标题，并将在每个页面的目录中包含一个“概述”标题。我们建议每个页面都从常规段落文本内容开始，并从 `<h2>` 开始使用页面标题：

```md
---
title: Markdown 指南
description: 如何在 Starlight 中使用 Markdown
---

本页面描述了如何在 Starlight 中使用 Markdown。

## 内联样式

## 标题
```

### 自动生成标题锚点链接

使用 Markdown 中的标题将自动为你提供锚点链接，以便你可以直接链接到页面的某些部分：

```md
---
title: 我的页面内容
description: 如何使用 Starlight 内置的锚点链接
---

## 介绍

我可以链接到同一页下面的[结论](#结论)。

## 结论

`https://my-site.com/page1/#introduction` 直接导航到我的介绍。
```

二级标题 (`<h2>`) 和 三级标题 (`<h3>`) 将自动出现在页面目录中。

## 旁白

旁白（也称为“警告”或“标注”）对于在页面的主要内容旁边显示辅助信息很有用。

Starlight 提供了一个自定义的 Markdown 语法来渲染旁白。旁白块使用一对三个冒号 `:::` 来包裹你的内容，并且可以是 `note`，`tip`，`caution` 或 `danger` 类型。

你可以在旁白中嵌套任何其他 Markdown 内容类型，但旁白最适合用于简短而简洁的内容块。

### Note 旁白

:::note
Starlight 是一个使用 [Astro](https://astro.build/) 构建的文档网站工具包。 你可以使用此命令开始：

```sh
npm create astro@latest -- --template starlight
```

:::

````md
:::note
Starlight 是一个使用 [Astro](https://astro.build/) 构建的文档网站工具包。 你可以使用此命令开始：

```sh
npm create astro@latest -- --template starlight
```

:::
````

### 自定义旁白标题

你可以在旁白类型后面的方括号中指定旁白的自定义标题，例如 `:::tip[你知道吗？]`。

:::tip[你知道吗？]
Astro 帮助你使用 [“群岛架构”](https://docs.astro.build/zh-cn/concepts/islands/) 构建更快的网站。
:::

```md
:::tip[你知道吗？]
Astro 帮助你使用 [“群岛架构”](https://docs.astro.build/zh-cn/concepts/islands/) 构建更快的网站。
:::
```

### 更多旁白类型

Caution 和 danger 旁白有助于吸引用户注意可能绊倒他们的细节。 如果你发现自己经常使用这些，这也可能表明你正在记录的内容可以从重新设计中受益。

:::caution
如果你不确定是否想要一个很棒的文档网站，请在使用 [Starlight](../../) 之前三思。
:::

:::danger
借助有用的 Starlight 功能，你的用户可能会提高工作效率，并发现你的产品更易于使用。

- 清晰的导航
- 用户可配置的颜色主题
- [i18n 支持](/zh/guides/i18n)

:::

```md
:::caution
如果你不确定是否想要一个很棒的文档网站，请在使用 [Starlight](../../) 之前三思。
:::

:::danger
借助有用的 Starlight 功能，你的用户可能会提高工作效率，并发现你的产品更易于使用。

- 清晰的导航
- 用户可配置的颜色主题
- [i18n 支持](/zh/guides/i18n)

:::
```

## 块引用

> 这是块引用，通常在引用其他人或文档时使用。
>
> 块引用以每行开头的 `>` 表示。

```md
> 这是块引用，通常在引用其他人或文档时使用。
>
> 块引用以每行开头的 `>` 表示。
```

## 代码块

代码块由三个反引号 <code>```</code> 开始和结束。你可以在开头的反引号后指定代码块的编程语言。

```js
// 带有语法高亮的 JavaScript 代码。
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// 带有语法高亮的 JavaScript 代码。
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
长单行代码块不应换行。如果它们太长，它们应该水平滚动。这一行应该足够长长长长长长长长长长长长来证明这一点。
```

## 其它通用 Markdown 语法

Starlight 支持所有其他 Markdown 语法，例如列表和表格。 请参阅 [Markdown 指南的 Markdown 速查表](https://www.markdownguide.org/cheat-sheet/) 以快速了解所有 Markdown 语法元素。
