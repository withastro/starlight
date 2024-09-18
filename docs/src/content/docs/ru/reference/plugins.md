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

```ts
interface StarlightPlugin {
  name: string;
  hooks: {
    setup: (options: {
      config: StarlightUserConfig;
      updateConfig: (newConfig: StarlightUserConfig) => void;
      addIntegration: (integration: AstroIntegration) => void;
      astroConfig: AstroConfig;
      command: 'dev' | 'build' | 'preview';
      isRestart: boolean;
      logger: AstroIntegrationLogger;
      injectTranslations: (Record<string, Record<string, string>>) => void;
    }) => void | Promise<void>;
  };
}
```

## `name`

**тип:** `string`

Плагин должен иметь уникальное имя, описывающее его. Имя используется при [регистрации сообщений](#logger), связанных с этим плагином, и может использоваться другими плагинами для определения присутствия этого плагина.

## `hooks`

Хуки — это функции, которые Starlight вызывает для запуска кода плагина в определённое время. В настоящее время Starlight поддерживает единственный хук `setup`.

### `hooks.setup`

Функция настройки плагина, вызываемая при инициализации Starlight (во время выполнения хука интеграции [`astro:config:setup`](https://docs.astro.build/ru/reference/integrations-reference/#astroconfigsetup)).
Хук `setup` можно использовать для обновления конфигурации Starlight или добавления интеграций Astro.

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
В следующем примере к существующей конфигурации добавляется новый медиааккаунт [`social`](/ru/reference/configuration/#social) путём распространения `config.social` на новый объект `social`:

```ts {6-11}
// plugin.ts
export default {
  name: 'add-twitter-plugin',
  hooks: {
    setup({ config, updateConfig }) {
      updateConfig({
        social: {
          ...config.social,
          twitter: 'https://twitter.com/astrodotbuild',
        },
      });
    },
  },
};
```

#### `addIntegration`

**тип:** `(integration: AstroIntegration) => void`

Функция обратного вызова для добавления [Astro integration](https://docs.astro.build/ru/reference/integrations-reference/), необходимой плагину.

В следующем примере плагин сначала проверяет, настроена ли [интеграция Astro с React](https://docs.astro.build/ru/guides/integrations-guide/react/), и, если нет, использует `addIntegration()` для её добавления:

```ts {14} "addIntegration,"
// plugin.ts
import react from '@astrojs/react';

export default {
  name: 'plugin-using-react',
  hooks: {
    setup({ addIntegration, astroConfig }) {
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
    setup({ logger }) {
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

#### `injectTranslations`

**тип:** `(translations: Record<string, Record<string, string>>) => void`

Функция обратного вызова для добавления или обновления строк перевода, используемых в [API локализации](/ru/guides/i18n/#использование-переводов-пользовательского-интерфейса) Starlight.

В следующем примере плагин инжектирует переводы для пользовательской строки пользовательского интерфейса с именем `myPlugin.doThing` для локалей `en` и `ru`:

```ts {6-13} /(injectTranslations)[^(]/
// plugin.ts
export default {
  name: 'plugin-with-translations',
  hooks: {
    setup({ injectTranslations }) {
      injectTranslations({
        en: {
          'myPlugin.doThing': 'Do the thing',
        },
        ru: {
          'myPlugin.doThing': 'Делай дело',
        },
      });
    },
  },
};
```

Чтобы использовать инжектированные переводы в пользовательском интерфейсе плагина, следуйте руководству [Использование переводов пользовательского интерфейса](/ru/guides/i18n/#использование-переводов-пользовательского-интерфейса).

Типы для инжектируемых строк перевода плагина генерируются автоматически в проекте пользователя, но ещё не доступны при работе с кодовой базой вашего плагина.
Чтобы ввести объект `locals.t` в контексте вашего плагина, объявите следующие глобальные пространства имён в файле декларации TypeScript:

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // Определяем объект `locals.t` в контексте плагина.
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // Определяем дополнительные переводы плагинов в интерфейсе `I18n`.
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

Вы также можете определить типы интерфейса `StarlightApp.I18n` из исходного файла, если у вас есть объект, содержащий ваши переводы.

Например, учитывая следующий исходный файл:

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  ru: { 'myPlugin.doThing': 'Делай дело' },
};
```

Следующее объявление будет определять типы по английским ключам в исходном файле:

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```
