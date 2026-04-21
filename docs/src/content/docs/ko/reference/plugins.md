---
title: 플러그인 참조
description: Starlight 플러그인 API의 개요입니다.
tableOfContents:
  maxHeadingLevel: 4
---

Starlight 플러그인은 Starlight 구성, UI, 동작을 사용자 정의할 수 있을 뿐만 아니라 공유 및 재사용하기도 쉽습니다.
이 참조 페이지에는 플러그인이 액세스할 수 있는 API가 문서화되어 있습니다.

[구성 참조](/ko/reference/configuration/#plugins)에서 Starlight 플러그인 사용에 대해 자세히 알아보거나 [플러그인 쇼케이스](/ko/resources/plugins/)를 방문하여 사용 가능한 플러그인 목록을 확인하세요.

## 빠른 API 참조

Starlight 플러그인은 다음과 같은 형태를 가지고 있습니다.
다양한 속성과 훅 매개변수에 대한 자세한 내용은 아래를 참조하세요.

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
      addRouteMiddleware: (config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void;
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
<!-- prettier-ignore-end -->

## `name`

**타입:** `string`

플러그인은 자신을 설명하는 고유한 이름을 제공해야 합니다. 이름은 이 플러그인과 관련된 [메시지를 로깅](#logger)할 때 사용되며 다른 플러그인에서 이 플러그인의 존재를 감지하는 데 사용될 수도 있습니다.

## `hooks`

훅은 Starlight가 특정 시간에 플러그인 코드를 실행하기 위해 호출하는 함수입니다.

훅의 인자 타입을 얻으려면 `HookParameters` 유틸리티 타입을 사용하고 훅 이름을 전달하세요.
다음 예제에서 `options` 매개변수는 `config:setup` 훅에 전달된 인자와 일치하도록 타입이 지정됩니다.

```ts
import type { HookParameters } from '@astrojs/starlight/types';

function configSetup(options: HookParameters['config:setup']) {
  options.useTranslations('ko');
}
```

### `i18n:setup`

Starlight가 초기화될 때 호출되는 플러그인 국제화 설정 함수입니다.
`i18n:setup` 훅을 사용하여 번역 문자열을 삽입할 수 있으므로 플러그인이 다른 로케일을 지원할 수 있습니다.
이러한 번역은 `config:setup` 훅에서 [`useTranslations()`](#usetranslations)를 통해, UI 컴포넌트에서 [`Astro.locals.t()`](/ko/guides/i18n/#ui-번역-사용)를 통해 사용할 수 있습니다.

`i18n:setup` 훅은 다음 옵션과 함께 호출됩니다:

#### `injectTranslations`

**타입:** `(translations: Record<string, Record<string, string>>) => void`

Starlight의 [지역화 API](/ko/guides/i18n/#ui-번역-사용)에서 사용되는 번역 문자열을 추가하거나 업데이트하는 콜백 함수입니다.

다음 예제에서 플러그인은 `en` 및 `fr` 로케일에 대해 `myPlugin.doThing`이라는 사용자 지정 UI 문자열에 대한 번역을 삽입합니다.

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
        fr: {
          'myPlugin.doThing': 'Faire le truc',
        },
      });
    },
  },
};
```

플러그인 UI에서 삽입된 번역을 사용하려면 ["UI 번역 사용" 가이드](/ko/guides/i18n/#ui-번역-사용)를 따르세요.
플러그인의 [`config:setup`](#configsetup) 훅의 컨텍스트에서 UI 문자열을 사용해야 하는 경우, [`useTranslations()`](#usetranslations) 콜백을 사용할 수 있습니다.

플러그인에 삽입된 번역 문자열의 타입은 사용자 프로젝트에서 자동으로 생성되지만, 플러그인 코드베이스에서 작업할 때는 아직 사용할 수 없습니다.
플러그인의 컨텍스트에서 `locals.t` 객체의 타입을 지정하려면 TypeScript 선언 파일에서 다음 전역 네임스페이스를 선언하세요:

```ts
// env.d.ts
declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  // 플러그인 컨텍스트에서 `locals.t` 객체를 정의합니다.
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  // `I18n` 인터페이스에서 추가 플러그인 번역을 정의합니다.
  interface I18n {
    'myPlugin.doThing': string;
  }
}
```

번역이 포함된 객체가 있는 경우 소스 파일에서 `StarlightApp.I18n` 인터페이스의 타입을 추론할 수도 있습니다.

예를 들어, 다음 소스 파일이 주어졌을 때:

```ts title="ui-strings.ts"
export const UIStrings = {
  en: { 'myPlugin.doThing': 'Do the thing' },
  fr: { 'myPlugin.doThing': 'Faire le truc' },
};
```

다음 선언은 소스 파일의 영어 키에서 타입을 추론합니다:

```ts title="env.d.ts"
declare namespace StarlightApp {
  type UIStrings = typeof import('./ui-strings').UIStrings.en;
  interface I18n extends UIStrings {}
}
```

### `config:setup`

Starlight가 초기화될 때 호출되는 플러그인 구성 설정 함수입니다 ([`astro:config:setup`](https://docs.astro.build/ko/reference/integrations-reference/#astroconfigsetup) 통합 훅 실행 중 호출).
`config:setup` 훅을 사용하여 Starlight 구성을 업데이트하거나 Astro 통합을 추가할 수 있습니다.

이 훅은 다음 옵션들과 함께 호출됩니다.

#### `config`

**타입:** `StarlightUserConfig`

사용자 제공 [Starlight 구성](/ko/reference/configuration/)의 읽기 전용 복사본입니다.
이 구성은 현재 플러그인 이전에 구성된 다른 플러그인에 의해 업데이트되었을 수 있습니다.

#### `updateConfig`

**타입:** `(newConfig: StarlightUserConfig) => void`

사용자가 제공한 [Starlight 구성](/ko/reference/configuration/)을 업데이트하는 콜백 함수입니다.
재정의하려는 루트 수준 구성 키를 제공합니다.
중첩된 구성 값을 업데이트하려면 전체 중첩 객체를 제공해야 합니다.

기존 구성 옵션을 재정의하지 않고 확장하려면 기존 값을 새 값에 전개하여 확장하세요.
다음 예시에서는 `config.social`에 전개 연산자를 사용하여 새로운 `social` 배열을 확장합니다. 이를 통해, 새로운 [`social`](/ko/reference/configuration/#social) 미디어 계정을 기존 구성에 추가합니다.

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

**타입:** `(integration: AstroIntegration) => void`

플러그인에 필요한 [Astro 통합](https://docs.astro.build/ko/reference/integrations-reference/)을 추가하기 위한 콜백 함수입니다.

다음 예시에서 플러그인은 먼저 [Astro의 React 통합](https://docs.astro.build/ko/guides/integrations-guide/react/)이 구성되어 있는지 확인하고, 구성되어 있지 않으면 `addIntegration()`을 사용하여 이를 추가합니다.

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

      // 아직 불러오지 않은 경우에만 React 통합을 추가합니다.
      if (!isReactLoaded) {
        addIntegration(react());
      }
    },
  },
};
```

