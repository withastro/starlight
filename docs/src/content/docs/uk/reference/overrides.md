---
title: Перевизначає посилання
description: Огляд компонентів і атрибутів компонентів, які підтримуються перевизначеннями Starlight.
tableOfContents:
  maxHeadingLevel: 4
---

Ви можете замінити вбудовані компоненти Starlight, надавши шляхи до компонентів заміни в параметрі конфігурації Starlight [`components`](/uk/reference/configuration#components).
На цій сторінці перераховано всі компоненти, доступні для перевизначення, і посилання на їх реалізацію за замовчуванням на GitHub.

Дізнайтеся більше в [Посібнику із заміни компонентів](/uk/guides/overriding-components/).

## Реквізити компонентів

Усі компоненти мають доступ до стандартного об’єкта `Astro.props`, який містить інформацію про поточну сторінку.

Щоб ввести власні компоненти, імпортуйте тип `Props` із Starlight:

```astro
---
import type { Props } from '@astrojs/starlight/props';

const { hasSidebar } = Astro.props;
//      ^ type: boolean
---
```

Це забезпечить вам автозаповнення та типи під час доступу до `Astro.props`.

### Реквізит

Starlight передасть наведені нижче атрибути вашим спеціальним компонентам.

#### `dir`

**Type:** `'ltr' | 'rtl'`

Напрямок написання сторінки.

#### `lang`

**Type:** `string`

Мовний тег BCP-47 для локалі цієї сторінки, напр. `en`, `zh-CN` або `pt-BR`.

#### `locale`

**Type:** `string | undefined`

Базовий шлях, на якому обслуговується мова. `undefined` для кореневих сликів локалі.

#### `slug`

**Type:** `string`

Слаг для цієї сторінки, згенерований з імені файлу вмісту.

#### `id`

**Type:** `string`

Унікальний ідентифікатор цієї сторінки на основі назви файлу вмісту.

#### `isFallback`

**Type:** `true | undefined`

`true`, якщо ця сторінка не перекладена поточною мовою та використовує запасний вміст із мови за умовчанням.
Використовується лише на багатомовних сайтах.

#### `entryMeta`

**Type:** `{ dir: 'ltr' | 'rtl'; lang: string }`

Метадані мови для вмісту сторінки. Може відрізнятися від значень локалі верхнього рівня, якщо на сторінці використовується резервний вміст.

#### `entry`

Запис колекції вмісту Astro для поточної сторінки.
Включає значення frontmatter для поточної сторінки в `entry.data`.

```ts
entry: {
  data: {
    title: string;
    description: string | undefined;
    // etc.
  }
}
```

Дізнайтеся більше про форму цього об’єкта в [Astro’s Collection Entry Type](https://docs.astro.build/en/reference/api-reference/#collection-entry-type).

#### `sidebar`

**Type:** `SidebarEntry[]`

Записи бічної панелі навігації по сайту для цієї сторінки.

#### `hasSidebar`

**Type:** `boolean`

Чи повинна відображатися бічна панель на цій сторінці.

#### `pagination`

**Type:** `{ prev?: Link; next?: Link }`

Посилання на попередню та наступну сторінки на бічній панелі, якщо ввімкнено.

#### `toc`

**Type:** `{ minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] } | undefined`

Зміст цієї сторінки, якщо ввімкнено.

#### `headings`

**Type:** `{ depth: number; slug: string; text: string }[]`

Масив усіх заголовків Markdown, отриманих із поточної сторінки.
Натомість використовуйте [`toc`](#toc), якщо ви хочете створити зміст, який поважає параметри конфігурації Starlight.

#### `lastUpdated`

**Type:** `Date | undefined`

Об’єкт JavaScript `Date`, що вказує час останнього оновлення цієї сторінки, якщо ввімкнено.

#### `editUrl`

**Type:** `URL | невизначений`

Об’єкт `URL` для адреси, де цю сторінку можна редагувати, якщо ввімкнено.

---

## Компоненти

### Голова

Ці компоненти відображаються всередині елемента `<head>` кожної сторінки.
Вони мають містити лише [елементи, дозволені всередині `<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head#see_also).

#### `Head`

**Компонент за замовчуванням:** [`Head.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Head.astro)

Компонент відображається всередині `<head>` кожної сторінки.
Містить важливі теги, зокрема `<title>` і `<meta charset="utf-8">`.

Перевизначте цей компонент як крайній засіб.
Віддавайте перевагу [`head`](/uk/reference/configuration#head) параметру Starlight config, якщо це можливо.

#### `ThemeProvider`

**Компонент за замовчуванням:** [`ThemeProvider.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeProvider.astro)

Компонент, відображений усередині <head>, який налаштовує підтримку темної/світлої теми.
Реалізація за замовчуванням включає вбудований сценарій і `<template>`, який використовується сценарієм у [`<ThemeSelect />`](#themeselect).

---
### Доступність

#### `SkipLink`

**Компонент за замовчуванням:** [`SkipLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SkipLink.astro)

Компонент відображається як перший елемент усередині <body>, який посилається на вміст головної сторінки для доступності.
Реалізація за замовчуванням прихована, доки користувач не сфокусує її за допомогою клавіші табуляції на клавіатурі.

---

### Макет

Ці компоненти відповідають за розміщення компонентів Starlight і керування переглядами в різних точках зупинки.
Перевизначити це пов’язано зі значною складністю.
Якщо можливо, віддавайте перевагу заміні компонента нижчого рівня.

#### `PageFrame`

**Компонент за замовчуванням:** [`PageFrame.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageFrame.astro)

Компонент макета обгорнув більшу частину вмісту сторінки.
Реалізація за замовчуванням налаштовує макет заголовок–бічна панель–основний і включає слоти з іменами `header` і `sidebar` разом із слотом за замовчуванням для основного вмісту.
Він також відображає [`<MobileMenuToggle />`](#mobilemenutoggle) для підтримки перемикання навігації бічної панелі на малих (мобільних) вікнах перегляду.

#### `MobileMenuToggle`

**Компонент за замовчуванням:** [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro)

Компонент, відтворений усередині [`<PageFrame>`](#pageframe), який відповідає за перемикання навігації бічної панелі на малих (мобільних) вікнах перегляду.

#### `TwoColumnContent`

**Компонент за замовчуванням:** [`TwoColumnContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TwoColumnContent.astro)

Компонент макета, обернутий навколо стовпця основного вмісту та правої бічної панелі (зміст).
Реалізація за замовчуванням обробляє перемикання між макетом з одним стовпцем і малим вікном перегляду та макетом з двома стовпцями з великим вікном перегляду.

---

### Title

Ці компоненти відображають верхню панель навігації Starlight.

#### `SiteTitle`

**Компонент за замовчуванням:** [`Header.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Header.astro)

Компонент заголовка відображається у верхній частині кожної сторінки.
Стандартна реалізація відображає [`<SiteTitle />`](#sitetitle), [`<Search />`](#search), [`<SocialIcons />`](#socialicons), [`<ThemeSelect />` ](#themeselect) і [`<LanguageSelect />`](#languageselect).

#### `SiteTitle`

**Компонент за замовчуванням:** [`SiteTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SiteTitle.astro)

Компонент, який відображається на початку заголовка сайту для відтворення заголовка сайту.
Стандартна реалізація включає логіку відтворення логотипів, визначену в конфігурації Starlight.

#### `Search`

**Компонент за замовчуванням:** [`Search.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Search.astro)

Компонент, який використовується для відтворення інтерфейсу пошуку Starlight.
Реалізація за замовчуванням включає кнопку в заголовку та код для відображення модального пошуку, коли його натискають, і завантаження [інтерфейсу користувача Pagefind](https://pagefind.app/).

#### `SocialIcons`

**Компонент за замовчуванням:** [`SocialIcons.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SocialIcons.astro)

Компонент, відображений у заголовку сайту, включаючи посилання на піктограми соціальних мереж.
Стандартна реалізація використовує опцію [`social`](/uk/reference/configuration#social) у конфігурації Starlight для візуалізації піктограм і посилань.

#### `ThemeSelect`

**Компонент за замовчуванням:** [`ThemeSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeSelect.astro)

Компонент, відображений у заголовку сайту, який дозволяє користувачам вибрати бажану колірну схему.

#### `LanguageSelect`

**Компонент за замовчуванням:** [`LanguageSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LanguageSelect.astro)

Компонент, відображений у заголовку сайту, який дозволяє користувачам перемикатися на іншу мову.

---

### Глобальна бічна панель

Глобальна бічна панель Starlight містить основну навігацію сайту.
У вузьких вікнах перегляду це приховано за спадним меню.

#### `Sidebar`

**Компонент за замовчуванням:** [`Sidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Sidebar.astro)

Компонент відтворюється перед вмістом сторінки, що містить глобальну навігацію.
Реалізація за замовчуванням відображається як бічна панель на досить широких вікнах перегляду та всередині спадного меню на малих (мобільних) вікнах перегляду.
Він також відображає [`<MobileMenuFooter />`](#mobilemenufooter), щоб показати додаткові елементи в меню мобільного пристрою.

#### `MobileMenuFooter`

**Компонент за замовчуванням:** [`MobileMenuFooter.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuFooter.astro)

Компонент відображається в нижній частині спадного меню мобільного пристрою.
Стандартна реалізація відображає [`<ThemeSelect />`](#themeselect) і [`<LanguageSelect />`](#languageselect).

---

### Бічна панель сторінки

Бічна панель сторінки Starlight відповідає за відображення змісту підзаголовків поточної сторінки.
У вузьких вікнах перегляду це згортається в липке спадне меню.

#### `PageSidebar`

**Компонент за замовчуванням:** [`PageSidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageSidebar.astro)

Компонент відтворюється перед вмістом головної сторінки для відображення змісту.
Реалізація за замовчуванням відображає [`<TableOfContents />`](#tableofcontents) і [`<MobileTableOfContents />`](#mobiletableofcontents).

#### `TableOfContents`

**Компонент за замовчуванням:** [`TableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TableOfContents.astro)

Компонент, який відображає зміст поточної сторінки в ширших вікнах перегляду.

#### `MobileTableOfContents`

**Компонент за замовчуванням:** [`MobileTableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileTableOfContents.astro)

Компонент, який відображає зміст поточної сторінки на малих (мобільних) вікнах перегляду.

---

### Вміст

Ці компоненти відображаються в головному стовпці вмісту сторінки.

#### `Банер`

**Компонент за замовчуванням:** [`Banner.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Banner.astro)

Компонент банера відображається у верхній частині кожної сторінки.
Реалізація за замовчуванням використовує значення frontmatter [`banner`](/uk/reference/frontmatter#banner) сторінки, щоб вирішити, відображати чи ні.

#### `ContentPanel`

**Компонент за замовчуванням:** [`ContentPanel.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ContentPanel.astro)

Компонент макета, який використовується для обтікання розділів стовпця основного вмісту.

#### `PageTitle`

**Компонент за замовчуванням:** [`PageTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageTitle.astro)

Компонент, що містить елемент <h1> для поточної сторінки.

Реалізації мають переконатися, що вони встановлюють `id="_top"` для елемента `<h1>`, як у реалізації за умовчанням.

#### `FallbackContentNotice`

**Компонент за замовчуванням:** [`FallbackContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/FallbackContentNotice.astro)

Сповіщення, що відображається користувачам на сторінках, де переклад поточною мовою недоступний.
Використовується лише на багатомовних сайтах.

#### `Hero`

**Компонент за замовчуванням:** [`Hero.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Hero.astro)

Компонент відображається у верхній частині сторінки, коли [`hero`](/uk/reference/frontmatter#hero) встановлено у frontmatter.
Стандартна реалізація показує великий заголовок, слоган і посилання із закликом до дії поряд із необов’язковим зображенням.

#### `MarkdownContent`

**Компонент за замовчуванням:** [`MarkdownContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MarkdownContent.astro)

Компонент відображається навколо основного вмісту кожної сторінки.
Стандартна реалізація встановлює базові стилі для застосування до вмісту Markdown.

---

### Нижній колонтитул

Ці компоненти відображаються внизу головного стовпця вмісту сторінки.

#### `Footer`

**Компонент за замовчуванням:** [`Footer.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Footer.astro)

Компонент нижнього колонтитула, що відображається внизу кожної сторінки.
Стандартна реалізація відображає [`<LastUpdated />`](#lastupdated), [`<Pagination />`](#pagination) і [`<EditLink />`](#editlink).

#### `LastUpdated`

**Компонент за замовчуванням:** [`LastUpdated.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LastUpdated.astro)

Компонент відтворюється в нижньому колонтитулі сторінки для відображення дати останнього оновлення.

#### `EditLink`

**Компонент за замовчуванням:** [`EditLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/EditLink.astro)

Компонент відображається в нижньому колонтитулі сторінки для відображення посилання на сторінку, де можна редагувати її.

#### `Pagination`

**Компонент за замовчуванням:** [`Pagination.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Pagination.astro)

Компонент, відображений у нижньому колонтитулі сторінки для відображення стрілок навігації між попередніми та наступними сторінками.