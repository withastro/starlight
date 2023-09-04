---
title: 마크다운으로 콘텐츠 작성
description: Starlight가 지원하는 Markdown 구문의 개요입니다.
---

Starlight는 `.md` 파일에서 제목 및 설명과 같은 메타데이터를 정의하기 위해 [Markdown](https://daringfireball.net/projects/markdown/)의 모든 구문과 frontmatter [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f)을 지원합니다.

해당 파일 형식을 사용하는 경우 Markdown 지원 및 사용법이 다를 수 있으므로 [MDX 문서](https://mdxjs.com/docs/what-is-mdx/#markdown) 또는 [Markdoc 문서](https://markdoc.dev/docs/syntax)를 확인하세요.

## 인라인 스타일

텍스트는 **굵게**, _기울임꼴_ 또는 ~~취소선~~으로 표시할 수 있습니다.

```md
텍스트는 **굵게**, _기울임꼴_ 또는 ~~취소선~~으로 표시할 수 있습니다.
```

[다른 페이지로 링크](/ko/getting-started)할 수 있습니다.

```md
[다른 페이지로 링크](/ko/getting-started)할 수 있습니다.
```

백틱을 사용하여 `인라인 코드`를 강조 표시할 수 있습니다.

```md
백틱을 사용하여 `인라인 코드`를 강조 표시할 수 있습니다.
```

## 이미지

Starlight의 이미지는 [Astro에 내장된 최적화된 자산 지원](https://docs.astro.build/ko/guides/assets/)을 사용합니다.

Markdown 및 MDX는 스크린 리더 및 보조 기술에서 사용되는 대체 텍스트가 포함된 이미지를 표시하기 위한 Markdown 구문을 지원합니다.

!["astro"라는 단어가 포함된 행성과 별 그림](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
!["astro"라는 단어가 포함된 행성과 별 그림](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

프로젝트 내 로컬 이미지 파일에 대한 상대 경로도 지원합니다.

```md
// src/content/docs/page-1.md

![우주에 있는 로켓](../../assets/images/rocket.svg)
```

## 제목

제목을 사용하여 콘텐츠를 구조화할 수 있습니다. Markdown의 제목은 줄 시작 부분에 `#` 개수로 나타냅니다.

### Starlight에서 페이지 콘텐츠를 구성하는 방법

Starlight는 페이지 제목을 최상위 제목으로 사용하도록 구성되어 있으며 각 페이지 목차 상단에 "개요" 제목을 포함합니다. 각 페이지를 일반 단락 텍스트 콘텐츠로 시작하고 `<h2>`부터 아래로 페이지 제목을 사용하는 것이 좋습니다.

```md
---
title: Markdown 가이드
description: Starlight에서 Markdown을 사용하는 방법
---

이 페이지는 Starlight에서 Markdown을 사용하는 방법을 설명합니다.

## 인라인 스타일

## 제목
```

### 제목 링크

Markdown에서 제목을 사용하면 자동으로 링크가 제공되므로 페이지의 특정 섹션에 직접 연결할 수 있습니다.

```md
---
title: 내 콘텐츠 페이지
description: Starlight에 내장된 링크를 사용하는 방법
---

## 서론

[나의 결론](#결론)은 같은 페이지 하단에 링크될 수 있습니다.

## 결론

`https://my-site.com/page1/#서론` 서론으로 바로 이동합니다.
```

레벨 2 (`<h2>`) 및 레벨 3 (`<h3>`) 제목이 페이지 목차에 자동으로 나타납니다.

## 주석

주석은 "admonitions" 또는 "callouts" 라고도 하며, 페이지의 기본 콘텐츠 주변에 보조 정보를 표시하는 데 유용합니다.

Starlight는 주석 렌더링을 위한 사용자 정의 Markdown 구문을 제공합니다. 주석 블록은 내용을 감싸기 위해 세 개의 콜론 `:::`을 사용하며 `note`, `tip`, `caution` 또는 `danger` 타입일 수 있습니다.

다른 Markdown 콘텐츠를 주석 안에 중첩시킬 수도 있지만 짧고 간결한 콘텐츠 덩어리에 가장 적합합니다.

### Note 주석

:::note

Starlight는 [Astro](https://astro.build/)로 구축된 문서 웹사이트 툴킷입니다. 다음 명령으로 시작할 수 있습니다.

```sh
npm create astro@latest -- --template starlight
```

:::

````md
:::note
Starlight는 [Astro](https://astro.build/)로 구축된 문서 웹사이트 툴킷입니다. 다음 명령으로 시작할 수 있습니다.

```sh
npm create astro@latest -- --template starlight
```

:::
````

### 사용자 정의 주석 제목

주석 타입 다음에 대괄호를 사용해 주석의 제목을 지정할 수 있습니다. `:::tip[알고 계셨나요?]`

:::tip[알고 계셨나요?]

Astro는 ["Islands Architecture"](https://docs.astro.build/ko/concepts/islands/)를 사용하여 더 빠른 웹사이트를 구축할 수 있도록 도와줍니다.
:::

```md
:::tip[알고 계셨나요?]
Astro는 ["Islands Architecture"](https://docs.astro.build/ko/concepts/islands/)를 사용하여 더 빠른 웹사이트를 구축할 수 있도록 도와줍니다.
:::
```

### 더 많은 주석 타입

Caution과 Danger 주석은 실수하기 쉬운 세부 사항에 대해 사용자를 집중시키는 데 도움이 됩니다. 이러한 기능을 많이 사용하고 있다면, 문서화중인 내용을 다시 디자인하는 것이 좋습니다.

:::caution
당신이 멋진 문서 사이트를 원하지 않는다면 [Starlight](../../)는 필요하지 않을 수도 있습니다.
:::

:::danger
Starlight의 유용한 기능 덕분에 사용자의 생산성이 향상되고 제품을 더 쉽게 사용할 수 있습니다.

- 쉬운 탐색
- 사용자 구성 가능한 색상 테마
- [i18n 지원](/ko/guides/i18n)

:::

```md
:::caution
당신이 멋진 문서 사이트를 원하지 않는다면 [Starlight](../../)는 필요하지 않을 수도 있습니다.
:::

:::danger
Starlight의 유용한 기능 덕분에 사용자의 생산성이 향상되고 제품을 더 쉽게 사용할 수 있습니다.

- 쉬운 탐색
- 사용자 구성 가능한 색상 테마
- [i18n 지원](/ko/guides/i18n)

:::
```

## 인용

> 이것은 인용 구문입니다. 다른 사람의 말이나 문서를 인용할 때 자주 사용됩니다.
>
> 인용은 각 줄의 시작 부분에 `>`를 사용하여 나타낼 수 있습니다.

```md
> 이것은 인용 구문입니다. 다른 사람의 말이나 문서를 인용할 때 자주 사용됩니다.
>
> 인용은 각 줄의 시작 부분에 `>`를 사용하여 나타낼 수 있습니다.
```

## 코드 블록

코드 블록은 시작과 끝 부분에 세 개의 백틱 <code>```</code>이 있는 블록으로 나타냅니다. 시작하는 백틱 뒤에 프로그래밍 언어를 명시할 수 있습니다.

```js
// 구문 강조 기능이 있는 Javascript 코드입니다.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// 구문 강조 기능이 있는 Javascript 코드입니다.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
한 줄의 긴 코드 블록은 줄바꿈되어서는 안됩니다. 너무 길면 가로로 스크롤해야 합니다. 이 줄은 이를 설명할 수 있을 만큼 길어야 합니다.
```

## 기타 일반적인 Markdown 기능

Starlight는 목록 및 테이블과 같은 다른 모든 Markdown 작성 구문을 지원합니다. 모든 Markdown 구문 요소에 대한 간략한 개요는 [Markdown Guide의 Markdown 치트 시트](https://www.markdownguide.org/cheat-sheet/)를 참조하세요.
