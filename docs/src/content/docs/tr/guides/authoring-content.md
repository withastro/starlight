---
title: Markdown'da İçerik Yazmak
description: Starlight'ın desteklediği Markdown sözdizimine genel bakış.
---

Starlight, `.md` uzantılı dosyalarda [Markdown](https://daringfireball.net/projects/markdown/) sözdizimini, [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) önbölümünde olduğu gibi başlık ve açıklama gibi metaverileri tanımlamak için destekler.

Markdown desteği ve kullanımı farklılık gösterebileceğinden dolayı, bu dosya formatlarını kullanıyorsanız [MDX dokümantasyonu](https://mdxjs.com/docs/what-is-mdx/#markdown) ya da [Markdoc dokümantasyonu](https://markdoc.dev/docs/syntax)'nu incelediğinizden emin olun.

## Ön-bölüm

Starlight'taki tekil sayfalarınızı, ön-bölümlerindeki değerlerini ayarlayarak özelleştirebilirsiniz.
Ön-bölüm, dosyanızın en üstünde `---` ayraçları arasında kalan bölümdür:

```md title="src/content/docs/example.md"
---
title: Sayfa Başlığım
---

Sayfa içeriği, ikinci `---` 'den sonraki kısımda kalır.
```

Her sayfa en azından bir `title` içermek zorundadır.
Uygun tüm alanları görmek ve yeni özel alan eklemek için [ön-bölüm referansı](/tr/reference/frontmatter/)'nı inceleyin.

## Satır İçi Stiller

Metin **kalın**, _italik_ ya da ~~üstü çizili~~ olabilir.

```md
Metin **kalın**, _italik_ ya da ~~üstü çizili~~ olabilir.
```

Başka bir sayfaya [bağlantı ekleyebilirsiniz](/tr/getting-started/).

```md
Başka bir sayfaya [bağlantı ekleyebilirsiniz](/tr/getting-started/).
```

Kesme işaretleri ile `satır için kodu` vurgulayabilirsiniz.

```md
Kesme işaretleri ile `satır için kodu` vurgulayabilirsiniz.
```

## Görseller

Starlight'ta görseller [Astro'nun kurulu optimize edilen dosya desteği](https://docs.astro.build/en/guides/assets/) ile kullanılır.

Markdown ve MDX, ekran okuyucular ve yardımcı teknolojilere yönelik alternatif metin içeren görselleri göstermek için Markdown sözdizimini destekler.

!["astro" metni içeren gezegen ve yıldızlar görseli](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
!["astro" metni içeren gezegen ve yıldızlar görseli](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

Ayrıca, yerel olarak projenizde barındırılan görseller için ilişkili görsel dizin yolları desteklenir.

```md
// src/content/docs/page-1.md

![Uzayda bir roket](../../assets/images/rocket.svg)
```

## Başlıklar

Başlık kullanarak içerik yapınızı kurabilirsiniz. Markdown'daki başlıklar `#` sayısı ile satır başında oluşturulabilir.

### Starlight'ta sayfa içeriği yapısı nasıl kurulur

Starlight, sayfa başlığınızı en üst seviye başlık olarak kullanılacak şekilde yapılandırılmıştır ve içerik tablosunda "Genel Bakış" olarak yer alacaktır. Her sayfanın bir paragraf metniyle ve sayfa üstü başlığının `<h2>` ve alt seviyelerini kullanarak oluşturulmasını öneriyoruz:

```md
---
title: Markdown Rehberi
description: Starlight'ta Markdown nasıl kullanılır
---

Bu sayfa Starlight'ta Markdown'un nasıl kullanıldığını açıklar.

## Satır İçi Stiller

## Başlıklar
```

### Otomatik Başlık Bağlantıları

Markdown'da başlık kullanmak, otomatik olarak başlıklar için bağlantı oluşturur. Böylece sayfanızın belli bölümlerini direkt olarak bağlantılandırabilirsiniz:

```md
---
title: Sayfa İçeriğim
description: Starlight'ın kurulu bağlantıları nasıl kullanılır
---

## Giriş

[Görüşümü](#görüş) aynı sayfanın aşağısına iliştirebilirim.

## Görüş

`https://my-site.com/page1/#introduction` giriş bölümüme direkt olarak yönlendirir.
```

Seviye 2 (`<h2>`) ve Seviye 3 (`<h3>`) başlıklar otomatik olarak içerik tablosunda görünecektir.

Astro'nun, başlıklardaki `id` öğesini işlemesi hakkında daha fazlasını [Astro dokümantasyonundan](https://docs.astro.build/en/guides/markdown-content/#heading-ids) öğren.

## Ara Bölümler

Ara bölümler, sayfanın ana içeriğinin yanında ikincil bilgi gösterimi için kullanışlıdır.

Starlight ara bölümleri oluşturmak için özel Markdown sözdizimi sunar. Ara bölüm blokları üç adet iki nokta üst üste'nin `:::` içeriği sarmalamasıyla kullanılır ve tip olarak `note`,`tip`, `caution` ya da `danger` kullanılabilir.

Herhangi bir Markdown içerik tipini ara bölümü içerisine yerleştirebilirsiniz, ancak ara bölümler kısa ve öz içerikler için biçilmiş kaftandır.

### Note Ara bölümü

:::note
Starlight, [Astro](https://astro.build/) ile oluşturulmuş bir dokümantason website oluşturma aracıdır. Bu komutla başlayabilirsiniz:

```sh
npm create astro@latest -- --template starlight
```

:::

````md
:::note
Starlight, [Astro](https://astro.build/) ile oluşturulmuş bir dokümantason website oluşturma aracıdır. Bu komutla başlayabilirsiniz:

```sh
npm create astro@latest -- --template starlight
```

:::
````

### Özel ara bölümler

Ara bölümler için ara bölüm tipinin tanımından hemen sonra, köşeli parantez arasında olacak şekilde ara bölümlerinizi özelleştirebilirsiniz (örn.`:::tip[Bunu biliyor musun?]`).

:::tip[Bunu biliyor musun?]
Astro [Ada Mimarisi”](https://docs.astro.build/en/concepts/islands/) ile daha hızlı websitesi oluşturmana yardımcı olur.
:::

```md
:::tip[Bunu biliyor musun?]
Astro [Ada Mimarisi”](https://docs.astro.build/en/concepts/islands/) ile daha hızlı websitesi oluşturmana yardımcı olur.
:::
```

### Diğer Ara bölümler

Uyarı ve tehlike ara bölümleri, kullanıcıların dikkatini gözden kaçabilecek detaylara çekmek için kullanışlıdır.
Bunları çok kullandığınızı farkederseniz, dokümanınızın yeniden oluşturulmasına gerek kalmayacağının işareti olabilir.

:::caution[Uyarı]
Harika bir dokümantasyon sitesi istediğine emin değilsen, [Starlight](/tr/) kullanmadan önce iki kez düşün.
:::

:::danger[Tehlike]
Yardımcı Starlight özellikleri sayesinde kullanıcılarınız daha kolay ürün bulabilir ve daha üretken olabilir.

- Yönlendirmeyi temizle
- Kullanıcı-yapılandırmalı renk teması
- [i18n desteği](/tr/guides/i18n/)

:::

```md
:::caution
Harika bir dokümantasyon sitesi istediğine emin değilsen, [Starlight](/tr/) kullanmadan önce iki kez düşün.
:::

:::danger
Yardımcı Starlight özellikleri sayesinde kullanıcılarınız daha kolay ürün bulabilir ve daha üretken olabilir.

- Yönlendirmeyi temizle
- Kullanıcı-yapılandırmalı renk teması
- [i18n desteği](/tr/guides/i18n/)

:::
```

## Blok Alıntılar

> Bu, genelde başka bir belge ya da kişiden alıntılanan bir blok alıntıdır.
>
> Blok alıntılar her satırda `>` ile başlar.

```md
> Bu, genelde başka bir belge ya da kişiden alıntılanan bir blok alıntıdır.
>
> Blok alıntılar her satırda `>` ile başlar.
```

## Kod Blokları

Kod bloğu, başında ve sonunda üç kesme işaretinin arasında kalan <code>```</code> bir bloktur. Üç kesme işaretiyle başladıktan hemen sonra göstermek istediğiniz programlama dilini belirtebilirsiniz.

```js
// Sözdizimi vurgulamalı Javascript kodu.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// Sözdizimi vurgulamalı Javascript kodu.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
Uzun, tek satırlı kod bloğu alt satıra geçmemelidir. Çok uzunsa yatay kaydırma olmalıdır. Bu satır, yatay kaydırma çubuğunun görünmesi için yeterince uzun olmalıdır.
```

### Expressive Code özellikleri

Starlight, kod blokları için biçimlendirme imkanlarını genişletmek için [Expressive Code](https://github.com/expressive-code/expressive-code/tree/main/packages/astro-expressive-code) kullanır. Expressive Code’un metin işaretleyicileri ve çerçeve eklentileri varsayılan olarak geçerlidir. Kod bloğu işleme Starlight'ın [`expressiveCode` yapılandırma ayarından](/tr/reference/configuration/#expressivecode) yapılandırılabilir.

#### Metin işaretleyicileri

Kod bloğunuzun belirli satırları ya da bölümlerini, kod bloğunuzun ilk satırında [Expressive Code metin işaretleyicilerini](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#usage-in-markdown--mdx-documents) kullanarak vurgulayabilirsiniz.

Tüm satırı vurgulamak için çengelli parantez(`{ }`) ve metin dizilerini vurgulamak için tırnak işaretleri kullanın.

3 vurgulama stili mevcuttur: koda dikkat çekmek için renksiz, eklenmiş kodu belirtme için yeşil ve silinmiş kodu belirtme için kırmızı.
Metin ve tüm satırlar varsayılan işaretleyici kullanılarak işaretlenebilir ya da `ins=` be `del=` kombinasyonuyla istenilen vurgulama uygulanabilir.

Expressive Code kod örneklerinizin görünümünü özelleştirmek için birkaç ayar sunar.
Bunları çoğu çok iyi açıklayı kod örnekleri için kombine edilebilir.
Lütfen kapsamlı uygun ayarlar için [Expressive Code dokümantasyonunu](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md) keşfedin.

En yaygın örneklerden bazıları aşağıda gösterilmiştir:

- [Tüm satırı ve satır aralıklarını `{ }` işaretleyici kullanarak işaretleme](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#marking-entire-lines--line-ranges):

  ```js {2-3}
  function demo() {
    // Bu satır (2.) ve sonraki satır vurgulanacaktır.
    return 'Bu, kod parçacığınının 3. satırıdır.';
  }
  ```

  ````md
  ```js {2-3}
  function demo() {
    // Bu satır (2.) ve sonraki satır vurgulanacaktır.
    return 'Bu, kod parçacığınının 3. satırıdır.';
  }
  ```
  ````

- [ `" "` işaretleyicisi ya da düzenli ifadeleri kullanar seçili metni işaretleme](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#marking-individual-text-inside-lines):

  ```js "Tekil ifadeler" /Düzenli.*destekleniyor/
  // Tekil ifadeler de vurgulanabilir
  function demo() {
    return 'Düzenli ifadeleri bile destekleniyor';
  }
  ```

  ````md
  ```js "Tekil ifadeler" /Düzenli.*destekleniyor/
  // Tekil ifadeler de vurgulanabilir
  function demo() {
    return 'Düzenli ifadeleri bile destekleniyor';
  }
  ```
  ````

- [`ins` ya da `del` ile satırları veya metni eklenmiş ya da silinmiş olarak işaretleme](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#selecting-marker-types-mark-ins-del):

  ```js "return true;" ins="eklenmiş" del="silinmiş"
  function demo() {
    console.log('Bunlar, eklenmiş ve silinmiş işaretleyici tipleridir');
    // return ifadesi varsayılan işaretleyici tipini kullanır
    return true;
  }
  ```

  ````md
  ```js "return true;" ins="eklenmiş" del="silinmiş"
  function demo() {
    console.log('Bunlar, eklenmiş ve silinmiş işaretleyici tipleridir');
    // return ifadesi varsayılan işaretleyici tipini kullanır
    return true;
  }
  ```
  ````

- [`diff`-benzeri sözdizimi ile sözdizimi vurgulamayı kombinleyin](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#combining-syntax-highlighting-with-diff-like-syntax):

  ```diff lang="js"
    function thisIsJavaScript() {
      // Tüm blok Javascript olarak vurgulanır,
      // yine de diff işaretleyicilerini ekleyebiliriz!
  -   console.log('Kaldırılan eski kod')
  +   console.log('Yeni ve dikkat çekici kod!')
    }
  ```

  ````md
  ```diff lang="js"
    function thisIsJavaScript() {
      // Tüm blok Javascript olarak vurgulanır,
      // yine de diff işaretleyicilerini ekleyebiliriz!
  -   console.log('Kaldırılan eski kod')
  +   console.log('Yeni ve dikkat çekici kod!')
    }
  ```
  ````

#### Çerçeve ve Başlıklar

Kod blokları, pencere benzeri çerçeve içerisinde işlenebilir.
Terminal penceresi gibi görünen bir çerçeve shell scripting dilleri için (örneğin `bash` ya da `sh`) kullanılır.
Diğer diller başlık içerirse kod editör tarzında olan bir çerçeve içerisinde görüntülenir.

Bir kod bloğunun zorunlu olmayan başlığı, kod bloğunun açık tırnak işareti ve dil belirtecinin ardından `title="..."` niteliği ile ya da kodun ilk satırındaki dosya ismi yourumuyla ayarlanabilir.

- [Yorum birile dosya ismi sekmesi ekleme](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-frames/README.md#adding-titles-open-file-tab-or-terminal-window-title)

  ```js
  // test-dosyam.js
  console.log('Merhaba Dünya!');
  ```

  ````md
  ```js
  // test-dosyam.js
  console.log('Merhaba Dünya!');
  ```
  ````

- [Terminal penceresine başlık ekleme](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-frames/README.md#adding-titles-open-file-tab-or-terminal-window-title)

  ```bash title="Bağımlılıklar yükleniyor…"
  npm install
  ```

  ````md
  ```bash title="Bağımlılıklar yükleniyor…"
  npm install
  ```
  ````

- [`frame="none"` ile pencere çerçevelerini etkisizleştir](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-frames/README.md#overriding-frame-types)

  ```bash frame="none"
  echo "Bu, bash dili kullanılmasına rağmen terminal olarak işlenmeyecektir"
  ```

  ````md
  ```bash frame="none"
  echo "Bu, bash dili kullanılmasına rağmen terminal olarak işlenmeyecektir"
  ```
  ````

## Detaylar

Detaylar (ayrıca "bildirimler" ya da "akordiyonlar" olarak da bilinir) konuyla ilgili içeriği gizlemek için kullanışlıdır.
Kullanıcılar kısa özete genişletmek ve tüm içeriği görebilmek için tıklayabilir.

Akordiyon parçacığı oluşturmak için Markdown içeriğinizdeki standart HTML [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) ve [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary) elemanlarını kullanın.

`<details>` elemanı içerisine herhangi bir Markdown sözdizimini yerleştirebilirsiniz.

<details>
<summary>Nerede ve ne zaman Andromeda takımyıldızı en çok görünür olur?</summary>

The [Andromeda takımyıldızı](<https://en.wikipedia.org/wiki/Andromeda_(constellation)>) en çok Kasım ayı boyunca geceleri `+90°` ve `−40°` arasındaki enlemde görünür.

</details>

```md
<details>
<summary>Nerede ve ne zaman Andromeda takımyıldızı en çok görünür olur?</summary>

The [Andromeda takımyıldızı](<https://en.wikipedia.org/wiki/Andromeda_(constellation)>) en çok Kasım ayı boyunca geceleri `+90°` ve `−40°` arasındaki enlemde görünür.

</details>
```

## Diğer ortak Markdown Özellikleri

Starlight, liste ve tablo gibi diğer tüm Markdown yazım sözdizimini destekler. [Markdown Rehberi'nden Markdown Kopya Kağıdı](https://www.markdownguide.org/cheat-sheet/)'na tüm Markdown sözdizimi elemanlarına hızlı bir genel bakış için göz atın.

## İleri Düzey Markdown ve MDX yapılandırması

Starlight, Astro'nun remark ve rehype üzerine kurulu Markdown ve MDX işleyicisini kullanır. Astro konfigürasyon dosyanıza `remarkPlugins` ya da `rehypePlugins` ekleyerek özel sözdizimi ve davranışlar için destek ekleyebilirsiniz. Daha fazlasını öğrenmek için Astro dokümantasyonundaki [“Markdown ve MDX Yapılandırma”](https://docs.astro.build/en/guides/markdown-content/#configuring-markdown-and-mdx) yazısına bakın.
