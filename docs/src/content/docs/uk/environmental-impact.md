---
title: Екологічно чисті документи
description: Дізнайтеся, як Starlight може допомогти вам створювати екологічніші сайти документації та зменшити свій вуглецевий слід.
---

Оцінки впливу веб-індустрії на клімат коливаються від [2%][sf] до [4% глобальних викидів вуглецю][bbc], що приблизно еквівалентно викидам авіаційної галузі.
Існує багато складних факторів для розрахунку екологічного впливу веб-сайту, але цей посібник містить кілька порад щодо зменшення впливу вашого сайту документів на навколишнє середовище.

Хороша новина полягає в тому, що вибір Starlight — чудовий початок.
Відповідно до Website Carbon Calculator, цей сайт є [чистішим, ніж 99% перевірених веб-сторінок][sl-carbon], виробляючи 0,01 г CO₂ за відвідування сторінки.

## Вага сторінки

Чим більше даних передає веб-сторінка, тим більше енергоресурсів їй потрібно.
У квітні 2023 року середня веб-сторінка вимагала від користувача завантажити понад 2000 КБ відповідно до [даних з архіву HTTP][http].

Starlight створює максимально легкі сторінки.
Наприклад, під час першого відвідування користувач завантажить менше 50 КБ стислих даних — лише 2,5% медіани HTTP-архіву.
З хорошою стратегією кешування наступні навігації можуть завантажити лише 10 КБ.

### Зображення

Хоча Starlight забезпечує хорошу основу, зображення, які ви додаєте на сторінки документів, можуть швидко збільшити вагу сторінки.
Starlight використовує Astro [optimized asset support][assets] для оптимізації локальних зображень у ваших файлах Markdown і MDX.

### Компоненти інтерфейсу користувача

Компоненти, створені за допомогою фреймворків інтерфейсу користувача, таких як React або Vue, можуть легко додати велику кількість JavaScript на сторінку.
Оскільки Starlight побудовано на Astro, подібні компоненти завантажують **нульовий клієнтський JavaScript за замовчуванням** завдяки [Astro Islands][islands].

### Кешування

Кешування використовується для контролю того, як довго браузер зберігає та повторно використовує вже завантажені дані.
Хороша стратегія кешування гарантує, що користувач отримує новий вміст якнайшвидше, коли він змінюється, але також уникає безглуздого завантаження того самого вмісту знову і знову, коли він не змінився.

Найпоширеніший спосіб налаштувати кешування — за допомогою HTTP-заголовка [`Cache-Control`][cache].
Використовуючи Starlight, ви можете встановити тривалий час кешу для всього, що знаходиться в каталозі `/_astro/`.
Цей каталог містить CSS, JavaScript та інші об’єднані ресурси, які можна безпечно кешувати назавжди, зменшуючи непотрібні завантаження:

```
Cache-Control: загальнодоступний, max-age=604800, immutable
```

Спосіб налаштування кешування залежить від вашого веб-хостингу. Наприклад, Vercel застосовує цю стратегію кешування для вас, не потребуючи конфігурації, тоді як ви можете встановити [спеціальні заголовки для Netlify][ntl-headers], додавши файл `public/_headers` до свого проекту:

```
/_astro/*
   Cache-Control: public
   Cache-Control: max-age=604800
   Cache-Control: immutable
```

[cash]: https://csswizardry.com/2019/03/cache-control-for-civilians/
[ntl-headers]: https://docs.netlify.com/routing/headers/

## Споживання енергії

Те, як побудована веб-сторінка, може впливати на потужність, необхідну для роботи на пристрої користувача.
Використовуючи мінімальну кількість JavaScript, Starlight зменшує потужність процесора, необхідну телефону, планшету або комп’ютеру користувача для завантаження та відтворення сторінок.

Будьте уважні, додаючи такі функції, як сценарії відстеження аналітики або контент, який містить багато JavaScript, як-от вставляння відео, оскільки це може збільшити споживання енергії сторінкою.
Якщо вам потрібна аналітика, подумайте про вибір полегшеного варіанту, наприклад [Cabin][cabin], [Fathom][fathom] або [Plausible][plausible].
Вбудовані відео YouTube і Vimeo можна покращити, дочекавшись [завантаження відео під час взаємодії з користувачем][lazy-video].
Такі пакети, як [`astro-embed`][embed], можуть допомогти у звичайних службах.

