---
title: Geçersiz Kılma Başvurusu
description: Starlight tarafından desteklenen geçersiz kılma işlemleri için desteklenen bileşenlerin ve bileşen özelliklerinin genel bir incelemesi.
tableOfContents:
  maxHeadingLevel: 4
---

Starlight'ın yerleşik bileşenlerini, Starlight'ın [`components`](/tr/reference/configuration#components) yapılandırma seçeneğinde yer değiştirme bileşenlerinin yolunu sağlayarak geçersiz kılabilirsiniz.
Bu sayfa, geçersiz kılınabilecek tüm bileşenleri listeler ve bunların GitHub'daki varsayılan uygulamalarına bağlantılar sunar.

Daha fazla bilgi için [Bileşenleri Geçersiz Kılma Kılavuzu](/tr/guides/overriding-components/)ne göz atın.

## Bileşen Özellikleri

Tüm bileşenler, mevcut sayfa hakkında bilgi içeren standart bir `Astro.props` nesnesine erişebilir.

Özel bileşenlerinizi yazmak için Starlight'tan `Props` türünü içe aktarın:

```astro
---
// src/components/Custom.astro
import type { Props } from '@astrojs/starlight/props';

const { hasSidebar } = Astro.props;
//      ^ Tür: boolean
---
```

Bu, `Astro.props`'a erişirken otomatik tamamlamayı ve türleri sağlar.

### Props

Starlight, özel bileşenlerinize aşağıdaki özellikleri iletecektir.

#### `dir`

**Tür:** `'ltr' | 'rtl'`

Sayfanın yazma yönü.

#### `lang`

**Tür:** `string`

Bu sayfanın bölgesi için BCP-47 dil etiketi, örneğin `en`, `zh-CN`, veya `pt-BR`.

#### `locale`

**Tür:** `string | undefined`

Bir dilin sunulduğu temel yol. Kök bölge dize sürümleri için `undefined` .

#### `slug`

**Tür:** `string`

İçerik dosyasının adından oluşturulan bu sayfanın slug'ı.

#### `id`

**Tür:** `string`

İçerik dosyası adına dayalı olarak bu sayfanın benzersiz kimliği.

#### `isFallback`

**Tür:** `true | undefined`

Eğer bu sayfa, mevcut dilde çevrilmemişse ve varsayılan bölgeye ait içeriği kullanıyorsa `true`. Sadece çok dilli sitelerde kullanılır.

#### `entryMeta`

**Tür:** `{ dir: 'ltr' | 'rtl'; lang: string }`

Sayfa içeriği için bölge metaverisi. Bir sayfa, fallback içerik kullanıyorsa, sayfa içeriğinin baş düzey bölge değerlerinden farklı olabilir.

#### `entry`

Mevcut sayfa için Astro içerik koleksiyonu girişi. 
`entry.data` altındaki mevcut sayfa için frontmatter değerlerini içerir.

```ts
entry: {
  data: {
    title: string;
    description: string | undefined;
    // vb.
  }
}
```

Bu nesnenin şekli hakkında daha fazla bilgiyi [Astro'nun Koleksiyon Giriş Türü](https://docs.astro.build/en/reference/api-reference/#collection-entry-type) başvurusunda bulabilirsiniz.

#### `sidebar`

**Tür:** `SidebarEntry[]`

Bu sayfa için site gezinme kenar çubuğu girişleri.

#### `hasSidebar`

**Tür:** `boolean`

Bu sayfada kenar çubuğunun gösterilip gösterilmeyeceğini belirler.

#### `pagination`

**Tür:** `{ prev?: Link; next?: Link }`

Kenar çubuğundaki önceki ve sonraki sayfa bağlantıları.

#### `toc`

**Tür:** `{ minHeadingLevel: number; maxHeadingLevel: number; items: TocItem[] } | undefined`

Bu sayfa için içerik tablosu, açıkken.

#### `headings`

**Tür:** `{ depth: number; slug: string; text: string }[]`

Mevcut sayfadaki tüm Markdown başlıklarının dizisi. 
Starlight'ın yapılandırma seçeneklerini dikkate alan bir içerik tablosu bileşeni oluşturmak istiyorsanız, [`toc`](#toc) yerine kullanın.

#### `lastUpdated`

**Tür:** `Date | undefined`

Etkinleştirilmişse, bu sayfanın son ne zaman güncellendiğini temsil eden JavaScript `Date` nesnesi.

#### `editUrl`

**Tür:** `URL | undefined`

Eğer etkinse, bu sayfanın düzenlenebileceği adres için bir `URL` nesnesi.

---

## Bileşenler

### Head

Bu bileşenler her sayfanın `<head>` etiketi içinde oluşturulur. 
Yalnızca [`<head>` içine izin verilen öğeleri](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head#see_also) içermelidir.

#### `Head`

**Varsayılan component:** [`Head.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Head.astro)

Her sayfanın `<head>` etiketi içinde oluşturulan bileşen. 
`<title>` ve `<meta charset="utf-8">` gibi önemli etiketleri içerir.

Bu bileşeni son çare olarak geçersiz kılın. 
Mümkünse Starlight yapılandırma seçeneği olan [`head`](/tr/reference/configuration#head) seçeneğini tercih edin.

#### `ThemeProvider`

**Varsayılan component:** [`ThemeProvider.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeProvider.astro)

Karanlık/aydınlık tema desteği oluşturan bileşen `<head>` içinde oluşturulan bileşen. 
Varsayılan uygulama, inline betik ve [`<ThemeSelect />`](#themeselect) için kullanılan bir `<template>` içerir.

---

### Erişebilirlik

#### `SkipLink`

**Varsayılan component:** [`SkipLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SkipLink.astro)

Erişilebilirlik için her sayfanın içindeki ilk öğe olarak oluşturulan bileşen. 
Varsayılan uygulama, kullanıcıların klavyeleriyle odaklandıkça görünür hale gelen bir uygulama içerir.

---

### Layout

Bu bileşenler, Starlight'ın bileşenlerini düzenlemek ve farklı kesme noktaları arasında görünümleri yönetmekle sorumludur. 
Bu bileşenleri geçersiz kılmak önemli karmaşıklık içerir. 
Mümkünse daha düşük seviye bir bileşeni geçersiz kılmayı tercih edin.

#### `PageFrame`

**Varsayılan component:** [`PageFrame.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageFrame.astro)

Sayfa içeriğinin çoğunu saran düzen bileşeni. 
Varsayılan uygulama, başlık çubuğu - kenar çubuğu - ana düzeni oluşturur ve ana içerik için `header` ve `sidebar` adlandırılmış yuvalarla birlikte bir varsayılan yuva içerir. 
Aynı zamanda küçük (mobil) görünümlerde kenar çubuğu gezinmeyi açıp kapatmayı desteklemek için [`<MobileMenuToggle />`](#mobilemenutoggle) bileşenini de oluşturur.

#### `MobileMenuToggle`

**Varsayılan component:** [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro)

Küçük (mobil) görünümlerde kenar çubuğu gezinmeyi açıp kapatan [`<PageFrame>`](#pageframe) içinde oluşturulan bileşen.

#### `TwoColumnContent`

**Varsayılan component:** [`TwoColumnContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TwoColumnContent.astro)

Ana içerik sütunu ve sağ kenar çubuğu (içerik tablosu) etrafında saran düzen bileşeni. 
Varsayılan uygulama, tek sütunlu küçük ekran düzeni ve iki sütunlu büyük ekran düzeni arasında geçiş yapmayı ele alır.

---

### Header

Bu bileşenler, Starlight'ın üst gezinme çubuğunu oluşturur.

#### `Header`

**Varsayılan component:** [`Header.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Header.astro)

Her sayfanın en üstünde görünen başlık bileşeni. 
Varsayılan uygulama, [`<SiteTitle />`](#sitetitle), [`<Search />`](#search), [`<SocialIcons />`](#socialicons), [`<ThemeSelect />`](#themeselect), ve [`<LanguageSelect />`](#languageselect) bileşenlerini görüntüler..

#### `SiteTitle`

**Varsayılan component:** [`SiteTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SiteTitle.astro)

Site başlığını oluşturmak için kullanılan bileşen. 
Varsayılan uygulama, Starlight yapılandırmasında tanımlanan logoları oluşturmak için bir mantık içerir.

#### `Search`

**Varsayılan component:** [`Search.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Search.astro)

Starlight'ın arama arayüzünü oluşturmak için kullanılan bileşen. 
Varsayılan uygulama, başlıkta bir düğmeyi ve düğmeye tıkladığınızda bir arama penceresini açan ve [Pagefind’s UI](https://pagefind.app/)'sini yükleyen kodu içerir.

#### `SocialIcons`

**Varsayılan component:** [`SocialIcons.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SocialIcons.astro)

Site başlığında görünen sosyal simge bağlantıları içeren bileşen. 
Varsayılan uygulama, sosyal simgeleri ve bağlantıları oluşturmak için Starlight yapılandırmasındaki social seçeneğini kullanır.

#### `ThemeSelect`

**Varsayılan component:** [`ThemeSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeSelect.astro)

Kullanıcıların tercih ettikleri renk düzenini seçmelerine izin veren site başlığında görünen bileşen.

#### `LanguageSelect`

**Varsayılan component:** [`LanguageSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LanguageSelect.astro)

Kullanıcılara farklı bir dil seçme olanağı sunan site başlığında görünen bileşen.

---

### Global Kenar Çubuğu

Starlight'ın global kenar çubuğu, ana site gezinmesini içerir. 
Dar görünümlerde bu, açılır bir menünün arkasında gizlenir.

#### `Kenar Çubuğu`

**Varsayılan component:** [`Sidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Sidebar.astro)

Sayfa içeriğinden önce görüntülenen, genel gezinmeyi içeren bir bileşen. 
Varsayılan uygulama, yeterince geniş görüntüleme noktalarında bir kenar çubuğu olarak görüntülenirken, küçük (mobil) görüntüleme noktalarında bir açılır menü içinde görüntülenir. 
Ayrıca [`<MobileMenuFooter />`](#mobilemenufooter)’ı mobil menü içinde ek öğeleri göstermek için görüntüler.

#### `MobileMenuFooter`

**Varsayılan component:** [`MobileMenuFooter.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuFooter.astro)

Mobil açılır menünün altında görüntülenen bir bileşen. 
Varsayılan uygulama, [`<ThemeSelect />`](#themeselect) ve [`<LanguageSelect />`](#languageselect)’i görüntüler.

---

### Sayfa Kenar Çubuğu

Starlight'ın sayfa kenar çubuğu, mevcut sayfanın alt başlıklarını özetleyen bir içerik tablosunu görüntülemekten sorumludur. 
Dar görüntüleme noktalarında, bu yapışkan, açılır bir menüye çöker.

#### `PageSidebar`

**Varsayılan component:** [`PageSidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageSidebar.astro)

Mevcut sayfanın içeriğinden önce bir içerik tablosu görüntülemek için kullanılan bir bileşen. 
Varsayılan uygulama, [`<TableOfContents />`](#tableofcontents) ve [`<MobileTableOfContents />`](#mobiletableofcontents)’i görüntüler.

#### `TableOfContents`

**Varsayılan component:** [`TableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TableOfContents.astro)

Mevcut sayfanın içeriğinin geniş ekranlarda tablosunu görüntüleyen bir bileşen.

#### `MobileTableOfContents`

**Varsayılan component:** [`MobileTableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileTableOfContents.astro)

Mevcut sayfanın içeriğinin küçük (mobil) ekranlarda tablosunu görüntüleyen bir bileşen.

---

### İçerik

Bu bileşenler sayfa içeriğinin ana sütununda görüntülenir.

#### `Banner`

**Varsayılan component:** [`Banner.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Banner.astro)

Her sayfanın üstünde görüntülenen [`banner`](/tr/reference/frontmatter#banner) bileşeni. 
Varsayılan uygulama, sayfanın banner ön bilgisinin değerine bağlı olarak görüntülenip görüntülenmeyeceğini belirler.

#### `ContentPanel`

**Varsayılan component:** [`ContentPanel.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ContentPanel.astro)

Ana içerik sütununun bölümlerini sarmak için kullanılan düzen bileşeni.

#### `PageTitle`

**Varsayılan component:** [`PageTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageTitle.astro)

Mevcut sayfanın `<h1>` öğesini içeren bir bileşen.

Uygulamalar, varsayılan uygulama gibi `<h1>` öğesine `id="_top"` ayarladıklarından emin olmalıdır.

#### `FallbackContentNotice`

**Varsayılan component:** [`FallbackContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/FallbackContentNotice.astro)

Mevcut dil için bir çeviri mevcut olmayan sayfalarda kullanıcıların gördüğü bildirim. 
Yalnızca çok dilli sitelerde kullanılır.

#### `Hero`

**Varsayılan component:** [`Hero.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Hero.astro)

Frontmatter’da [`hero`](/tr/reference/frontmatter#hero) ayarlandığında sayfanın üstünde görüntülenen bir bileşen. 
Varsayılan uygulama büyük bir başlık, slogan ve isteğe bağlı bir resim ile yanı sıra çağrıya yönlendiren bağlantıları gösterir.

#### `MarkdownContent`

**Varsayılan component:** [`MarkdownContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MarkdownContent.astro)

Her sayfanın ana içeriği etrafında görüntülenen bir bileşen. 
Varsayılan uygulama, Markdown içeriğine uygulanacak temel stilleri ayarlar.
Markdown içerik stilleri ayrıca `@astrojs/starlight/style/markdown.css` dosyasında da gösterilir ve `.sl-markdown-content` CSS sınıfını kapsar.

---

### Footer

Bu bileşenler sayfa içeriğinin altında görüntülenir.

#### `Footer`

**Varsayılan component:** [`Footer.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Footer.astro)

Her sayfanın altında görüntülenen bir alt bilgi bileşeni. 
Varsayılan uygulama [`<LastUpdated />`](#lastupdated), [`<Pagination />`](#pagination) ve [`<EditLink />`](#editlink)’i görüntüler.

#### `LastUpdated`

**Varsayılan component:** [`LastUpdated.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LastUpdated.astro)

Sayfa alt bilgisinde son güncelleme tarihini görüntülemek için kullanılan bir bileşen.

#### `EditLink`

**Varsayılan component:** [`EditLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/EditLink.astro)

Sayfa alt bilgisinde sayfanın düzenlenebileceği bir bağlantıyı görüntülemek için kullanılan bir bileşen.

#### `Pagination`

**Varsayılan component:** [`Pagination.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Pagination.astro)

Sayfa alt bilgisinde önceki/sonraki sayfalar arasında gezinme oklarını görüntülemek için kullanılan bir bileşen.
