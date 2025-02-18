---
title: Referensi Frontmatter
description: Ikhtisar bidang frontmatter bawaan yang didukung Starlight.
---

Anda dapat menyesuaikan masing-masing halaman Markdown dan MDX di Starlight dengan menetapkan nilai di frontmatter. Sebagai contoh, halaman biasa dapat mengatur bidang `title` dan `description`:

```md {3-4}
---
# src/content/docs/example.md
title: Tentang proyek ini
description: Pelajari lebih lanjut tentang proyek yang sedang Saya kerjakan.
---

Selamat datang di halaman Tentang!
```

## Bidang Frontmatter

### `title` (diperlukan)

**tipe:** `string`

Anda harus memberikan judul untuk setiap halaman. Ini akan ditampilkan di bagian atas halaman, di tab browser, dan di metadata halaman.

### `description`

**tipe:** `string`

Deskripsi halaman digunakan untuk metadata halaman dan akan diambil oleh mesin pencari dan dalam pratinjau media sosial.

### `slug`

**tipe**: `string`

Ganti slug halaman. Lihat [“Mendefinisikan slug khusus”](https://docs.astro.build/en/guides/content-collections/#defining-custom-slugs) di dokumentasi Astro untuk detail lebih lanjut.

### `editUrl`

**tipe:** `string | boolean`

Mengesampingkan [konfigurasi `editLink` global](/id/reference/configuration/#editlink). Atur ke `false` untuk menonaktifkan tautan "Edit halaman" untuk halaman tertentu atau memberikan URL alternatif di mana konten halaman ini dapat diedit.

### `head`

**tipe:** [`HeadConfig[]`](/id/reference/configuration/#headconfig)

Anda dapat menambahkan tag tambahan ke `<head>` halaman Anda menggunakan bidang `head` frontmatter. Ini berarti Anda dapat menambahkan gaya khusus, metadata, atau tag lain ke satu halaman. Mirip dengan [opsi `head` global](/id/reference/configuration/#head).

```md
---
# src/content/docs/example.md
title: Tentang kami
head:
  # Gunakan tag <title> khusus
  - tag: title
    content: Halaman tentang khusus
---
```

### `tableOfContents`

**tipe:** `false | { minHeadingLevel?: number; maxHeadingLevel?: number; }`

Mengesampingkan [konfigurasi `tableOfContents` global](/id/reference/configuration/#tableofcontents).
Sesuaikan tingkat judul yang akan disertakan atau atur ke `false` untuk menyembunyikan daftar isi pada halaman ini.

```md
---
# src/content/docs/example.md
title: Halaman dengan hanya H2 dalam daftar isi
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 2
---
```

```md
---
# src/content/docs/example.md
title: Halaman tanpa daftar isi
tableOfContents: false
---
```

### `template`

**tipe:** `'doc' | 'splash'`  
**bawaan:** `'doc'`

Atur templat tata letak untuk halaman ini.
Halaman menggunakan tata letak `'doc'` secara _default_.
Atur ke `'splash'` untuk menggunakan tata letak yang lebih lebar tanpa _sidebar_ yang dirancang untuk _landing pages_.

### `hero`

**tipe:** [`HeroConfig`](#heroconfig)

Tambahkan komponen _hero_ ke bagian atas halaman ini. Berfungsi dengan baik dengan `template: splash`.

Sebagai contoh, konfigurasi ini menampilkan beberapa opsi umum, termasuk memuat gambar dari repositori Anda.

```md
---
# src/content/docs/example.md
title: Halaman Beranda Saya
template: splash
hero:
  title: 'Proyek Saya: Stellar Stuff Sooner'
  tagline: Bawa barang-barang Anda ke bulan dan kembali dalam sekejap mata.
  image:
    alt: Logo yang berkilauan dan berwarna cerah
    file: ../../assets/logo.png
  actions:
    - text: Ceritakan lebih banyak
      link: /getting-started/
      icon: right-arrow
    - text: Lihat di GitHub
      link: https://github.com/astronaut/my-project
      icon: external
      variant: minimal
      attrs:
        rel: me
---
```

Anda dapat menampilkan versi gambar _hero_ yang berbeda dalam mode terang dan gelap.

```md
---
# src/content/docs/example.md
hero:
  image:
    alt: Logo yang berkilauan dan berwarna cerah
    dark: ~/assets/logo-dark.png
    light: ~/assets/logo-light.png
---
```

#### `HeroConfig`

```ts
interface HeroConfig {
  title?: string;
  tagline?: string;
  image?:
    | {
        // Path relatif ke gambar di repositori Anda.
        file: string;
        // Teks alternatif untuk membuat gambar dapat diakses oleh teknologi bantu
        alt?: string;
      }
    | {
        // Path relatif ke gambar di repositori Anda yang akan digunakan untuk mode gelap.
        dark: string;
        // Path relatif ke gambar di repositori Anda yang akan digunakan untuk mode terang.
        light: string;
        // Teks alternatif untuk membuat gambar dapat diakses oleh teknologi bantu
        alt?: string;
      }
    | {
        // HTML mentah (raw) untuk digunakan dalam slot gambar.
        // Bisa berupa tag `<img>` khusus atau tag `<svg>` sebaris.
        html: string;
      };
  actions?: Array<{
    text: string;
    link: string;
    variant?: 'primary' | 'secondary' | 'minimal';
    icon?: string;
    attrs?: Record<string, string | number | boolean>;
  }>;
}
```

### `banner`

**tipe:** `{ content: string }`

Menampilkan _banner_ pengumuman di bagian atas halaman ini.

Nilai `content` dapat berupa HTML untuk tautan atau konten lainnya.
Sebagai contoh, halaman ini menampilkan spanduk yang menyertakan tautan ke `example.com`.

```md
---
# src/content/docs/example.md
title: Halaman dengan banner
banner:
  content: |
    Kami baru saja meluncurkan sesuatu yang keren!
    <a href="https://example.com">Lihatlah</a>
---
```

### `lastUpdated`

**tipe:** `Date | boolean`

Mengesampingkan [opsi `lastUpdated` global](/id/reference/configuration/#lastupdated). Jika tanggal ditentukan, tanggal tersebut harus berupa [stempel waktu YAML](https://yaml.org/type/timestamp.html) yang valid dan akan menimpa tanggal yang tersimpan dalam riwayat Git untuk halaman ini.

```md
---
# src/content/docs/example.md
title: Halaman dengan tanggal pembaruan terakhir khusus
lastUpdated: 2022-08-09
---
```

### `prev`

**tipe:** `boolean | string | { link?: string; label?: string }`

Mengesampingkan [opsi `pagination` global](/id/reference/configuration/#pagination). Jika string ditentukan, teks tautan yang dihasilkan akan diganti dan jika objek ditentukan, tautan dan teks akan ditimpa.

```md
---
# src/content/docs/example.md
# Menyembunyikan tautan halaman sebelumnya
prev: false
---
```

```md
---
# src/content/docs/example.md
# Mengganti teks tautan halaman sebelumnya
prev: lanjutkan tutorial
---
```

```md
---
# src/content/docs/example.md
# Mengabaikan tautan dan teks halaman sebelumnya
prev:
  link: /halaman-yang-tidak-berkaitkan/
  label: Lihat halaman lainnya
---
```

### `next`

**tipe:** `boolean | string | { link?: string; label?: string }`

Sama seperti [`prev`](#prev) tetapi untuk tautan halaman berikutnya.

```md
---
# src/content/docs/example.md
# Menyembunyikan tautan halaman berikutnya
next: false
---
```

### `pagefind`

**tipe:** `boolean`  
**bawaan:** `true`

Mengatur apakah halaman ini harus disertakan dalam indeks pencarian [Pagefind](https://pagefind.app). Atur ke `false` untuk mengecualikan halaman dari hasil pencarian:

```md
---
# src/content/docs/example.md
# Sembunyikan halaman ini dari indeks pencarian
pagefind: false
---
```

### `draft`

**tipe:** `boolean`  
**bawaan:** `false`

Tetapkan apakah halaman ini harus dianggap sebagai draf dan tidak disertakan dalam [versi produksi](https://docs.astro.build/en/reference/cli-reference/#astro-build) dan [grup tautan yang dibuat secara otomatis](/id/guides/sidebar/#grup-grup-yang-dihasilkan-secara-otomatis). Ubah ke `true` untuk menandai halaman sebagai draf dan membuatnya hanya terlihat selama masa pengembangan.

```md
---
# src/content/docs/example.md
# Kecualikan halaman ini dari versi produksi
draft: true
---
```

### `sidebar`

**tipe:** [`SidebarConfig`](#sidebarconfig)

Mengontrol bagaimana halaman ini ditampilkan di [_sidebar_](/id/reference/configuration/#sidebar), saat menggunakan grup tautan yang dibuat secara otomatis.

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

**tipe:** `string`  
**bawaan:** [`title`](#title-diperlukan) halaman

Atur label untuk halaman ini di _sidebar_ saat ditampilkan dalam grup tautan yang dibuat secara otomatis.

```md
---
# src/content/docs/example.md
title: Tentang proyek ini
sidebar:
  label: Tentang
---
```

#### `order`

**tipe:** `number`

Mengontrol urutan halaman ini saat mengurutkan grup tautan yang dibuat secara otomatis.
Nomor yang lebih rendah ditampilkan lebih tinggi dalam grup tautan.

```md
---
# src/content/docs/example.md
title: Halaman yang akan ditampilkan pertama kali
sidebar:
  order: 1
---
```

#### `hidden`

**tipe:** `boolean`  
**bawaan:** `false`

Mencegah halaman ini disertakan dalam grup _sidebar_ yang dibuat secara otomatis.

```md
---
# src/content/docs/example.md
title: Halaman yang disembunyikan dari sidebar yang dibuat secara otomatis
sidebar:
  hidden: true
---
```

#### `badge`

**tipe:** <code>string | <a href="/id/reference/configuration/#badgeconfig">BadgeConfig</a></code>

Menambahkan _badge_ ke halaman di _sidebar_ saat ditampilkan dalam grup tautan yang dibuat secara otomatis.
Saat menggunakan string, _badge_ akan ditampilkan dengan warna aksen bawaan.
Secara opsional, berikan [objek `BadgeConfig`](/id/reference/configuration/#badgeconfig) dengan bidang `text`, `variant`, dan `class` untuk menyesuaikan _badge_.

```md
---
# src/content/docs/example.md
title: Halaman dengan badge
sidebar:
  # Menggunakan varian bawaan yang sesuai dengan warna aksen situs Anda
  badge: Baru
---
```

```md
---
# src/content/docs/example.md
title: Halaman badge
sidebar:
  badge:
    text: Eksperimental
    variant: caution
---
```

#### `attrs`

**tipe:** `Record<string, string | number | boolean | undefined>`

Atribut HTML untuk ditambahkan ke tautan halaman di _sidebar_ saat ditampilkan dalam grup tautan yang dibuat secara otomatis.

```md
---
# src/content/docs/example.md
title: Membuka halaman di tab baru
sidebar:
  # Membuka halaman di tab baru
  attrs:
    target: _blank
---
```

## Sesuaikan skema frontmatter

Skema frontmatter untuk koleksi konten `docs` Starlight dikonfigurasikan dalam `src/content/config.ts` menggunakan helper `docsSchema()`:

```ts {3,6}
// src/content/config.ts
import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
};
```

Pelajari selengkapnya tentang koleksi skema konten di [“Mendefinisikan koleksi skema”](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema) di dokumentasi Astro.

`docsSchema()` memiliki opsi berikut:

### `extend`

**tipe:** Skema Zod atau fungsi yang mengembalikan skema Zod  
**bawaan:** `z.object({})`

Pengembangan skema Starlight dengan kolom tambahan dengan menyetel `extend` dalam opsi `docsSchema()`.
Nilainya harus berupa [skema Zod](https://docs.astro.build/en/guides/content-collections/#defining-datatypes-with-zod).

Dalam contoh berikut, kami menyediakan tipe yang lebih ketat untuk `description` agar menjadi wajib dan menambahkan kolom `category` opsional baru:

```ts {8-13}
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        // Jadikan kolom bawaan sebagai wajib, bukan opsional.
        description: z.string(),
        // Tambahkan kolom baru ke skema.
        category: z.enum(['tutorial', 'guide', 'reference']).optional(),
      }),
    }),
  }),
};
```

Untuk memanfaatkan [_Astro `image()` helper_](https://docs.astro.build/en/guides/images/#images-in-content-collections), gunakan fungsi yang mengembalikan ekstensi skema Anda:

```ts {8-13}
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: ({ image }) => {
        return z.object({
          // Tambahkan kolom yang harus dilengkapi ke gambar lokal.
          cover: image(),
        });
      },
    }),
  }),
};
```
