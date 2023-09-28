---
title: Frontmatter 参考
description: Starlight 支持的默认 frontmatter 字段的概述。
---

你可以通过设置 frontmatter 中的值来自定义 Starlight 中的单个 Markdown 和 MDX 页面。例如，一个常规页面可能会设置 `title` 和 `description` 字段：

```md
---
title: 关于此项目
description: 了解更多关于此项目的信息。
---

欢迎来到关于页面！
```

## Frontmatter 字段

### `title` (必填)

**类型：** `string`

你必须为每个页面提供标题。它将显示在页面顶部、浏览器标签中和页面元数据中。

### `description`

**类型：** `string`

页面描述用于页面元数据，将被搜索引擎和社交媒体预览捕获。

### `editUrl`

**类型：** `string | boolean`

覆盖[全局 `editLink` 配置](/zh/reference/configuration/#editlink)。设置为 false 可禁用特定页面的 “编辑页面” 链接，或提供此页面内容可编辑的备用 URL。

### `head`

**类型：** [`HeadConfig[]`](/zh/reference/configuration/#headconfig)

你可以使用 `<head>` frontmatter 字段向页面的`<head>`添加其他标签。这意味着你可以将自定义样式、元数据或其他标签添加到单个页面。类似于[全局 `head` 选项](/zh/reference/configuration/#head)。

```md
---
title: 关于我们
head:
  # 使用自定义 <title> 标签
  - tag: title
    content: 自定义关于我们页面标题
---
```

### `tableOfContents`

**类型：** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

覆盖[全局 `tableOfContents` 配置](/zh/reference/configuration/#tableofcontents)。自定义要包含的标题级别，或设置为 `false` 以在此页面上隐藏目录。

```md
---
title: 目录中只有 H2 的页面
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
title: 没有目录的页面
tableOfContents: false
---
```

### `template`

**类型：** `'doc' | 'splash'`  
**默认值：** `'doc'`

为页面选择布局模板。
页面默认使用 `'doc'` 布局。
设置为 `'splash'` 以使用没有任何侧边栏的更宽的布局，该布局专为落地页设计。

### `hero`

**类型：** [`HeroConfig`](#heroconfig)

添加一个 hero 组件到页面顶部。与 `template: splash` 配合使用效果更佳。

例如，此配置显示了一些常见选项，包括从你的仓库加载图像。

```md
---
title: 我的主页
template: splash
hero:
  title: '我的项目： Stellar Stuff Sooner'
  tagline: 把你的东西带到月球上，眨眼间又回来。
  image:
    alt: 一个闪闪发光、色彩鲜艳的标志
    file: ../../assets/logo.png
  actions:
    - text: 告诉我更多
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: 在 GitHub 上查看
      link: https://github.com/astronaut/my-project
      icon: external
---
```

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?: {
    alt?: string;
    // Relative path to an image in your repository.
    // 你的仓库中的图像的相对路径。
    file?: string;
    // 原始的 HTML 用于图像插槽。
    // 可以是自定义的 `<img>` 标签或内联的 `<svg>`。
    html?: string;
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

**类型：** `{ content: string }`

在此页面顶部显示公告横幅。

`content` 的值可以包含链接或其他内容的 HTML。
例如，此页面显示了一个横幅，其中包含指向 `example.com` 的链接。

```md
---
title: 带有横幅的页面
banner:
  content: |
    我们刚刚发布了一下非常酷的东西！
    <a href="https://example.com">点击查看！</a>
---
```

### `lastUpdated`

**类型：** `Date | boolean`

覆盖[全局 `lastUpdated` 配置](/zh/reference/configuration/#lastupdated)。如果指定了日期，它必须是有效的 [YAML 时间戳](https://yaml.org/type/timestamp.html)，并将覆盖存储在 Git 历史记录中的此页面的日期。

```md
---
title: 带有自定义更新日期的页面
lastUpdated: 2022-08-09
---
```

### `prev`

**类型：** `boolean | string | { link?: string; label?: string }`

覆盖[全局 `pagination` 配置](/zh/reference/configuration/#pagination)。如果指定了字符串，则将替换生成的链接文本；如果指定了对象，则将同时覆盖链接和文本。

```md
---
# 隐藏上一页链接
prev: false
---
```

```md
---
# 将上一页链接更改为“继续教程”
prev: 继续教程
---
```

```md
---
# 同时覆盖上一页的链接和文本
prev:
  link: /unrelated-page/
  label: 一个不相关的页面
---
```

### `next`

**类型：** `boolean | string | { link?: string; label?: string }`

和 [`prev`](#prev) 一样，但是用于下一页链接。

```md
---
# 隐藏下一页链接
next: false
---
```

### `pagefind`

**类型：** `boolean`  
**默认值：** `true`

设置此页面是否应包含在 [Pagefind](https://pagefind.app/) 搜索索引中。设置为 `false` 以从搜索结果中排除页面：

```md
---
# 在搜索索引中隐藏此页面
pagefind: false
---
```

### `sidebar`

**类型：** `{ label?: string; order?: number; hidden?: boolean; badge?: string | BadgeConfig }`

在使用自动生成的链接组时，控制如何在[侧边栏](/zh/reference/configuration/#sidebar)中显示此页面。

#### `label`

**类型：** `string`  
**默认值：** 页面 [`title`](#title-必填)

在自动生成的链接组中显示时，设置侧边栏中此页面的标签。

```md
---
title: 关于此项目
sidebar:
  label: About
---
```

#### `order`

**类型：** `number`

当对链接组进行自动生成排序时，控制此页面的顺序。
数字越小，链接组中显示的越高。

```md
---
title: 要首先显示的页面
sidebar:
  order: 1
---
```

#### `hidden`

**类型：** `boolean`
**默认值：** `false`

防止此页面包含在自动生成的侧边栏组中。

```md
---
title: 从自动生成的侧边栏中隐藏的页面
sidebar:
  hidden: true
---
```

#### `badge`

**类型：** <code>string | <a href="/zh/reference/configuration/#badgeconfig">BadgeConfig</a></code>

当在自动生成的链接组中显示时，在侧边栏中为页面添加徽章。

当使用字符串时，徽章将显示为默认的强调色。可选择的，传递一个 [`BadgeConfig` 对象](/zh/reference/configuration/#badgeconfig) ，其中包含 `text` 和 `variant` 字段，可以自定义徽章。

```md
---
title: 带有徽章的页面
sidebar:
  # 使用与你的网站的强调色相匹配的默认类型
  badge: 新增
---
```

```md
---
title: 带有徽章的页面
sidebar:
  badge:
    text: 实验性
    variant: caution
---
```
