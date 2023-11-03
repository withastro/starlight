---
title: Frontmatter Referansı
description: Starlight'ın desteklediği varsayılan frontmatter alanlarının genel bir bakışı.
---

Markdown ve MDX sayfalarını, ön yüze verilerini ayarlayarak Starlight'ta özelleştirebilirsiniz. Örneğin, normal bir sayfa, `title` ve `description` alanlarını şu şekilde ayarlayabilir:

```md
---
title: Bu proje hakkında
description: Üzerinde çalıştığım projeyi daha iyi anlayın.
---

Hakkında sayfasına, Hoş geldiniz!

```

## Frontmatter alanları

### `title` (Gerekli)

**Tür:** `string`

Her sayfa için bir başlık sağlamanız gerekmektedir. Bu başlık sayfanın üstünde, tarayıcı sekmesinde ve sayfa meta verilerinde görüntülenir.

### `description`

**Tür:** `string`

Sayfa açıklaması, sayfa meta verileri için kullanılır ve arama motorları tarafından ve sosyal medya önizlemelerinde kullanılır.

### `editUrl`

**Tür:** `string | boolean`

[global `editLink` yapılandırmasını](/reference/configuration/#editlink) geçersiz kılar. Belirli bir sayfa için "Sayfayı Düzenle" bağlantısını devre dışı bırakmak için `false` olarak ayarlayın veya bu sayfanın içeriğinin düzenlenebileceği alternatif bir URL sağlayın.

### `head`

**Tür:** [`HeadConfig[]`](/reference/configuration/#headconfig)

`head` frontmatter alanını kullanarak sayfanızın `<head>` etiketine ek etiketler ekleyebilirsiniz. Bu, özel stiller, meta verileri veya diğer etiketleri tek bir sayfaya eklemenizi sağlar. [global `head` seçeneği](/reference/configuration/#head) gibi çalışır.

```md
---
title: Hakkımızda
head:
  # Özel bir <title> etiketi kullanın
  - tag: title
    content: Özelleştirilmiş Başlık
---
```

### `tableOfContents`

**Tür:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

[global `tableOfContents` yapılandırmasını](/reference/configuration/#tableofcontents) geçersiz kılar. Eklenen başlık seviyelerini özelleştirebilir veya bu sayfada içerik tablosunu gizlemek için `false` olarak ayarlayabilirsiniz.

```md
---
title: İçerik tablosunda yalnızca H2'lerle sayfa
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
title: İçerik tablosu olmayan sayfa
tableOfContents: false
---
```

### `template`

**Tür:** `'doc' | 'splash'`  
**varsayılan:** `'doc'`

Sayfa için düzen şablonunu ayarlar. 
Sayfalar varsayılan olarak `'doc'` düzenini kullanır. 
İntro sayfaları için tasarlanmış kenar çubuğu olmayan daha geniş bir düzeni kullanmak için `'splash'` olarak ayarlayın.

### `hero`

**Tür:** [`HeroConfig`](#heroconfig)

Bu sayfanın üstüne bir kahraman bileşeni ekler. `template: splash` ile iyi çalışır.

Örneğin, bu yapılandırma bazı yaygın seçenekleri gösterir, dahil olmak üzere depo verilerinizden bir resmi yüklemek.

```md
---
title: Benim Ana Sayfam
template: splash
hero:
  title: 'Benim Proje: Göz Kırpmadan Harika Şeyler'
  tagline: Eşyalarınızı göz açıp kapayıncaya kadar ay'a ve geri getirin.
  image:
    alt: Parlak, canlı renkli bir logo
    file: ../../assets/logo.png
  actions:
    - text: Daha fazla bilgi ver
      link: /baslangic/
      icon: right-arrow
      variant: primary
    - text: GitHub'da Görüntüle
      link: https://github.com/astronaut/my-project
      icon: external
---
```

Aydınlık ve karanlık modlarda farklı sürümlerini kahraman resmini görüntüleyebilirsiniz.

```md
---
hero:
  image:
    alt: Parlak, canlı renkli bir logo
    dark: ../../assets/logo-dark.png
    light: ../../assets/logo-light.png
---
```

#### `HeroConfig`

```ts
arayüz HeroConfig {
  title?: string;
  tagline?: string;
  image?:
    | {
        // Depo içindeki bir resmin göreceli yolu.
        file: string;
        // Resmi erişilebilir hale getirmek için alt metin
        alt?: string;
      }
    | {
        // Depo içindeki bir resmi karanlık mod için kullanılacak göreceli yolu.
        dark: string;
        // Depo içindeki bir resmi aydınlık mod için kullanılacak göreceli yolu.
        light: string;
        // Resmi erişilebilir hale getirmek için alt metin
        alt?: string;
      }
    | {
        // Resim yuvasında kullanmak için düz HTML.
        // Özel bir `<img>` etiketi veya iç içe `<svg>` olabilir.
        html: string;
      };
  actions?: Dizi<{
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'minimal';
    icon: string;
  }>;
}
```

### `banner`

**Tür:** `{ content: string }`

Bu sayfanın üstünde bir duyuru bannerı görüntüler.

`content` değeri, bağlantılar veya diğer içerikler için HTML içerebilir.
Örneğin, bu sayfa, `example.com` bağlantısı içeren bir banner görüntüler.

```md
---
title: Banner ile sayfa
banner:
  content: |
    Şimdi harika bir şey başlattık!
    <a href="https://example.com">İncele</a>
---
```

### `lastUpdated`

**Tür:** `Date | boolean`

[global `lastUpdated` seçeneğini](/reference/configuration/#lastupdated) geçersiz kılar. Belirli bir tarih belirtilirse, bu sayfa için Git geçmişinde saklanan tarihi geçersiz kılmalı ve geçerli bir [YAML zaman damgası](https://yaml.org/type/timestamp.html) olmalıdır.

```md
---
title: Özel son güncelleme tarihine sahip sayfa
lastUpdated: 2022-08-09
---
```

### `prev`

**Tür:** `boolean | string | { link?: string; label?: string }`

[global `pagination` seçeneğini](/reference/configuration/#pagination) geçersiz kılar. Bir dize belirtilirse, oluşturulan bağlantı metni değiştirilecektir ve bir nesne belirtilirse, hem bağlantı hem de metin geçersiz kılınacaktır.

```md
---
# Önceki sayfa bağlantısını gizle
prev: false
---
```

```md
---
# Önceki sayfa bağlantısını geçersiz kılın
prev: Öğretmeye devam et
---
```

```md
---
# Hem önceki sayfa bağlantısını hem de metni geçersiz kılın
prev:
  link: /ilgili-sayfa/
  label: Başka bir sayfayı kontrol et
---
```

### `next`

**Tür:** `boolean | string | { link?: string; label?: string }`

[`prev`](#prev) ile aynıdır, ancak bir sonraki sayfa bağlantısı için geçerlidir.

```md
---
# Sonraki sayfa bağlantısını gizle
next: false
---
```

### `pagefind`

**Tür:** `boolean`  
**varsayılan:** `true`

Bu sayfanın [Pagefind](https://pagefind.app/) arama dizininde dahil edilip edilmemesini belirler. Sayfanın arama sonuçlarından hariç tutulması için `false` olarak ayarlayın:

```md
---
# Bu sayfayı arama dizininden gizle
pagefind: false
---
```

### `sidebar`

**Tür:** [`SidebarConfig`](#sidebarconfig)

Bu sayfanın otomatik olarak oluşturulan bir bağlantı grubunda nasıl görüntülendiğini kontrol ederken [kenar çubuğu](/reference/configuration/#sidebar)'nda nasıl görüntüleneceğini kontrol eder.

#### `SidebarConfig`

```ts
interface SidebarConfig {
  label?: string;
  order?: number;
  hidden?: boolean;
  badge?: string | BadgeConfig;
  attrs?: Record<string, string | number | boolean | undefined>;
}
```

#### `label`

**Tür:** `string`  
**varsayılan:** Sayfa [`title`](#title-required)

Otomatik olarak oluşturulan bir bağlantı grubunda bu sayfanın kenar çubuğundaki etiketini ayarlar.

```md
---
title: Bu proje hakkında
sidebar:
  label: Hakkında
---
```

#### `order`

**Tür:** `number`

Otomatik olarak oluşturulan bir bağlantı grubunu sıralarken bu sayfanın sırasını kontrol eder. 
Daha düşük sayılar bağlantı grubunda daha yukarıda görüntülenir.

```md
---
title: İlk görüntülenmesi gereken sayfa
sidebar:
  order: 1
---
```

#### `hidden`

**Tür:** `boolean`  
**varsayılan:** `false`

Bu sayfanın otomatik olarak oluşturulan bir kenar çubuğu grubunda yer almamasını önler.

```md
---
title: Otomatik olarak oluşturulan kenar çubuğundan gizlenecek sayfa
sidebar:
  hidden: true
---
```

#### `badge`

**Tür:** <code>string | <a href="/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Otomatik olarak oluşturulan bir bağlantı grubunda sayfaya bir rozet ekler. 
Dize kullanırken, rozet varsayılan vurgu rengiyle görüntülenir. 
İsteğe bağlı olarak, bir [`BadgeConfig` nesnesi](/reference/configuration/#badgeconfig) ile `text` ve `variant` alanlarını özelleştirmek için kullanabilirsiniz.

```md
---
title: Rozetli sayfa
sidebar:
  # Site'nin vurgu renginizi eşleyen varsayılan varyant kullanır
  badge: New
---
```

```md
---
title: Rozetli sayfa
sidebar:
  badge:
    text: Experimental
    variant: caution
---
```

#### `attrs`

**Tür:** `Record<string, string | number | boolean | undefined>`

Otomatik olarak oluşturulan bir bağlantı grubunda sayfa bağlantısına eklemek için HTML öznitelikleri ekler.

```md
---
title: Yeni sekmede açılan sayfa
sidebar:
  # Sayfayı yeni bir sekmede açar
  attrs:
    target: _blank
---
```
