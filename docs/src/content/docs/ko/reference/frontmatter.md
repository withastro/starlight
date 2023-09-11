---
title: Frontmatter 참조
description: Starlight가 지원하는 기본 frontmatter 필드에 대한 개요입니다.
---

Frontmatter의 값을 설정하여 Starlight에서 개별 Markdown 및 MDX 페이지를 변경할 수 있습니다. 예를 들어 일반 페이지에서는 `title` 및 `description` 필드를 설정할 수 있습니다.

```md
---
title: 이 프로젝트에 대하여
description: 내가 진행 중인 프로젝트에 대해 자세히 알아보세요.
---

나를 소개하는 페이지에 오신 것을 환영합니다!
```

## Frontmatter 필드

### `title` (필수)

**타입:** `string`

모든 페이지에 제목을 제공해야 합니다. 이는 페이지 상단, 브라우저 탭 및 페이지 메타데이터에 표시됩니다.

### `description`

**타입:** `string`

페이지 설명은 페이지 메타데이터에 사용되며 검색 엔진과 소셜 미디어 미리 보기에서 선택됩니다.

### `editUrl`

**타입:** `string | boolean`

[전역 editLink 구성](/ko/reference/configuration/#editlink)을 변경합니다. 특정 페이지에 대한 "페이지 편집" 링크를 비활성화하거나 이 페이지의 콘텐츠를 편집할 수 있는 대체 URL을 제공하려면 `false`로 설정합니다.

### `head`

**타입:** [`HeadConfig[]`](/ko/reference/configuration/#headconfig)

`head` frontmatter 필드를 사용하여 페이지의 `<head>`에 태그를 추가할 수 있습니다. 이는 사용자 정의 스타일, 메타데이터 또는 기타 태그를 단일 페이지에 추가할 수 있음을 의미합니다. [전역 `head` 옵션](/ko/reference/configuration/#head)과 유사합니다.

```md
---
title: 회사 소개
head:
  # 사용자 정의 <title> 태그 사용
  - tag: title
    content: title에 대한 사용자 정의
---
```

### `tableOfContents`

**타입:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

[전역 tableOfContents 구성](/ko/reference/configuration/#tableofcontents)을 변경합니다.
포함된 제목의 레벨을 변경하거나 값을 `false`로 설정하여 페이지에서 목차를 숨길 수 있습니다.

```md
---
title: 목차에 H2만 있는 페이지
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
title: 목차가 없는 페이지
tableOfContents: false
---
```

### `template`

**타입:** `'doc' | 'splash'`  
**기본값:** `'doc'`

이 페이지의 레이아웃 템플릿을 설정합니다. 페이지는 기본적으로 `'doc'` 레이아웃을 사용합니다. 랜딩 페이지용으로 설계된 사이드바 없이 더 넓은 레이아웃을 사용하려면 `'splash'`로 설정하세요.

### `hero`

**타입:** [`HeroConfig`](#heroconfig)

페이지 상단에 hero 컴포넌트를 추가합니다. `template: splash`와 잘 작동합니다.

예를 들어 이 구성은 저장소에서 이미지를 로드하는 것을 포함하여 몇 가지 일반적인 옵션을 보여줍니다.

```md
---
title: 나의 홈페이지
template: splash
hero:
  title: '내 프로젝트: Stellar Stuff Sooner'
  tagline: 물건을 달에 가져갔다가 눈 깜짝할 사이에 다시 가져올 수 있습니다.
  image:
    alt: 반짝이는 밝은 색상의 로고
    file: ../../assets/logo.png
  actions:
    - text: 더보기
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: Github에서 보기
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
    // 저장소에 있는 이미지의 상대 경로입니다.
    file?: string;
    // 이미지 슬롯에 사용할 Raw HTML입니다.
    // 사용자 정의 `<img>` 태그 또는 인라인 `<svg>`일 수 있습니다.
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

### `lastUpdated`

**타입:** `Date | boolean`

[전역 `lastUpdated` 옵션](/ko/reference/configuration/#lastupdated)을 변경합니다. 날짜가 지정된 경우 유효한 [YAML 타임스탬프](https://yaml.org/type/timestamp.html)여야 하며 이 페이지의 Git 기록에 저장된 날짜를 변경합니다.

```md
---
title: 수정된 최종 업데이트 날짜가 포함된 페이지
lastUpdated: 2022-08-09
---
```

### `prev`

**타입:** `boolean | string | { link?: string; label?: string }`

[전역 `pagination` 옵션](/ko/reference/configuration/#pagination)을 변경합니다. 문자열로 설정하면 생성된 링크 텍스트가 대체되고, 객체로 설정하면 링크와 텍스트가 모두 변경됩니다.

```md
---
# 이전 페이지 링크 숨기기
prev: false
---
```

```md
---
# 이전 페이지 링크의 텍스트 변경
prev: 튜토리얼 계속하기
---
```

```md
---
# 이전 페이지 링크와 텍스트 모두 변경
prev:
  link: /unrelated-page/
  label: 다른 페이지를 확인하세요.
---
```

### `next`

**타입:** `boolean | string | { link?: string; label?: string }`

[`prev`](#prev)와 동일하지만 다음 페이지 링크용입니다.

```md
---
# 다음 페이지 링크 숨기기
next: false
---
```

### `sidebar`

**타입:** `{ label?: string; order?: number; hidden?: boolean; badge?: string | BadgeConfig }`

자동 생성된 링크 그룹을 사용할 때 이 페이지가 [사이드바](/ko/reference/configuration/#sidebar)에 표시되는 방식을 제어합니다.

#### `label`

**타입:** `string`  
**기본값:** 페이지의 [`title`](#title-필수)

자동 생성된 링크 그룹에 표시될 때 사이드바에서 이 페이지에 대한 라벨을 설정합니다.

```md
---
title: 이 프로젝트에 대하여
sidebar:
  label: 소개
---
```

#### `order`

**타입:** `number`

자동 생성된 링크 그룹을 정렬할 때 이 페이지의 순서를 제어합니다. 링크 그룹에서는 낮은 숫자가 위쪽에 표시됩니다.

```md
---
title: 첫 번째로 표시될 페이지
sidebar:
  order: 1
---
```

#### `hidden`

**타입:** `boolean`
**기본값:** `false`

이 페이지가 자동 생성된 사이드바 그룹에 포함되지 않도록 합니다.

```md
---
title: 자동 생성된 사이드바에서 숨길 페이지
sidebar:
  hidden: true
---
```

#### `badge`

**type:** <code>string | <a href="/ko/reference/configuration/#badgeconfig">BadgeConfig</a></code>

자동 생성된 링크 그룹에 표시될 때 사이드바의 페이지에 배지를 추가합니다. 문자열을 사용하면 배지가 기본 강조 색상으로 표시됩니다. 선택적으로, `text` 및 `variant`필드가 포함된 [BadgeConfig 객체](/ko/reference/configuration/#badgeconfig)를 전달하여 배지를 사용자가 원하는대로 변경할 수 있습니다.

```md
---
title: 배지를 사용하는 페이지
sidebar:
  # 사이트의 강조 색상과 일치하는 기본 변형을 사용합니다.
  badge: New
---
```

```md
---
title: 배지를 사용하는 페이지
sidebar:
  badge:
    text: 실험적 기능
    variant: caution
---
```
