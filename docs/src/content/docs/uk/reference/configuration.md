---
title:  Довідник з конфігурації
description: Огляд усіх параметрів конфігурації, які підтримує Starlight.
---

## Налаштування інтеграції `starlight

Starlight - це інтеграція, побудована на основі веб-фреймворку [Astro](https://astro.build). Ви можете налаштувати свій проект у файлі конфігурації `astro.config.mjs`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integration: [
    starlight({
      title: 'Мій чудовий сайт з документацією',
    }),
  ],
});
```

Ви можете передати наступні параметри до інтеграції `starlight`.

### `title` (required)

**type:** `string`

Задайте заголовок для вашого сайту. Буде використовуватися в метаданих і в заголовку вкладки браузера.

### `description` (required)

**type:** `string` (required)

Задайте опис вашого сайту. Використовується в метаданих, що передаються пошуковим системам у тезі `<meta name="description">`, якщо `description` не задано в заголовку сторінки.

### `logo`

**type:** [`LogoConfig`](#logoconfig)

Задає зображення логотипу, яке буде відображатися в навігаційній панелі поряд з назвою сайту або замість неї. Ви можете задати одну властивість `rc` або встановити окремі джерела зображень для `light` і `dark`.

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


Налаштуйте зміст, що відображається праворуч на кожній сторінці. За замовчуванням, заголовки `<h2>` і `<h3>` буде включено до цього змісту.

### `editLink`

**type:** `{ baseUrl: string }`

Увімкніть посилання "Редагувати цю сторінку", задавши базову URL-адресу, яку вони мають використовувати. Кінцевим посиланням буде `editLink.baseUrl` + шлях до поточної сторінки. Наприклад, щоб увімкнути редагування сторінок у репозиторії `withastro/starlight` на GitHub:

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

З таким налаштуванням сторінка `/introduction` матиме посилання для редагування, що вказуватиме на `https://github.com/withastro/starlight/edit/main/src/docs/introduction.md`.

### `sidebar`

**type:** [`SidebarItem[]`](#sidebaritem)

Налаштуйте елементи навігації бічної панелі вашого сайту.

Бічна панель - це масив посилань і груп посилань.
Кожен елемент повинен мати `label` і одну з наступних властивостей:

- `link` - одне посилання на певну URL-адресу, наприклад, `'/home'` або `'https://example.com'`.

- `items` - масив, що містить більше посилань та підгруп бічної панелі.

- `autogenerate` - об'єкт, що вказує каталог ваших документів для автоматичної генерації групи посилань.

```js
starlight({
  sidebar: [
    // Єдиний елемент посилання з міткою "Home".
    { label: 'Home', link: '/' },
    // Група з назвою "Start Here", що містить два посилання.
    {
      label: 'Start Here',
      items: [
        { label: 'Вступ', link: '/intro' },
        { label: 'Наступні кроки', link: '/next-steps' },
      ],
    },
    // Групове посилання на всі сторінки довідника.
    {
      label: 'Reference',
      autogenerate: { directory: 'reference' },
    },
  ],
});
```

#### Сортування

Автоматично згенеровані групи бічних панелей сортуються за алфавітом назв файлів.
Наприклад, сторінка, згенерована з `astro.md`, з'явиться над сторінкою для `starlight.md`.

#### Згортання груп

Групи посилань за замовчуванням розгортаються. Ви можете змінити цю поведінку, встановивши властивість `collapsed` групи у значення `true`.

Автогенеровані підгрупи за замовчуванням поважають властивість `collapsed` своєї батьківської групи. Встановіть властивість `autogenerate.collapsed`, щоб перевизначити її.

```js
sidebar: [
  // Згорнута група посилань.
  {
    label: 'Згорнуті посилання',
    collapsed: true,
    items: [
      { label: 'Вступ', link: '/intro' },
      { label: 'Наступні кроки', link: '/next-steps' },
    ],
  },
  // Розширена група, що містить згорнуті автогенеровані підгрупи.
  {
    label: 'Reference',
    autogenerate: {
      directory: 'reference',
      collapsed: true,
    },
  },
],
```

#### Переклад міток

Якщо ваш сайт багатомовний, `label` кожного елемента вважається локаллю за замовчуванням. Ви можете встановити властивість `translations`, щоб надати мітки для інших підтримуваних мов:

```js
sidebar: [
  // Приклад бічної панелі з мітками, перекладеними французькою мовою.
  {
    label: 'Start Here',
    translations: { fr: 'Commencez ici' },
    items: [
      {
        label: 'Початок роботи',
        translations: { fr: 'Bien démarrer' },
        link: '/getting-started',
      },
      {
        label: 'Структура проекту',
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
      attrs?: Record<string, string | number | boolean | undefined>;
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

**type:** <code>{ \[dir: string\]: [LocaleConfig](#localeconfig) }</code>

[Configure internationalization (i18n)](/guides/i18n/) for your site by setting which `locales` are supported.

Each entry should use the directory where that language’s files are saved as the key.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Site',
      // Set English as the default language for this site.
      defaultLocale: 'en',
      locales: {
        // English docs in `src/content/docs/en/`
        en: {
          label: 'English',
        },
        // Simplified Chinese docs in `src/content/docs/zh-cn/`
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // Arabic docs in `src/content/docs/ar/`
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

You can set the following options for each locale:
Ви можете задати наступні параметри для кожної локалі:

##### `label` (обов'язково)

**type:** `string` (обов'язково)

Мітка для цієї мови, яку буде показано користувачам, наприклад, у перемикачі мови. Найчастіше ви хочете, щоб це була назва мови так, як користувач цієї мови очікує її прочитати, наприклад, `"English"`, `"العربية"` або `"简体中文"`.

##### `lang`

**type:** `string

Тег BCP-47 для цієї мови, наприклад `"en"`, `"ar"` або `"zh-CN"`. Якщо його не встановлено, за замовчуванням буде використано назву каталогу мови. Мовні теги з регіональними підтегами (наприклад, `"pt-BR"` або `"en-US"`) використовуватимуть вбудований переклад інтерфейсу для базової мови, якщо не буде знайдено перекладу для конкретного регіону.

##### `dir`

**type:** `'ltr' | 'rtl'`

Напрямок запису цієї мови; `'ltr'` для зліва направо (за замовчуванням) або `'rtl'` для справа наліво.

#### Коренева локаль

Ви можете використовувати мову за замовчуванням без каталогу `/lang/`, встановивши локаль `root`:

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

Наприклад, це дозволяє використовувати `/getting-started/` як англійський маршрут, а `/fr/getting-started/` як еквівалентну французьку сторінку.

### `defaultLocale`

**type:** `string`

Задає мову, яка використовується за замовчуванням для цього сайту.
Значення має відповідати одному з ключів вашого об'єкта [`locales`](#locales).
(Якщо мовою за замовчуванням є ваша [коренева локаль](#root-locale), ви можете пропустити цей параметр).

Локалізацію за замовчуванням буде використано для забезпечення резервного вмісту у разі відсутності перекладу.

**type:** `Partial<Record<'bitbucket' | 'codeberg' | 'codePen' | 'discord' | 'email' | 'facebook' | 'github' | 'gitlab' | 'gitter' | 'instagram' | 'linkedin' | 'mastodon' | 'microsoftTeams' | 'rss' | 'stackOverflow' | 'telegram' | 'threads' | 'twitch' | 'twitter' | 'x.com' | 'youtube', string>>`

Необов'язкові дані про акаунти соціальних мереж для цього сайту. Додавання будь-якого з них відобразить їх у вигляді іконок-посилань у шапці сайту.

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
    'x.com': 'https://x.com/astrodotbuild',
    youtube: 'https://youtube.com/@astrodotbuild',
  },
});
```

### `customCss`

**type:** `string[]`

Надайте файли CSS, щоб налаштувати зовнішній вигляд вашого сайту на Starlight.

Підтримуються локальні файли CSS відносно кореня вашого проекту, наприклад, `'./src/custom.css'`, а також CSS, встановлені як npm-модуль, наприклад, `''@fontsource/roboto'``.

