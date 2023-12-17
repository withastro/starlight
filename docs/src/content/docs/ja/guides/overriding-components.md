---
title: コンポーネントのオーバーライド
description: Starlightの組み込みコンポーネントをオーバーライドして、ドキュメントサイトのUIにカスタム要素を追加する方法を学びます。
---

StarlightのデフォルトのUIと設定オプションは、柔軟に設計されており、さまざまなコンテンツで機能します。Starlightのデフォルトの見た目の大部分は、[CSS](/ja/guides/css-and-tailwind/)と[設定オプション](/ja/guides/customization/)によりカスタマイズできます。

デフォルトの内容に満足できない場合には、デフォルトのコンポーネントを拡張したり、オーバーライドしたり（完全に置き換えたり）するためのカスタムコンポーネントを作成することも可能です。

## いつオーバーライドするか

以下の場合、Starlightのデフォルトコンポーネントをオーバーライドすると便利です。

- [カスタムCSS](/ja/guides/css-and-tailwind/)では不可能な方法で、StarlightのUIの見た目を部分的に変更したい場合。
- StarlightのUIの動作を部分的に変更したい場合。
- Starlightの既存のUIに別のUIを追加したい場合。

## オーバーライドの方法

1. オーバーライドしたいStarlightコンポーネントを選択します。コンポーネントの完全なリストは、[オーバーライドリファレンス](/ja/reference/overrides/)にあります。

   この例では、ページのナビゲーションバーに表示される、Starlightの[`SocialIcons`](/ja/reference/overrides/#socialicons)コンポーネントをオーバーライドします。

2. Starlightのコンポーネントを置き換えるAstroコンポーネントを作成します。この例では、連絡先のリンクをレンダリングします。

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">メールしてね</a>
   ```

3. `astro.config.mjs`の[`components`](/ja/reference/configuration/#components)設定オプションで、カスタムコンポーネントを使用するようStarlightに指示します。

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'オーバーライドを設定したドキュメント',
         components: {
           // デフォルトの`SocialIcons`コンポーネントをオーバーライドします。
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## 組み込みコンポーネントを再利用する

StarlightのデフォルトのUIコンポーネントを、自分で作ったものと同じように使うことができます。これにより、Starlightの基本的なUIをデザインとしてすべて保持しながら、そこに別のUIを追加することができます。

以下の例は、デフォルトの`SocialIcons`コンポーネントと一緒に、メールリンクをレンダリングするカスタムコンポーネントです。

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">メールしてね</a>
<Default {...Astro.props}><slot /></Default>
```

組み込みコンポーネントをカスタムコンポーネント内でレンダリングする場合、

- `Astro.props`を展開します。これにより、レンダリングに必要なすべてのデータを受け取ることができます。
- デフォルトのコンポーネント内に[`<slot />`](https://docs.astro.build/ja/core-concepts/astro-components/#スロット)を追加します。これにより、コンポーネントに子要素が渡された場合、Astroがそれらをどこにレンダリングするかを知ることができます。

## ページデータを使用する

Starlightコンポーネントをオーバーライドすると、カスタム実装側には、現在のページのすべてのデータを含む、標準の`Astro.props`オブジェクトが渡されます。これらの値を使用して、コンポーネントテンプレートのレンダリング方法を制御することができます。

たとえば、ページのフロントマターの値を`Astro.props.entry.data`として取得できます。以下の例では、[`PageTitle`](/ja/reference/overrides/#pagetitle)を置き換えるコンポーネントが、現在のページのタイトルを表示するためにこれを使用しています。

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

利用可能なすべてのpropsについて、詳しくは[オーバーライドリファレンス](/ja/reference/overrides/#コンポーネントprops)を参照してください。

### 特定ページのみでのオーバーライド

コンポーネントのオーバーライドはすべてのページに適用されます。ただし、`Astro.props`の値を使用して条件に応じてレンダリングすることで、カスタムUIを表示するタイミング、StarlightのデフォルトUIを表示するタイミング、あるいはまったく別のものを表示するタイミングを決定することができます。

以下は、Starlightの[`Footer`](/ja/reference/overrides/#footer)をオーバーライドするコンポーネントの例です。ホームページでのみ「Starlightで作成 🌟」と表示し、それ以外のすべてのページではデフォルトのフッターを表示します。

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Starlightで作成 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

条件付きレンダリングについて、詳しくは[Astroのテンプレート構文ガイド](https://docs.astro.build/ja/core-concepts/astro-syntax/#動的html)を参照してください。
