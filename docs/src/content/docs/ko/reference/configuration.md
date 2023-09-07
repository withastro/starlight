---
title: 구성 참조
description: Starlight가 지원하는 모든 구성 옵션에 대한 개요입니다.
---

## `starlight` 통합 구성

Starlight는 [Astro](https://astro.build) 웹 프레임워크 위에 구축된 통합입니다. `astro.config.mjs` 구성 파일에서 프로젝트를 구성할 수 있습니다.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '즐거운 문서 사이트',
    }),
  ],
});
```

`starlight` 통합에 다음 옵션을 전달할 수 있습니다.

### `title` (필수)

**타입:** `string`

웹사이트의 제목을 설정합니다. 메타데이터 및 브라우저 탭 제목에 사용됩니다.

### `description`

**타입:** `string`

웹사이트에 대한 설명을 설정합니다. 페이지의 frontmatter에 `description`이 설정되지 않은 경우, `<meta name="description">` 태그에서 검색 엔진과 공유되는 메타데이터로 사용됩니다.

### `logo`

**타입:** [`LogoConfig`](#logoconfig)

사이트 제목을 대체하거나 사이트 제목과 함께 네비게이션 바에 표시되는 로고 이미지를 설정합니다. 단일 `src` 속성을 설정하거나 `light` 및 `dark` 속성에 다른 이미지 소스를 전달할 수 있습니다.

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

**타입:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`  
**기본값:** `{ minHeadingLevel: 2; maxHeadingLevel: 3; }`

각 페이지 오른쪽에 표시되는 목차를 구성합니다. 기본적으로 `<h2>` 및 `<h3>` 제목이 이 목차에 포함됩니다.

### `editLink`

**타입:** `{ baseUrl: string }`

기본 URL을 설정하여 "페이지 편집" 링크를 활성화합니다. 최종 링크는 `editLink.baseUrl` + 현재 페이지 경로가 됩니다. 예를 들어, 다음 코드를 통해 GitHub의 `withastro/starlight` 저장소의 페이지 편집 기능을 활성화할 수 있습니다.

```js
starlight({
  editLink: {
    baseUrl: 'https://github.com/withastro/starlight/edit/main/',
  },
});
```

이 구성을 통해 `/introduction` 페이지에 있는 편집 링크는 `https://github.com/withastro/starlight/edit/main/src/docs/introduction.md`를 가리킵니다.

### `sidebar`

