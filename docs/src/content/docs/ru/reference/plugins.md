---
title: Плагины
description: Обзор API плагинов Starlight.
tableOfContents:
  maxHeadingLevel: 4
---

Плагины Starlight могут настраивать конфигурацию, пользовательский интерфейс и поведение Starlight, а также легко распространяться и использоваться повторно.
На этой справочной странице описаны API, к которым имеют доступ плагины.

Подробнее об использовании плагинов Starlight можно узнать в разделе [Конфигурация](/ru/reference/configuration/#plugins) или на [Витрине плагинов](/ru/resources/plugins/#плагины), чтобы посмотреть список доступных плагинов.

## Краткая справка по API

Плагин Starlight имеет следующую форму.
Подробнее о различных свойствах и параметрах хуков см. ниже.

<!-- prettier-ignore-start -->

```ts
interface StarlightPlugin {
  name: string;
  hooks: {
    'i18n:setup'?: (options: {
      injectTranslations: (
        translations: Record<string, Record<string, string>>
      ) => void;
    }) => void | Promise<void>;
    'config:setup': (options: {
      config: StarlightUserConfig;
      updateConfig: (newConfig: StarlightUserConfig) => void;
      addIntegration: (integration: AstroIntegration) => void;
      addRouteMiddleware: (config: {
        entrypoint: string;
        order?: 'pre' | 'post' | 'default';
      }) => void;
      astroConfig: AstroConfig;
      command: 'dev' | 'build' | 'preview';
      isRestart: boolean;
      logger: AstroIntegrationLogger;
      useTranslations: (lang: string) => I18nT;
      absolutePathToLang: (path: string) => string;
    }) => void | Promise<void>;
  };
}
```

<!-- prettier-ignore-start -->

## `name`

**тип:** `string`

Плагин должен иметь уникальное имя, описывающее его. Имя используется при [регистрации сообщений](#logger), связанных с этим плагином, и может использоваться другими плагинами для определения присутствия этого плагина.

## `hooks`

Хуки — это функции, которые Starlight вызывает для запуска кода плагина в определённое время.

Чтобы получить тип аргументов хука, используйте утилиту `HookParameters` и передайте в неё имя хука.
В следующем примере параметр `options` типизирован таким образом, чтобы соответствовать аргументам, передаваемым в хук `config:setup`:

```ts
import type { HookParameters } from '@astrojs/starlight/types';

function configSetup(options: HookParameters['config:setup']) {
  options.useTranslations('ru');
}
```

### `i18n:setup`

Функция настройки интернационализации плагина, вызываемая при инициализации Starlight.
Хук `i18n:setup` можно использовать для добавления строк перевода, чтобы плагин поддерживал разные локали.
Эти переводы будут доступны через [`useTranslations()`](#usetranslations) в хуке `config:setup` и в UI-компонентах через [`Astro.locals.t()`](/ru/guides/i18n/#использование-ui-переводов).

Хук `i18n:setup` вызывается со следующими параметрами:

#### `injectTranslations`

**тип:** `(translations: Record<string, Record<string, string>>) => void`

Функция обратного вызова для добавления или обновления строк перевода, используемых в [API локализации](/ru/guides/i18n/#использование-ui-переводов) Starlight.

В следующем примере плагин добавляет переводы для пользовательской строки интерфейса `myPlugin.doThing` для локалей `en` и `ru`:

```ts {6-13} /(injectTranslations)[^(]/
// plugin.ts
export default {
  name: 'plugin-with-translations',
  hooks: {
    'i18n:setup'({ injectTranslations }) {
      injectTranslations({
        en: {
          'myPlugin.doThing': 'Do the thing',
        },
        ru: {
          'myPlugin.doThing': 'Делаем что-то',
        },
      });
    },
  },
};
```

Чтобы использовать добавленные переводы в интерфейсе вашего плагина, следуйте [руководству по использованию UI-переводов](/ru/guides/i18n/#использование-ui-переводов).
Если вам нужно использовать строки интерфейса в контексте хука [`config:setup`](#configsetup) вашего плагина, примените функцию [`useTranslations()`](#usetranslations).

Типы для строк перевода, добавленных плагином, автоматически генерируются в проекте пользователя, но пока недоступны при работе с кодовой базой самого плагина.
Чтобы задать тип объекта `locals.t` в контексте вашего плагина, объявите следующие глобальные пространства имён в файле деклараций TypeScript:

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // Определяем объект `locals.t` в контексте плагина.
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // Определяем дополнительные переводы плагина в интерфейсе `I18n`.
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

Вы также можете вывести типы для интерфейса `StarlightApp.I18n` из исходного файла, если у вас есть объект, содержащий ваши переводы.

Например, для следующего исходного файла:

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  ru: { 'myPlugin.doThing': 'Делаем что-то' },
};
```

Следующее объявление будет выводить типы на основе английских ключей в исходном файле:

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```

### `config:setup`

Функция настройки конфигурации плагина, вызываемая при инициализации Starlight (во время выполнения хука интеграции [`astro:config:setup`](https://docs.astro.build/ru/reference/integrations-reference/#astroconfigsetup)).
Хук `config:setup` можно использовать для обновления конфигурации Starlight или добавления интеграций Astro.

Этот хук вызывается со следующими параметрами:

#### `config`

**тип:** `StarlightUserConfig`

Доступная только для чтения копия предоставленной пользователем [конфигурации Starlight](/ru/reference/configuration/).
Эта конфигурация могла быть обновлена другими плагинами, настроенными до текущего.

#### `updateConfig`

**тип:** `(newConfig: StarlightUserConfig) => void`

Функция обратного вызова для обновления предоставленной пользователем [конфигурации Starlight](/ru/reference/configuration/).
Укажите ключи конфигурации корневого уровня, которые вы хотите отменить.
Чтобы обновить значения вложенной конфигурации, необходимо предоставить весь вложенный объект.

Чтобы расширить существующий параметр конфигурации, не переопределяя его, добавьте существующее значение в новое.
В следующем примере новый аккаунт в [`social`](/ru/reference/configuration/#social) добавляется в существующую конфигурацию путем расширения `config.social` в новом массиве `social`:

```ts {6-15}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
  hooks: {
    'config:setup'({ config, updateConfig }) {
      updateConfig({
        social: [
          ...config.social,
          {
            icon: 'twitter',
            label: 'Twitter',
            href: 'https://twitter.com/astrodotbuild',
          },
        ],
      });
    },
  },
};
```

#### `addIntegration`

**тип:** `(integration: AstroIntegration) => void`

Функция обратного вызова для добавления [интеграции Astro](https://docs.astro.build/ru/reference/integrations-reference/), необходимой плагину.

В следующем примере плагин сначала проверяет, настроена ли [интеграция Astro с React](https://docs.astro.build/ru/guides/integrations-guide/react/), и, если нет, использует `addIntegration()` для её добавления:

```ts {14} "addIntegration,"
// plugin.ts
import react from '@astrojs/react';

export default {
  name: 'plugin-using-react',
  hooks: {
    'config:setup'({ addIntegration, astroConfig }) {
      const isReactLoaded = astroConfig.integrations.find(
        ({ name }) => name === '@astrojs/react'
      );

      // Добавляем интеграцию React только в том случае, если она ещё не загружена.
      if (!isReactLoaded) {
        addIntegration(react());
      }
    },
  },
};
```

#### `addRouteMiddleware`

**тип:** `(config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void`

Функция обратного вызова для добавления [мидлвара-обработчика маршрутов](/ru/guides/route-data/) на сайт.

Свойство `entrypoint` должно быть указателем модуля для файла мидлвара вашего плагина, который экспортирует обработчик `onRequest`.

В следующем примере плагин, опубликованный как `@example/starlight-plugin`, добавляет мидлвар маршрутов, используя указатель модуля npm:

```js {6-9}
// plugin.ts
export default {
  name: '@example/starlight-plugin',
  hooks: {
    'config:setup'({ addRouteMiddleware }) {
      addRouteMiddleware({
        entrypoint: '@example/starlight-plugin/route-middleware',
      });
    },
  },
};
```

##### Контроль порядка выполнения

По умолчанию мидлвары плагинов выполняются в порядке их добавления.

Если вам нужно больше контроля над порядком выполнения, используйте необязательное свойство `order`.
Установите `order: "pre"`, чтобы мидлвар выполнялся перед пользовательскими мидлварами.
Установите `order: "post"`, чтобы мидлвар выполнялся после всех остальных мидлваров.

Если два плагина добавляют мидлвары с одинаковым значением `order`, первым выполнится плагин, добавленный первым.

#### `astroConfig`

**тип:** `AstroConfig`

Доступная только для чтения копия предоставленной пользователем [конфигурации Astro](https://docs.astro.build/ru/reference/configuration-reference/).

#### `command`

**тип:** `'dev' | 'build' | 'preview'`

Команда, используемая для запуска Starlight:

- `dev` — Проект выполняется с помощью `astro dev`.
- `build` — Проект выполняется с помощью `astro build`.
- `preview` — Проект выполняется с `astro preview`.

#### `isRestart`

**тип:** `boolean`

`false` при запуске dev-сервера, `true` при перезагрузке.
Частыми причинами перезапуска являются редактирование пользователем файла `astro.config.mjs` во время работы dev-сервера.

#### `logger`

**тип:** `AstroIntegrationLogger`

Экземпляр [логгера интеграции Astro](https://docs.astro.build/ru/reference/integrations-reference/#astrointegrationlogger), который можно использовать для записи журналов.
Все сообщения в журнале будут иметь префикс с названием плагина.

```ts {6}
// plugin.ts
export default {
  name: 'long-process-plugin',
  hooks: {
    'config:setup'({ logger }) {
      logger.info('Начало длительного процесса…');
      // Долгий процесс...
    },
  },
};
```

В приведённом выше примере в журнал будет выведено сообщение, включающее в себя предоставленное информационное сообщение:

```shell
[long-process-plugin] Начало длительного процесса...
```

#### `useTranslations`

**тип:** `(lang: string) => I18nT`

Вызовите `useTranslations()` с тегом языка BCP-47, чтобы сгенерировать утилиту для доступа к строкам интерфейса для этого языка.
`useTranslations()` возвращает аналог API `Astro.locals.t()`, который доступен в компонентах Astro.
Чтобы узнать больше о доступных API, ознакомьтесь с руководством [«Использование UI-переводов»](/ru/guides/i18n/#использование-ui-переводов).

```ts {6}
// plugin.ts
export default {
  name: 'plugin-use-translations',
  hooks: {
    'config:setup'({ useTranslations, logger }) {
      const t = useTranslations('zh-CN');
      logger.info(t('builtWithStarlight.label'));
    },
  },
};
```

Пример выше выведет сообщение, которое включает встроенную строку интерфейса для упрощённого китайского языка:

```shell
[plugin-use-translations] 基于 Starlight 构建
```

#### `absolutePathToLang`

**тип:** `(path: string) => string`

Вызовите `absolutePathToLang()` с абсолютным путём к файлу, чтобы получить язык для этого файла.

Это может быть особенно полезно при добавлении [плагинов remark или rehype](https://docs.astro.build/ru/guides/markdown-content/#%D0%BF%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD%D1%8B-markdown) для обработки файлов Markdown или MDX.
Виртуальный формат файлов, используемый этими плагинами, включает [абсолютный путь](https://github.com/vfile/vfile#filepath) обрабатываемого файла, который можно использовать с `absolutePathToLang()`, чтобы определить язык файла.
Возвращаемый язык можно использовать с хелпером [`useTranslations()`](#usetranslations) для получения строк интерфейса для этого языка.

Например, с учётом следующей конфигурации Starlight:

```js
starlight({
  title: 'Моя документация',
  defaultLocale: 'en',
  locales: {
    // Англоязычная документация в `src/content/docs/en/`
    en: { label: 'English' },
    // Русскоязычная документация в `src/content/docs/ru/`
    ru: { label: 'Русский', lang: 'ru' },
  },
});
```

Плагин может определить язык файла, используя его абсолютный путь:

```ts {6-8} /ru/
// plugin.ts
export default {
  name: 'plugin-use-translations',
  hooks: {
    'config:setup'({ absolutePathToLang, useTranslations, logger }) {
      const lang = absolutePathToLang(
        '/absolute/path/to/project/src/content/docs/ru/index.mdx'
      );
      const t = useTranslations(lang);
      logger.info(t('aside.tip'));
    },
  },
};
```

Пример выше выведет сообщение, которое включает встроенную строку интерфейса для русского языка:

```shell
[plugin-use-translations] Совет
```