:::tip[Чи знаєте ви?]
Розбір і компіляція JavaScript є одним із найдорожчих завдань, які доводиться виконувати браузерам.
Порівняно з рендерингом зображення JPEG такого самого розміру, [обробка JavaScript може тривати у 30 разів довше][вартість-js].
:::

[cabin]: https://withcabin.com/
[fathom]: https://usefathom.com/
[plausible]: https://plausible.io/
[lazy-video]: https://web.dev/iframe-lazy-loading/
[embed]: https://www.npmjs.com/package/astro-embed
[cost-of-js]: https://medium.com/dev-channel/the-cost-of-javascript-84009f51e99e

## Хостинг

Місце розміщення веб-сторінки може мати великий вплив на екологічність вашого сайту документації.
Центри обробки даних і серверні ферми можуть мати великий екологічний вплив, включаючи високе споживання електроенергії та інтенсивне використання води.

Вибір хосту, який використовує відновлювані джерела енергії, означатиме зниження викидів вуглецю для вашого сайту. [Green Web Directory][gwb] – це один із інструментів, який допоможе вам знайти хостингові компанії.

[gwb]: https://www.thegreenwebfoundation.org/directory/

## Порівняння

Цікаво, як порівнюються інші фреймворки документів?
Ці тести за допомогою [Вуглецевого калькулятора веб-сайту][wcc] порівнюють подібні сторінки, створені за допомогою різних інструментів.

| Framework                   | CO₂ per page visit |
| --------------------------- | ------------------ |
| [Starlight][sl-carbon]      | 0.01g              |
| [VitePress][vp-carbon]      | 0.05g              |
| [Docus][dc-carbon]          | 0.05g              |
| [Sphinx][sx-carbon]         | 0.07g              |
| [MkDocs][mk-carbon]         | 0.10g              |
| [Nextra][nx-carbon]         | 0.11g              |
| [docsify][dy-carbon]        | 0.11g              |
| [Docusaurus][ds-carbon]     | 0.24g              |
| [Read the Docs][rtd-carbon] | 0.24g              |
| [GitBook][gb-carbon]        | 0.71g              |

<small>Дані зібрано 14 травня 2023 року. Натисніть посилання, щоб переглянути актуальні дані.</small>

[sl-carbon]: https://www.websitecarbon.com/website/starlight-astro-build-getting-started/
[vp-carbon]: https://www.websitecarbon.com/website/vitepress-dev-guide-what-is-vitepress/
[dc-carbon]: https://www.websitecarbon.com/website/docus-dev-introduction-getting-started/
[sx-carbon]: https://www.websitecarbon.com/website/sphinx-doc-org-en-master-usage-quickstart-html/
[mk-carbon]: https://www.websitecarbon.com/website/mkdocs-org-getting-started/
[nx-carbon]: https://www.websitecarbon.com/website/nextra-site-docs-docs-theme-start/
[dy-carbon]: https://www.websitecarbon.com/website/docsify-js-org/
[ds-carbon]: https://www.websitecarbon.com/website/docusaurus-io-docs/
[rtd-carbon]: https://www.websitecarbon.com/website/docs-readthedocs-io-en-stable-index-html/
[gb-carbon]: https://www.websitecarbon.com/website/docs-gitbook-com/

## Більше ресурсів

### Інструменти

- [Website Carbon Calculator][wcc]
- [GreenFrame](https://greenframe.io/)
- [Ecograder](https://ecograder.com/)
- [WebPageTest Carbon Control](https://www.webpagetest.org/carbon-control/)
- [Ecoping](https://ecoping.earth/)

### Статті та доповіді

- [“Building a greener web”](https://youtu.be/EfPoOt7T5lg), розмова Мішель Баркер
- [“Sustainable Web Development Strategies Within An Organization”](https://www.smashingmagazine.com/2022/10/sustainable-web-development-strategies-organization/), стаття Мішель Баркер
- [“A sustainable web for everyone”](https://2021.stateofthebrowser.com/speakers/tom-greenwood/), виступ Тома Грінвуда
- [“How Web Content Can Affect Power Usage”](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/), стаття Бенджаміна Пулена та Саймона Фрейзера

[sf]: https://www.sciencefocus.com/science/what-is-the-carbon-footprint-of-the-internet/
[bbc]: https://www.bbc.com/future/article/20200305-why-your-internet-habits-are-not-as-clean-as-you-think
[http]: https://httparchive.org/reports/state-of-the-web
[assets]: https://docs.astro.build/en/guides/assets/
[islands]: https://docs.astro.build/en/concepts/islands/
[wcc]: https://www.websitecarbon.com/