```js
starlight({
  customCss: ['./src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**type:** [`HeadConfig[]`](#headconfig)


Додайте кастомні теги до `<head>` вашого сайту Starlight.
Може бути корисним для додавання аналітики та інших сторонніх скриптів і ресурсів.

```js
starlight({
  head: [
    // Приклад: додати тег скрипта аналітики Fathom.
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

**type:** `boolean`  
**default:** `false`

Керування тим, чи показувати у нижньому колонтитулі дату останнього оновлення сторінки.

За замовчуванням ця функція покладається на історію Git'а вашого сховища і може бути неточною на деяких платформах розгортання, що виконують [неглибокі клони](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---depthltdepthgt). Сторінка може замінити цей параметр або дату на основі Git'а за допомогою поля [`lastUpdated` frontmatter](/reference/frontmatter/#lastupdated).

### `pagination`

**type:** `boolean`  
**default:** `true`

Визначає, чи має нижній колонтитул містити посилання на попередню та наступну сторінки.

Сторінка може замінити цей параметр або текст посилання та/або URL за допомогою полів [`prev`](/reference/frontmatter/#prev) та [`next`](/reference/frontmatter/#next) переднього колонтитулу.

### `favicon`

**type:** `string`  
**default:** `'/favicon.svg'`

Вказує шлях до іконки за замовчуванням для вашого сайту, яка повинна знаходитися в каталозі `public/` і бути допустимим файлом іконки (.ico`, `.gif`, `.jpg`, `.png` або `.svg`).

```js
starlight({
  favicon: '/images/favicon.svg',
}),
```

Якщо вам потрібно встановити додаткові варіанти або запасні іконки, ви можете додати теги за допомогою опції [`head`](#head):

```js
starlight({
  favicon: '/images/favicon.svg'.
  head: [
    // Додайте запасний варіант іконки ICO для Safari.
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

### `titleDelimiter`

**type:** `string`  
**default:** `'|'`

Задає роздільник між заголовком сторінки і заголовком сайту в тезі `<title>` сторінки, який відображається у вкладках браузера.

За замовчуванням, кожна сторінка має `<title>` з `Назва сторінки | Назва сайту`.
Наприклад, ця сторінка має назву "Довідник з конфігурації", а цей сайт має назву "Starlight", тому `<title>` для цієї сторінки буде "Довідник з конфігурації | Starlight".

### `components`

**type:** `Record<string, string>`

Вкажіть шляхи до компонентів для заміни реалізацій Starlight за замовчуванням.

```js
starlight({
  components: {
    SocialLinks: './src/components/MySocialLinks.astro',
  },
});
```

Дивіться [Посилання на перевизначення](/reference/oversides/) для отримання детальної інформації про всі компоненти, які ви можете перевизначити.