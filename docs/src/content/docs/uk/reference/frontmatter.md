---
title: Frontmatter Reference
description: Огляд стандартних полів переднього матеріалу, які підтримує Starlight.
---

Ви можете налаштувати окремі сторінки Markdown і MDX у Starlight, встановивши значення в їхній передній частині. Наприклад, звичайна сторінка може встановити поля `title` і `description`:

```md
---
title: Про цей проект
description: Дізнайтеся більше про проект, над яким я працюю.
---

Вітаємо на сторінці про нас!
```

## Поля Frontmatter

### `title` (required)

**type:** `string`

Ви повинні вказати назву для кожної сторінки. Це відображатиметься у верхній частині сторінки, на вкладках веб-переглядача та в метаданих сторінки.

### `description`

**type:** `string`

Опис сторінки використовується для метаданих сторінки та буде підібрано пошуковими системами та в попередніх переглядах соціальних мереж.

### `editUrl`

**type:** `string | boolean`

Перевизначає [глобальну конфігурацію `editLink`](/uk/reference/configuration/#editlink). Встановіть значення `false`, щоб вимкнути посилання «Редагувати сторінку» для певної сторінки або надати альтернативну URL-адресу, де можна редагувати вміст цієї сторінки.

### `head`

**type:** [`HeadConfig[]`](/uk/reference/configuration/#headconfig)

Ви можете додати додаткові теги до `<head>` вашої сторінки за допомогою поля `head` frontmatter. Це означає, що ви можете додавати власні стилі, метадані чи інші теги до однієї сторінки. Подібно до [глобального параметра `head`](/uk/reference/configuration/#head).

```md
---
title: Про нас
head:
   # Використовуйте спеціальний тег <title>
   - tag: заголовок
     content: Користувацька назва
---
```

### `tableOfContents`

**type:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Перевизначає [глобальну конфігурацію `tableOfContents`](/uk/reference/configuration/#tableofcontents).
Налаштуйте рівні заголовків, які потрібно включити, або встановіть значення `false`, щоб приховати зміст на цій сторінці.

```md
---
title: Сторінка лише з H2 у змісті
content:
   minHeadingLevel: 2
   maxHeadingLevel: 2
---
```

```md
---
title: Сторінка без змісту
tableOfContents: false
---
```

### `template`

**type:** `'doc' | 'splash'`  
**default:** `'doc'`

Встановіть шаблон макета для цієї сторінки.
Сторінки за замовчуванням використовують макет `'doc'`.
Установіть значення «splash», щоб використовувати ширший макет без бічних панелей, призначених для цільових сторінок.

### `HeroConfig`

**type:** [`HeroConfig`](#heroconfig)

Додайте компонент героя вгору цієї сторінки. Добре працює з `template: splash`.

Наприклад, ця конфігурація показує деякі загальні параметри, включаючи завантаження зображення з вашого сховища.

```md
---
title: Моя Домашня Сторінка
template: splash
hero:
  title: "Мій проект: Stellar Stuff Sooner"
  tagline: доставте свої речі на місяць і назад миттєво.
  image:
    alt: A glittering, brightly colored logo
    file: ../../assets/logo.png
  actions:
    - text: Tell me more
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: View on GitHub
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
    file?: string;
    // Raw HTML to use in the image slot.
    // Could be a custom `<img>` tag or inline `<svg>`.
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

**type:** `{ content: string }`

Відображає банер оголошення у верхній частині цієї сторінки.

Значення `content` може містити HTML для посилань або іншого вмісту.
Наприклад, на цій сторінці відображається банер із посиланням на `example.com`.

```md
---
title: Сторінка з банером
banner:
  content: |
   Ми щойно запустили щось круте!
    <a href="https://example.com"> Перевір </a>
---
```

### `lastUpdated`

**type:** `Date | boolean`

Перевизначає [глобальний параметр `lastUpdated`](/uk/reference/configuration/#lastupdated). Якщо вказано дату, вона має бути дійсною [міткою часу YAML](https://yaml.org/type/timestamp.html) і замінить дату, збережену в історії Git для цієї сторінки.

```md
---
title: Сторінка зі спеціальною датою останнього оновлення
останнє оновлення: 2022-08-09
---
```

### `prev`

**type:** `boolean | string | { link?: string; label?: string }`

Замінює [глобальний параметр `pagination`](/uk/reference/configuration/#pagination). Якщо вказано рядок, згенерований текст посилання буде замінено, а якщо вказано об’єкт, і посилання, і текст буде замінено.

```md
---
# Приховати посилання на попередню сторінку
prev: false
---
```

```md
---
# Заміна тексту посилання на попередню сторінку
prev: Продовжити 
---
```

```md
---
# Замінити посилання на попередню сторінку та текст
prev:
  link: /unrelated-page/
  label: Check out this other page
---
```

### `next`

**type:** `boolean | string | { link?: string; label?: string }`

Те саме, що [`prev`](#prev), але для посилання на наступну сторінку.

```md
---
# Приховати посилання на наступну сторінку
next: false
---
```

### `pagefind`

**type:** `boolean`  
**default:** `true`

Укажіть, чи включати цю сторінку в пошуковий індекс [Pagefind](https://pagefind.app/). Установіть значення `false`, щоб виключити сторінку з результатів пошуку:

```md
---
# Приховати цю сторінку з індексу пошуку
pagefind: false
---
```

### `sidebar`

**type:** [`SidebarConfig`](#sidebarconfig)

Контролюйте, як ця сторінка відображається на [бічній панелі](/uk/reference/configuration/#sidebar), якщо використовується автоматично створена група посилань.

#### `SidebarConfig`

```ts
interface SidebarConfig {
  label?: string;
  order?: number;
  hidden?: boolean;
  badge?: string | BadgeConfig;
  attrs?: Record<string, string | number | boolean | undefined>;
}
```

#### `label`

**type:** `string`  
**default:** the page [`title`](#title-required)

Установіть мітку для цієї сторінки на бічній панелі, коли вона відображається в автоматично згенерованій групі посилань.

```md
---
title: Про цей проект
sidebar:
  label: About
---
```

#### `order`

**type:** `number`

Керуйте порядком цієї сторінки під час сортування автоматично згенерованої групи посилань.
Нижні числа відображаються вище в групі посилань.

```md
---
title: Cторінка для відображення першою
sidebar:
  order: 1
---
```

#### `hidden`

**type:** `boolean`  
**default:** `false`

Запобігає включенню цієї сторінки до автоматично створеної групи бічної панелі.

```md
---
title: Сторінка, яку потрібно приховати від автоматично створеної бічної панелі
sidebar:
  hidden: true
---
```

#### `badge`

**type:** <code>string | <a href="/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Додайте значок до сторінки на бічній панелі, коли вона відображається в автоматично згенерованій групі посилань.
Якщо використовується рядок, значок відображатиметься кольором акценту за замовчуванням.
За бажанням передайте [об’єкт BadgeConfig](/uk/reference/configuration/#badgeconfig) із полями text і variant, щоб налаштувати значок.


```md
---
title: Сторінка зі значком
sidebar:
  # Використовує варіант за замовчуванням, що відповідає акцентному кольору вашого сайту
  badge: New
---
```

```md
---
title: Сторінка зі значком
sidebar:
  badge:
    text: Experimental
    variant: caution
---
```

#### `attrs`

**type:** `Record<string, string | number | boolean | undefined>`

Атрибути HTML для додавання до посилання сторінки на бічній панелі під час відображення в автоматично згенерованій групі посилань.

```md
---
title: сторінка відкривається в новій вкладці
sidebar:
   # Відкриває сторінку в новій вкладці
  attrs:
    target: _blank
---
```