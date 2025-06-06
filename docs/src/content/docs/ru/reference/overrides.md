---
title: Переопределения
description: Обзор компонентов и параметров компонентов, поддерживаемых переопределениями Starlight.
tableOfContents:
  maxHeadingLevel: 4
---

Вы можете переопределить встроенные компоненты Starlight, указав пути к заменяющим компонентам в опции конфигурации Starlight [`components`](/ru/reference/configuration/#components).
На этой странице перечислены все компоненты, доступные для переопределения, и даны ссылки на их реализации по умолчанию на GitHub.

Подробнее см. в [Руководстве по переопределению компонентов](/ru/guides/overriding-components/).

## Компоненты

### Элемент `head`

Эти компоненты отображаются внутри элемента `<head>` каждой страницы.
Они должны включать только [элементы, разрешённые внутри `<head>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/head#%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B8%D1%82%D0%B5_%D1%82%D0%B0%D0%BA%D0%B6%D0%B5).

#### `Head`

**Стандартный компонент:** [`Head.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Head.astro)

Компонент, отображаемый внутри `<head>` каждой страницы.

Переопределяйте этот компонент только в крайнем случае.
По возможности используйте [параметр `head` в конфигурации](/ru/reference/configuration/#head), [поле `head` в метаданных](/ru/reference/frontmatter/#head) или [мидлвар для данных маршрута](/ru/guides/route-data/#настройка-данных-маршрута), чтобы настроить данные маршрута, отображаемые компонентом по умолчанию.

#### `ThemeProvider`

**Стандартный компонент:** [`ThemeProvider.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeProvider.astro)

Компонент, отображаемый внутри `<head>`, который устанавливает поддержку тёмной/светлой темы.
Реализация по умолчанию включает в себя встроенный скрипт и `<template>`, используемый скриптом в [`<ThemeSelect />`](#themeselect).

---

### Доступность

#### `SkipLink`

**Стандартный компонент:** [`SkipLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SkipLink.astro)

Компонент, отображаемый как первый элемент внутри `<body>`, который ссылается на основное содержимое страницы для обеспечения доступности.
Реализация по умолчанию скрыта до тех пор, пока пользователь не наведет на нее курсор с помощью табуляции на клавиатуре.

---

### Макет

Эти компоненты отвечают за компоновку компонентов Starlight и управление представлениями в различных точках останова.
Их переопределение сопряжено со значительными сложностями.
По возможности предпочитайте переопределять компоненты более низкого уровня.

#### `PageFrame`

**Стандартный компонент:** [`PageFrame.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageFrame.astro)
**Именованные слоты:** `header`, `sidebar`

Компонент макета оборачивается вокруг большей части содержимого страницы.
Реализация по умолчанию устанавливает макет header-sidebar-main и включает в себя именованные слоты `header` и `sidebar`, а также слот по умолчанию для основного содержимого.
Он также отображает [`<MobileMenuToggle />`](#mobilemenutoggle) для поддержки переключения навигации в боковой панели на маленьких (мобильных) экранах просмотра.

#### `MobileMenuToggle`

**Стандартный компонент:** [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro)

Компонент, отображаемый внутри [`<PageFrame>`](#pageframe), который отвечает за переключение навигации боковой панели на маленьких (мобильных) экранах просмотра.

#### `TwoColumnContent`

**Стандартный компонент:** [`TwoColumnContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TwoColumnContent.astro)
**Именованный слот:** `right-sidebar`

Компонент макета оборачивается вокруг колонки с основным содержанием и правой боковой панели (оглавление).
Реализация по умолчанию управляет переключением между одноколоночным макетом с малой областью просмотра и двухколоночным макетом с большей областью просмотра.

---

### Шапка

Эти компоненты отображают верхнюю навигационную панель Starlight.

#### `Header`

**Стандартный компонент:** [`Header.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Header.astro)

Компонент заголовка отображается в верхней части каждой страницы.
По умолчанию отображаются [`<SiteTitle />`](#sitetitle), [`<Search />`](#search), [`<SocialIcons />`](#socialicons), [`<ThemeSelect />`](#themeselect), и [`<LanguageSelect />`](#languageselect).

#### `SiteTitle`

**Стандартный компонент:** [`SiteTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SiteTitle.astro)

Компонент, отображаемый в начале заголовка сайта для отображения заголовка сайта.
Реализация по умолчанию включает логику для отрисовки логотипов, определённую в конфигурации Starlight.

#### `Search`

**Стандартный компонент:** [`Search.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Search.astro)

Компонент, используемый для отображения пользовательского интерфейса поиска Starlight.
Реализация по умолчанию включает кнопку в заголовке и код для отображения модального окна поиска при нажатии на нее и загрузки [интерфейса Pagefind](https://pagefind.app/).

Когда [`pagefind`](/ru/reference/configuration/#pagefind) отключен, компонент поиска по умолчанию не будет отображаться.
Однако если вы переопределите `Search`, ваш пользовательский компонент будет отображаться всегда, даже если параметр конфигурации `pagefind` будет равен `false`.
Это позволяет добавить пользовательский интерфейс для альтернативных поставщиков поиска при отключении Pagefind.

#### `SocialIcons`

**Стандартный компонент:** [`SocialIcons.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SocialIcons.astro)

Компонент, отображаемый в шапке сайта, включая ссылки на социальные иконки.
Реализация по умолчанию использует опцию [`social`](/ru/reference/configuration/#social) в конфигурации Starlight для отображения иконок и ссылок.

#### `ThemeSelect`

**Стандартный компонент:** [`ThemeSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeSelect.astro)

Компонент, отображаемый в шапке сайта, который позволяет пользователям выбрать желаемую цветовую схему.

#### `LanguageSelect`

**Стандартный компонент:** [`LanguageSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LanguageSelect.astro)

Компонент, отображаемый в заголовке сайта, который позволяет пользователям переключиться на другой язык.

---

### Глобальная боковая панель

В глобальной боковой панели Starlight находится основная навигация сайта.
На узких экранах она скрывается за выпадающим меню.

#### `Sidebar`

**Стандартный компонент:** [`Sidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Sidebar.astro)

Компонент, отображаемый перед содержимым страницы, содержащим глобальную навигацию.
Реализация по умолчанию отображается в виде боковой панели на достаточно широких экранах и в виде выпадающего меню на маленьких (мобильных) экранах.
Он также отображает [`<MobileMenuFooter />`](#mobilemenufooter), чтобы показать дополнительные пункты внутри мобильного меню.

#### `MobileMenuFooter`

**Стандартный компонент:** [`MobileMenuFooter.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuFooter.astro)

Компонент, отображаемый в нижней части мобильного выпадающего меню.
Реализация по умолчанию отображает [`<ThemeSelect />`](#themeselect) и [`<LanguageSelect />`](#languageselect).

---

### Боковая панель страницы

Боковая панель страницы Starlight отвечает за отображение оглавления, в котором указаны подзаголовки текущей страницы.
На узких экранах это сворачивается в липкое выпадающее меню.

#### `PageSidebar`

**Стандартный компонент:** [`PageSidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageSidebar.astro)

Компонент, отображаемый перед содержимым главной страницы для вывода оглавления.
Реализация по умолчанию отображает [`<TableOfContents />`](#tableofcontents) и [`<MobileTableOfContents />`](#mobiletableofcontents).

#### `TableOfContents`

**Стандартный компонент:** [`TableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TableOfContents.astro)

Компонент, который отображает оглавление текущей страницы на широких экранах просмотра.

#### `MobileTableOfContents`

**Стандартный компонент:** [`MobileTableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileTableOfContents.astro)

Компонент, который отображает оглавление текущей страницы на маленьких (мобильных) экранах просмотра.

---

### Контент

Эти компоненты отображаются в основной колонке содержимого страницы.

#### `Banner`

**Стандартный компонент:** [`Banner.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Banner.astro)

Баннерный компонент, отображаемый в верхней части каждой страницы.
Реализация по умолчанию использует значение [`banner`](/ru/reference/frontmatter/#banner) метаданных страницы для принятия решения о необходимости отрисовки.

#### `ContentPanel`

**Стандартный компонент:** [`ContentPanel.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ContentPanel.astro)

Компонент макета, используемый для обёртывания секций колонки основного содержимого.

#### `PageTitle`

**Стандартный компонент:** [`PageTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageTitle.astro)

Компонент, содержащий элемент `<h1>` для текущей страницы.

Реализации должны обеспечить установку `id="_top"` для элемента `<h1>`, как в реализации по умолчанию.

#### `DraftContentNotice`

**Стандартный компонент:** [`DraftContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/DraftContentNotice.astro)

Уведомление, отображаемое пользователям во время разработки, когда текущая страница помечена как черновик.

#### `FallbackContentNotice`

**Стандартный компонент:** [`FallbackContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/FallbackContentNotice.astro)

Уведомление, отображаемое пользователям на страницах, где перевод на текущий язык недоступен.
Используется только на многоязычных сайтах.

#### `Hero`

**Стандартный компонент:** [`Hero.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Hero.astro)

Компонент, отображаемый в верхней части страницы, когда в метаданных задан параметр [`hero`](/ru/reference/frontmatter/#hero).
В стандартном варианте на экране отображается крупный заголовок, теглайн и ссылки, призывающие к действию, а также дополнительное изображение.

#### `MarkdownContent`

**Стандартный компонент:** [`MarkdownContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MarkdownContent.astro)

Компонент отображается вокруг основного содержимого каждой страницы.
Реализация по умолчанию устанавливает базовые стили для применения к содержимому Markdown.

Стили контента Markdown также представлены в `@astrojs/starlight/style/markdown.css` и ограничены классом CSS `.sl-markdown-content`.

---

### Подвал

Эти компоненты отображаются внизу основного столбца содержимого страницы.

#### `Footer`

**Стандартный компонент:** [`Footer.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Footer.astro)

Компонент нижнего колонтитула отображается внизу каждой страницы.
Реализация по умолчанию отображает [`<LastUpdated />`](#lastupdated), [`<Pagination />`](#pagination) и [`<EditLink />`](#editlink).

#### `LastUpdated`

**Стандартный компонент:** [`LastUpdated.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LastUpdated.astro)

Компонент отображается в нижнем колонтитуле страницы для отображения даты последнего обновления.

#### `EditLink`

**Стандартный компонент:** [`EditLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/EditLink.astro)

Компонент, отображаемый в нижнем колонтитуле страницы для отображения ссылки на страницу, где её можно редактировать.

#### `Pagination`

**Стандартный компонент:** [`Pagination.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Pagination.astro)

Компонент отображается в нижнем колонтитуле страницы для отображения стрелок навигации между предыдущими и следующими страницами.
