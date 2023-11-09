---
title: 컴포넌트 재정의
description: Starlight 내장 컴포넌트를 재정의하여 문서 사이트 UI에 사용자 정의 요소를 추가하는 방법에 대해 알아보세요.
sidebar:
  badge: New
---

Starlight의 기본 UI 및 구성 옵션은 유연하고 다양한 콘텐츠에 작동하도록 설계되었습니다. Starlight의 기본 형태는 대부분 [CSS](/ko/guides/css-and-tailwind/) 및 [구성 옵션](/ko/guides/customization/)을 사용하여 변경할 수 있습니다.

기본적으로 Starlight는 가능한 것보다 더 많은 것이 필요한 경우, 기본 컴포넌트를 확장하거나 재정의(완전히 대체)하기 위한 자체 사용자 정의 컴포넌트 구축을 지원합니다.

## 재정의가 필요한 경우

Starlight의 기본 컴포넌트를 재정의하는 것은 다음과 같은 경우에 유용할 수 있습니다.

- [사용자 정의 CSS](/ko/guides/css-and-tailwind/)로는 불가능한 방식으로 Starlight UI를 변경하고 싶은 경우.
- Starlight UI의 일부 동작을 변경하고 싶은 경우.
- Starlight의 기존 UI 외 새로운 UI를 추가하고 싶은 경우.

## 재정의 방법

1. 재정의하려는 Starlight 컴포넌트를 선택합니다.
   [재정의 참조](/ko/reference/overrides/)에서 전체 컴포넌트 목록을 확인할 수 있습니다.

   이 예시는 페이지 탐색 바에 있는 Starlight의 [`SocialIcons`](/ko/reference/overrides/#socialicons) 컴포넌트를 재정의합니다.

2. Starlight 컴포넌트를 대체할 Astro 컴포넌트를 생성합니다.
   이 예시는 연락처 링크를 렌더링합니다.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">메일 보내기</a>
   ```

3. `astro.config.mjs` 파일의 [`components`](/ko/reference/configuration/#components) 구성 옵션에서 사용자 정의 컴포넌트를 사용하기 위한 설정을 추가합니다.

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: '재정의된 문서',
         components: {
           // 기존 `SocialIcons` 컴포넌트를 재정의합니다.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## 내장 컴포넌트 재사용

Starlight의 기본 UI 컴포넌트를 사용하여 나만의 컴포넌트를 구축할 수 있습니다. 즉, 사용자 정의 컴포넌트에 Starlight UI 컴포넌트를 가져와 렌더링할 수 있습니다. 이를 통해 기존 Starlight UI를 유지하면서 새로운 UI를 추가할 수 있습니다.

아래 예시는 기존 `SocialIcons` 컴포넌트와 함께 이메일 링크를 렌더링하는 사용자 정의 컴포넌트를 나타냅니다.

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">메일 보내기</a>
<Default {...Astro.props}><slot /></Default>
```

사용자 정의 컴포넌트 내부에 내장 컴포넌트를 렌더링하는 경우:

- 전개 연산자를 사용하여 내장 컴포넌트에 `Astro.props`의 모든 속성을 전달합니다. 이를 통해, 내장 컴포넌트는 렌더링에 필요한 모든 데이터를 전달받습니다.
- 기본 컴포넌트 내에 [`<slot />`](https://docs.astro.build/ko/core-concepts/astro-components/#슬롯)을 추가합니다. 이를 통해, 하위 컴포넌트를 전달받은 경우, Astro가 전달받은 컴포넌트를 렌더링할 위치를 알 수 있습니다.

## 페이지 데이터 사용

Starlight 컴포넌트를 재정의할 때, 사용자 정의 구현은 현재 페이지의 모든 데이터가 포함된 표준 `Astro.props` 객체를 전달받습니다.
전달받은 값을 사용하여 컴포넌트 템플릿이 렌더링되는 방식을 제어할 수 있습니다.

예를 들어, `Astro.props.entry.data`를 통해 페이지의 모든 프론트매터 속성을 읽을 수 있습니다. 다음 예시에서 대체 [`PageTitle`](/ko/reference/overrides/#pagetitle) 컴포넌트는 이를 사용하여 현재 페이지의 제목을 표시합니다.

```astro {5} "{title}"
---
// src/components/Title.astro
import type { Props } from '@astrojs/starlight/props';

const { title } = Astro.props.entry.data;
---

<h1 id="_top">{title}</h1>

<style>
  h1 {
    font-family: 'Comic Sans';
  }
</style>
```

[재정의 참조](/ko/reference/overrides/#컴포넌트-속성)에서 사용 가능한 모든 속성에 대해 자세히 알아보세요.

### 특정 페이지 재정의

컴포넌트 재정의는 모든 페이지에 적용됩니다. 하지만, 사용자 정의 UI, Starlight의 기본 UI, 또는 완전히 다른 무언가가 나타나는 시기를 결정하기 위해 `Astro.props`의 값을 사용하여 조건부 렌더링이 가능합니다.

다음 예시에서 Starlight의 [`Footer`](/ko/reference/overrides/#footer)를 재정의하는 컴포넌트는 "Starlight 🌟 를 사용하여 구축"을 홈페이지에만 표시하고, 다른 모든 페이지에는 기본 바닥글만 표시합니다.

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Starlight 🌟 를 사용하여 구축</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

[Astro의 템플릿 구문 가이드](https://docs.astro.build/ko/core-concepts/astro-syntax/#dynamic-html)에서 조건부 렌더링에 대해 자세히 알아보세요.