#### `addRouteMiddleware`

**타입:** `(config: { entrypoint: string; order?: 'pre' | 'post' | 'default' }) => void`

사이트에 [경로 미들웨어 핸들러](/ko/guides/route-data/)를 추가하는 콜백 함수입니다.

`entrypoint` 속성은 `onRequest` 핸들러를 내보내는 플러그인 미들웨어 파일의 모듈 지정자여야 합니다.

다음 예제에서 `@example/starlight-plugin`으로 게시된 플러그인은 npm 모듈 지정자를 사용하여 경로 미들웨어를 추가합니다.

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

##### 실행 순서 제어

기본적으로 플러그인 미들웨어는 플러그인이 추가된 순서대로 실행됩니다.

미들웨어가 언제 실행되는지 더 세밀하게 제어해야 하는 경우 선택적 `order` 속성을 사용하세요.
사용자 미들웨어보다 먼저 실행하려면 `order: "pre"`를 설정하세요.
다른 모든 미들웨어 후에 실행하려면 `order: "post"`를 설정하세요.

두 플러그인이 동일한 `order` 값으로 미들웨어를 추가하는 경우 먼저 추가된 플러그인이 먼저 실행됩니다.

#### `astroConfig`

**타입:** `AstroConfig`

사용자 제공 [Astro 구성](https://docs.astro.build/ko/reference/configuration-reference/)의 읽기 전용 복사본입니다.

#### `command`

**타입:** `'dev' | 'build' | 'preview'`

Starlight를 실행하는 데 사용되는 명령:

- `dev` - 프로젝트는 `astro dev`로 실행
- `build` - 프로젝트는 `astro build`로 실행
- `preview` - 프로젝트는 `astro preview`로 실행

#### `isRestart`

**타입:** `boolean`

개발 서버가 시작되면 `false`, 서버가 다시 시작되면 `true`입니다.
개발 서버 재시작의 일반적인 이유에는 개발 서버가 실행되는 동안 사용자가 `astro.config.mjs`를 편집하는 경우가 포함됩니다.

#### `logger`

**타입:** `AstroIntegrationLogger`

로그를 작성하는 데 사용할 수 있는 [Astro 통합 로거](https://docs.astro.build/ko/reference/integrations-reference/#astrointegrationlogger)의 인스턴스입니다.
기록된 모든 메시지에는 플러그인 이름이 앞에 추가됩니다.

```ts {6}
// plugin.ts
export default {
  name: 'long-process-plugin',
  hooks: {
    'config:setup'({ logger }) {
      logger.info('시간이 오래 걸리는 작업 진행 중…');
      // 오래 걸리는 작업…
    },
  },
};
```

위 예시에서는 제공된 정보를 포함하는 메시지를 기록합니다.

```shell
[long-process-plugin] 시간이 오래 걸리는 작업 진행 중…
```

#### `useTranslations`

**타입:** `(lang: string) => I18nT`

BCP-47 언어 태그와 함께 `useTranslations()`를 호출하여 해당 언어의 UI 문자열에 접근할 수 있는 유틸리티 함수를 생성합니다.
`useTranslations()`는 Astro 컴포넌트에서 사용 가능한 `Astro.locals.t()` API와 동일한 기능을 반환합니다.
사용 가능한 API에 대한 자세한 내용은 ["UI 번역 사용"](/ko/guides/i18n/#ui-번역-사용) 가이드를 참조하세요.

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

위의 예제는 중국어 간체에 대한 내장 UI 문자열을 포함하는 메시지를 기록합니다.

```shell
[plugin-use-translations] 基于 Starlight 构建
```

#### `absolutePathToLang`

**타입:** `(path: string) => string`

절대 파일 경로와 함께 `absolutePathToLang()`을 호출하여 해당 파일의 언어를 가져옵니다.

이는 Markdown 또는 MDX 파일을 처리하기 위해 [remark 또는 rehype 플러그인](https://docs.astro.build/ko/guides/markdown-content/#markdown-플러그인)을 추가할 때 특히 유용할 수 있습니다.
이러한 플러그인에서 사용하는 [가상 파일 형식](https://github.com/vfile/vfile)에는 처리 중인 파일의 [절대 경로](https://github.com/vfile/vfile#filepath)가 포함되어 있으며, 이는 `absolutePathToLang()`과 함께 사용하여 파일의 언어를 확인할 수 있습니다.
반환된 언어는 해당 언어에 대한 UI 문자열을 가져오기 위해 [`useTranslations()`](#usetranslations) 도우미와 함께 사용할 수 있습니다.

예를 들어, 다음 Starlight 구성이 주어졌을 때:

```js
starlight({
  title: 'My Docs',
  defaultLocale: 'en',
  locales: {
    // `src/content/docs/en/`에서 영어 문서
    en: { label: 'English' },
    // `src/content/docs/fr/`에서 프랑스어 문서
    fr: { label: 'Français', lang: 'fr' },
  },
});
```

플러그인은 절대 경로를 사용하여 파일의 언어를 확인할 수 있습니다.

```ts {6-8} /fr/
// plugin.ts
export default {
  name: 'plugin-use-translations',
  hooks: {
    'config:setup'({ absolutePathToLang, useTranslations, logger }) {
      const lang = absolutePathToLang(
        '/absolute/path/to/project/src/content/docs/fr/index.mdx'
      );
      const t = useTranslations(lang);
      logger.info(t('aside.tip'));
    },
  },
};
```

위의 예제는 프랑스어에 대한 내장 UI 문자열을 포함하는 메시지를 기록합니다.

```shell
[plugin-use-translations] Astuce
```
