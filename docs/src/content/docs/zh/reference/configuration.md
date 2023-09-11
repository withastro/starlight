---
title: 配置参考
description: Starlight 支持的所有配置选项的概述。
---

## 配置 `starlight` 集成

Starlight 是在 [Astro](https://astro.build) web 框架之上构建的集成。你可以在 `astro.config.mjs` 配置文件中配置你的项目：

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '我的令人愉快的文档网站',
    }),
  ],
});
```

你可以将以下选项传递给`starlight`集成。

### `title` (必填)

**类型：** `string`

设置你的网站标题。将用于元数据和浏览器标签标题。

### `description`

**类型：** `string`

设置你的网站描述。如果页面的 frontmatter 中没有设置 `description`，则在 `<meta name="description">` 标签中与搜索引擎共享元数据。

### `logo`

**类型：** [`LogoConfig`](#logoconfig)

在导航栏中设置一个 logo 图片，与网站标题一起显示或替代网站标题。你可以设置单个 `src` 属性，也可以为 `light` 和 `dark` 设置单独的图像源。

```js
starlight({
  logo: {
    src: './src/assets/my-logo.svg',
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

**类型：** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`  
**默认值：** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

配置每个页面右侧显示的目录。默认情况下，`<h2>` 和 `<h3>` 标题将包含在此目录中。

### `editLink`

**类型：** `{ baseUrl: string }`

通过设置你要使用的 base URL 来启用 “编辑此页” 链接。最终链接将是`editLink.baseUrl` +当前页面路径。例如，要启用在 GitHub 上编辑`withastro/starlight` 仓库中的页面：

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

使用此配置，`/introduction` 页面将具有指向 `https://github.com/withastro/starlight/edit/main/src/docs/introduction.md` 的编辑链接。

### `sidebar`

**类型：** [`SidebarItem[]`](#sidebaritem)

配置你的网站的侧边栏导航项目。

侧边栏是包含链接和链接组的数组。每个项目都必须具有 `label` 和以下属性之一：

- `link` — 指向特定 URL 的单个链接，例如 `'/home'` 或 `'https://example.com'`。

- `items` — 包含更多侧边栏链接和子组的数组。

- `autogenerate` — 指定要从中自动生成一组链接的文档目录的对象。

```js
starlight({
  sidebar: [
    // 标记为“Home”的单个链接项。
    { label: 'Home', link: '/' },
    // 一个标记为“Start Here”的组，其中包含两个链接。
    {
      label: 'Start Here',
      items: [
        { label: 'Introduction', link: '/intro' },
        { label: 'Next Steps', link: '/next-steps' },
      ],
    },
    // 一个链接到参考目录中所有页面的组。
    {
      label: 'Reference',
      autogenerate: { directory: 'reference' },
    },
  ],
});
```

#### 排序

自动生成的侧边栏组按文档名字母顺序排序。例如，从 `astro.md` 生成的页面将显示在 `starlight.md`页面上方。

#### 折叠组

默认情况下，链接组是展开的。你可以通过将组的 `collapsed` 属性设置为 `true` 来更改此行为。

自动生成的子组默认情况下会遵守其父组的 `collapsed` 属性。设置 `autogenerate.collapsed` 属性以覆盖此行为。

```js
sidebar: [
  // 一个折叠的链接组。
  {
    label: 'Collapsed Links',
    collapsed: true,
    items: [
      { label: 'Introduction', link: '/intro' },
      { label: 'Next Steps', link: '/next-steps' },
    ],
  },
  // 一个展开的组，其中包含折叠的自动生成的子组。
  {
    label: 'Reference',
    autogenerate: {
      directory: 'reference',
      collapsed: true,
    },
  },
],
```

#### 翻译标签

如果你的网站是多语言的，每个项目的 `label` 被认为是默认语言。你可以设置一个 `translations` 属性来为你支持的其他语言提供标签：

```js
sidebar: [
  // 一个侧边栏示例，其中的标签被翻译成法语。
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

**类型：** <code>{ \[dir: string\]: [LocaleConfig](#localeconfig) }</code>

为你的网站设置支持的 `locales` 来[配置国际化（i18n）](/zh/guides/i18n/)。

每个条目都应该使用该语言文件保存的目录作为 key。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Site',
      // 为这个网站设置英语作为默认语言。
      defaultLocale: 'en',
      locales: {
        // 英文文档在 `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // 简体中文文档在 `src/content/docs/zh/`
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // 阿拉伯文档在 `src/content/docs/ar/`
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

你可以为每个语言设置以下选项：

##### `label` (必填)

**类型：** `string`

要向用户显示的此语言的标签，例如在语言切换器中。大多数情况下，你会希望这是该语言的名称，因为该语言的用户希望阅读它，例如`"English"`，`"العربية"`，或者 `"简体中文"`。

##### `lang`

**类型：** `string`

此语言的 BCP-47 标签，例如`"en"`，`"ar"`，或者 `"zh-CN"`。如果未设置，则默认使用该语言的目录名称。 如果没有找到特定于区域的翻译，带有区域子标签的语言标签（例如`pt-BR`或`en-US`）将使用内置的 UI 翻译作为其基本语言。

##### `dir`

**类型：** `'ltr' | 'rtl'`

这种语言的写作方向; `"ltr"`表示从左到右（默认值）或`"rtl"`表示从右到左。

#### root locale

你可以通过设置 `root` locale 来提供不带 `/lang/` 目录的默认语言：

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

举例，这允许你将 `/getting-started/` 作为英语路由提供，并将 `/fr/getting-started/` 作为等效的法语页面。

### `defaultLocale`

**类型：** `string`

设置此站点的默认语言。
该值应该与你的 [`locales`](#locales) 对象的键之一匹配。
（如果你的默认语言是你的[root locale](#root-locale)，你可以跳过这一步。）

默认语言将用于在缺少翻译时提供回退内容。

### `social`

**类型：** `Partial<Record<'bitbucket' | 'codeberg' | 'codePen' | 'discord' | 'github' | 'gitlab' | 'gitter' | 'instagram' | 'linkedin' | 'mastodon' | 'microsoftTeams' | 'stackOverflow' | 'threads' | 'twitch' | 'twitter' | 'youtube', string>>`

可选的社交媒体账户详情。添加任何一个都会在网站标题中显示它们作为图标链接。

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

**类型：** `string[]`

提供 CSS 文件来自定义你的 Starlight 网站的外观和风格。

支持相对于项目根目录的本地 CSS 文件，例如 `'./src/custom.css'`，以及你安装为 npm 模块的 CSS，例如 `'@fontsource/roboto'`。

```js
starlight({
  customCss: ['./src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**类型：** [`HeadConfig[]`](#headconfig)

添加自定义标签到你的 Starlight 网站的 `<head>` 中。
可以用于添加分析和其他第三方脚本和资源。

```js
starlight({
  head: [
    // 示例：添加 Fathom 分析脚本标签。
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

**类型：** `boolean`  
**默认值：** `false`

控制页脚是否显示页面上次更新的时间。

默认情况下，此功能依赖于你的存储库的 Git 历史记录，并且在某些执行[浅克隆](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---depthltdepthgt)的部署平台上可能不准确。页面可以使用 [`lastUpdated` frontmatter 字段](/zh/reference/frontmatter/#lastupdated)覆盖此设置或基于 Git 的日期。

### `pagination`

**类型：** `boolean`  
**默认值：** `true`

定义页脚是否应包含上一页和下一页的链接。

页面可以使用 [`prev`](/zh/reference/frontmatter/#prev) 和 [`next`](/zh/reference/frontmatter/#next) frontmatter 字段覆盖此设置或链接文本和/或 URL。

### `favicon`

**类型：** `string`  
**默认值：** `'/favicon.svg'`

设置网站的默认 favicon 的路径，它应该位于 `public/` 目录中，并且是一个有效的（`.ico`，`.gif`，`.jpg`，`.png` 或 `.svg`）图标文件。

```js
starlight({
  favicon: '/images/favicon.svg',
}),
```

如果你需要设置其他变体或回退的 favicon，你可以使用 [`head` 选项](#head)添加标签：

```js
starlight({
  favicon: '/images/favicon.svg'.
  head: [
    // 为 Safari 添加 ICO favicon 回退。
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
