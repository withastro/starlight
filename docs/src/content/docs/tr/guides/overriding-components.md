---
title: Bileşenleri Geçersiz Kılma
description: Starlight'ın yerleşik bileşenlerini geçersiz kılma ve belgelerinizin kullanıcı arayüzüne özel öğeler eklemek için nasıl yapılacağını öğrenin.
sidebar:
  badge: New
---

Starlight'ın varsayılan kullanıcı arayüzü ve yapılandırma seçenekleri, çeşitli içerikler için esnek olacak şekilde tasarlanmıştır. Starlight'ın varsayılan görünümünün büyük bir kısmı özel [CSS](/guides/css-and-tailwind/) ve [yapılandırma seçenekleri](/guides/customization/) ile özelleştirilebilir.

Kutudan çıkabileceklerin ötesinde daha fazlasına ihtiyacınız olduğunda, Starlight, varsayılan bileşenlerini genişletmek veya geçersiz kılmak (tamamen değiştirmek) için kendi özel bileşenlerinizi oluşturmanızı destekler.

## Ne Zaman Geçersiz Kılmak Gereklidir

Starlight'ın varsayılan bileşenlerini geçersiz kılmak, aşağıdaki durumlarda faydalı olabilir:

- Starlight'ın kullanıcı arayüzünün bir bölümünün görünümünü [özel CSS](/guides/css-and-tailwind/) ile değiştirmek mümkün olmadığında.
- Starlight'ın kullanıcı arayüzünün bir bölümünün davranışını değiştirmek istediğinizde.
- Starlight'ın mevcut kullanıcı arayüzüne ek olarak bazı ek kullanıcı arayüzü eklemek istediğinizde.

## Geçersiz Kılma Nasıl Yapılır

1. Geçersiz kılmak istediğiniz Starlight bileşenini seçin.
   Tüm bileşenlerin tam listesini [Geçersiz Kılma Referansı](/reference/overrides/) sayfasında bulabilirsiniz.

   Bu örnek, sayfa gezinme çubuğundaki Starlight'ın [`SocialIcons`](/reference/overrides/#socialicons) bileşenini geçersiz kılacak.

2. Starlight bileşenini değiştirmek için kullanılacak bir Astro bileşeni oluşturun.
   Bu örnek bir iletişim bağlantısı oluşturur. 

   ```astro
  ---
  // src/components/EmailLink.astro
  import type { Props } from '@astrojs/starlight/props';
  ---

  <a href="mailto:houston@example.com">Bana E-posta Gönder</a>
   ```

3. Starlight'ın özel bileşeninizi kullanmasını sağlamak için, `astro.config.mjs` dosyasındaki [`components`](/reference/configuration/#components) yapılandırma seçeneğinde özel bileşeninizi belirtin:

   ```js {9-12}
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
  import starlight from '@astrojs/starlight';

  export default defineConfig({
    integrations: [
      starlight({
        title: 'Geçersiz Kılmalarla Benim Belgelerim',
        components: {
          // Varsayılan `SocialIcons` bileşenini geçersiz kıl.
          SocialIcons: './src/components/EmailLink.astro',
        },
      }),
    ],
  });
   ```

## Dahili Bir Bileşeni Yeniden Kullanın

Kendi özel bileşenlerinizle olduğu gibi Starlight'ın varsayılan kullanıcı arayüz bileşenleriyle de yapabilirsiniz: bunları içe aktarıp kendi özel bileşenlerinizde kullanabilirsiniz. Bu, tasarımınızın içinde Starlight'ın temel kullanıcı arayüzünü tutarken, onların yanına ekstra kullanıcı arayüzü eklemenize olanak tanır.

Aşağıdaki örnek, varsayılan `SocialIcons` bileşeniyle birlikte bir e-posta bağlantısı oluşturan özel bir bileşeni göstermektedir:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">Bana E-posta Gönder</a>
<Default {...Astro.props}><slot /></Default>
```

Özel bir bileşeni özel bir bileşen içinde yeniden oluştururken:

- `Astro.props`'ı içine yayın. Bu, bileşenin ihtiyaç duyduğu tüm verileri almasını sağlar.
- Varsayılan bileşenin içine bir [`<slot />`](https://docs.astro.build/en/core-concepts/astro-components/#slots) ekleyin. Bu, bileşenin herhangi bir çocuk öğeyi geçirilirse, Astro'nun bunları nerede render etmesi gerektiğini bilmesini sağlar.


## Sayfa Verilerini Kullanın

Starlight bileşenini geçersiz kıldığınızda, özel uygulamanız mevcut sayfanın tüm verilerini içeren standart bir `Astro.props` nesnesini alır.
Bu, bileşen şablonunuzun nasıl görüntülenmesi gerektiğini kontrol etmek için bu değerleri kullanmanıza olanak tanır.

Örneğin, sayfanın frontmatter değerlerini `Astro.props.entry.data` olarak okuyabilirsiniz. Aşağıdaki örnekte, bir [`PageTitle`](/reference/overrides/#pagetitle) bileşeninin yerine kullanılan bir bileşen, mevcut sayfanın başlığını görüntülemek için bunu kullanır:

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

Kullanılabilir tüm props hakkında daha fazla bilgi için [Geçersiz Kılma Referansı](/reference/overrides/#component-props) sayfasına bakın.

### Yalnızca Belirli Sayfalarda Geçersiz Kılma

Bileşen geçersiz kılmaları tüm sayfalara uygulanır. Ancak, `Astro.props` değerlerini kullanarak özel kullanıcı arayüzünüzü ne zaman göstereceğinizi, Starlight'ın varsayılan kullanıcı arayüzünü ne zaman göstereceğinizi veya tamamen farklı bir şey göstereceğinizi belirlemek için kullanabilirsiniz.

Aşağıdaki örnekte, Starlight'ın [`Footer`](/reference/overrides/#footer-1) bileşenini geçersiz kılma, yalnızca ana sayfada "Starlight ile oluşturuldu 🌟" görüntüler ve aksi takdirde tüm diğer sayfalarda varsayılan altbilgiyi gösterir:

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Starlight ile oluşturuldu 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Dinamik HTML hakkında daha fazla bilgi için [Astro'nun Şablon Söz Dizimi rehberine](https://docs.astro.build/en/core-concepts/astro-syntax/#dynamic-html) bakın.