**타입:** [`SidebarItem[]`](#sidebaritem)

사이트의 사이드바 탐색 항목을 구성합니다.

사이드바는 링크의 배열과 링크 그룹입니다. 각 항목은 `label`과 함께 다음 속성 중 하나를 반드시 포함해야합니다.

- `link` — 특정 URL에 대한 단일 링크(예: `'/home'` 또는 `'https://example.com'`).

- `items` — 더 많은 사이드바 링크와 하위 그룹을 포함하는 배열

- `autogenerate` — 링크 그룹을 자동으로 생성하기 위해 문서의 디렉토리를 지정하는 객체

```js
starlight({
  sidebar: [
    // '홈'이라는 라벨이 붙은 단일 링크 항목
    { label: '홈', link: '/' },
    // 두 개의 링크가 포함된 '여기서부터' 라는 라벨이 붙은 그룹
    {
      label: '여기서부터',
      items: [
        { label: '소개', link: '/intro' },
        { label: '다음 단계', link: '/next-steps' },
      ],
    },
    // 'reference' 디렉토리의 모든 페이지에 연결되는 그룹
    {
      label: '참조',
      autogenerate: { directory: 'reference' },
    },
  ],
});
```

#### 정렬

자동 생성된 사이드바 그룹은 파일 이름을 기준으로 알파벳순으로 정렬됩니다. 예를 들어 `astro.md`에서 생성된 페이지는 `starlight.md` 페이지 위에 표시됩니다.

#### 그룹 최소화

링크 그룹은 기본적으로 펼쳐져 있습니다. 그룹의 `collapsed` 속성을 `true`로 설정하여 이 동작을 변경할 수 있습니다.

자동 생성된 하위 그룹은 기본적으로 상위 그룹의 `collapsed` 속성을 따릅니다. 이를 변경하려면 `autogenerate.collapsed` 속성을 설정하세요.

```js
sidebar: [
  // 최소화된 링크 그룹
  {
    label: '최소화된 링크 모음',
    collapsed: true,
    items: [
      { label: '소개', link: '/intro' },
      { label: '다음 단계', link: '/next-steps' },
    ],
  },
  // 최소화된 자동 생성 하위 그룹을 포함하는 펼쳐진 그룹
  {
    label: '참조',
    autogenerate: {
      directory: 'reference',
      collapsed: true,
    },
  },
],
```

#### 라벨 번역

다국어 사이트의 경우, 각 항목의 `label`은 기본 언어로 설정됩니다. `translations` 속성을 설정하여 지원하는 다른 언어로 된 라벨을 제공할 수 있습니다.

```js
sidebar: [
  // 한국어로 번역된 라벨을 사용하는 사이드바 예시
  {
    label: 'Start Here',
    translations: { ko: '여기서부터' },
    items: [
      {
        label: 'Getting Started',
        translations: { ko: '시작하기' },
        link: '/getting-started',
      },
      {
        label: 'Project Structure',
        translations: { ko: '프로젝트 구조' },
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
  | { link: string; badge?: string | BadgeConfig }
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

**타입:** <code>{ \[dir: string\]: [LocaleConfig](#localeconfig) }</code>

지원되는 `locales`를 설정하여 사이트의 [국제화(i18n)를 구성](/ko/guides/i18n/)하세요.

각 항목은 언어 파일이 저장된 디렉토리를 키로 사용해야 합니다.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '나의 사이트',
      // 이 사이트의 기본 언어를 한국어로 설정합니다.
      defaultLocale: 'ko',
      locales: {
        // 한국어 문서는 `src/content/docs/ko/`에 있습니다.
        ko: {
          label: '한국어',
        },
        // 영어 문서는 `src/content/docs/en/`에 있습니다.
        en: {
          label: 'English',
          lang: 'en',
        },
        // 중국어 간체 문서는 `src/content/docs/zh/`에 있습니다.
        zh: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        // 아랍어 문서는 `src/content/docs/ar/`에 있습니다.
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

각 언어에 대해 다음 옵션을 설정할 수 있습니다.

##### `label` (필수)

**타입:** `string`

언어의 라벨은 언어 변경 기능에서 사용자에게 보여지는 문자입니다. 대부분의 경우, `"English"`, `"العربية"`, 또는 `"简体中文"`와 같이 해당 언어를 사용하는 사용자가 읽을 것으로 예상되는 언어의 이름을 작성하는 것이 좋습니다.

##### `lang`

**타입:** `string`

`"en"`, `"ar"` 또는 `"zh-CN"`와 같은 언어의 BCP-47 태그입니다. 설정하지 않으면 기본적으로 해당 언어의 디렉토리 이름이 사용됩니다. 지역 하위 태그가 있는 언어 태그(예: `"pt-BR"` 또는 `"en-US"`)는 지역별 번역이 없는 경우에 내장된 기본 언어 UI 번역을 사용합니다.

##### `dir`

**타입:** `'ltr' | 'rtl'`

언어의 쓰기 방향입니다. `"ltr"`은 왼쪽에서 오른쪽으로 진행함을 나타내며 기본값입니다. `"rtl"`은 오른쪽에서 왼쪽으로 진행함을 나타냅니다.

#### 루트 로케일

`root` 로케일을 설정하면 `/lang/` 디렉토리 없이 기본 언어를 제공할 수 있습니다.

```js
starlight({
  locales: {
    root: {
      label: '한국어',
      lang: 'ko',
    },
    fr: {
      label: 'Français',
    },
  },
});
```

예를 들어, `/getting-started/`를 한국어 경로로 제공하고, `/fr/getting-started/`를 동일한 페이지의 프랑스어 버전으로 제공할 수 있습니다.

### `defaultLocale`

**타입:** `string`

사이트의 기본 언어를 설정합니다.
값은 [`locales`](#locales) 객체의 키 중 하나와 일치해야 합니다.
(기본 언어가 [루트 로케일](#루트-로케일)인 경우 이 단계를 건너뛸 수 있습니다.)

이 값은 번역이 누락된 대체 콘텐츠를 제공하는 데 사용됩니다.

### `social`

**타입:** `Partial<Record<'bitbucket' | 'codeberg' | 'codePen' | 'discord' | 'github' | 'gitlab' | 'gitter' | 'instagram' | 'linkedin' | 'mastodon' | 'microsoftTeams' | 'stackOverflow' | 'threads' | 'twitch' | 'twitter' | 'youtube', string>>`

이 사이트의 소셜 미디어 계정에 대한 선택적 세부 정보입니다. 이 중 하나를 추가하면 사이트 헤더에 아이콘 링크로 표시됩니다.

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

**타입:** `string[]`

Starlight 사이트의 모양과 느낌을 변경하려면 CSS 파일을 제공하세요.

`'./src/custom.css'`와 같은 프로젝트 루트에서 상대 경로로 지정한 로컬 CSS 파일 및 `'@fontsource/roboto'`와 같은 npm 모듈로 설치한 CSS를 지원합니다.

```js
starlight({
  customCss: ['./src/custom-styles.css', '@fontsource/roboto'],
});
```

### `head`

**타입:** [`HeadConfig[]`](#headconfig)

Starlight 사이트의 `<head>`에 사용자 정의 태그를 추가합니다. 분석 및 기타 서드파티 스크립트와 리소스를 추가하는 데 유용할 수 있습니다.

```js
starlight({
  head: [
    // Fathom 분석 스크립트 태그를 추가하는 예시
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

**타입:** `boolean`  
**기본값:** `false`

페이지 하단에 최종 업데이트 날짜를 표시할지 여부를 제어합니다.

기본적으로 이 기능은 저장소의 Git 기록에 의존하며 [얕은 복제](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---depthltdepthgt)를 수행하는 일부 배포 플랫폼에서는 정확하지 않을 수 있습니다. 페이지는 [`lastUpdated` frontmatter 필드](/ko/reference/frontmatter/#lastupdated)를 사용하여 이 설정이나 Git 기반 날짜를 변경할 수 있습니다.

### `pagination`

**타입:** `boolean`  
**기본값:** `true`

페이지 하단에 이전 페이지 링크와 다음 페이지 링크가 포함되어야 하는지 정의합니다.

페이지는 [`prev`](/ko/reference/frontmatter/#prev)와 [`next`](/ko/reference/frontmatter/#next) frontmatter 필드를 통해 이 설정이나 링크 텍스트, URL을 변경할 수 있습니다.

### `favicon`

**타입:** `string`  
**기본값:** `'/favicon.svg'`

`public/` 디렉토리에 포함되어 있으며 유효한 아이콘 파일인 (`.ico`, `.gif`, `.jpg`, `.png`, 또는 `.svg`) 웹 사이트의 기본 파비콘 경로를 설정합니다.

```js
starlight({
  favicon: '/images/favicon.svg',
}),
```

추가 변형이나 대체 파비콘을 설정해야 하는 경우 [`head` 옵션](#head)을 사용하여 태그를 추가할 수 있습니다.

```js
starlight({
  favicon: '/images/favicon.svg'.
  head: [
    // Safari용 대체 ICO 파비콘을 추가합니다.
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
