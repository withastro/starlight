---
title: Creazione di contenuti in Markdown
description: Una panoramica della sintassi Markdown supportata da Starlight.
---

Starlight supporta l'intera sintassi [Markdown](https://daringfireball.net/projects/markdown/) nei file `.md` insieme al frontmatter [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) per definire metadati come il titolo e la descrizione.

Assicurarsi di guardare la [documentazione MDX](https://mdxjs.com/docs/what-is-mdx/#markdown) o la [documentazione Markdoc](https://markdoc.dev/docs/syntax) se si vogliono usare questi formati, dato che il supporto Markdown può variare.

## Stili in linea

Il testo può essere **grassetto**, _corsivo_, o ~~barrato~~.

```md
Il testo può essere **grassetto**, _corsivo_, o ~~barrato~~.
```

Puoi [aggiungere un link ad un'altra pagina](/it/getting-started/).

```md
Puoi [aggiungere un link ad un'altra pagina](/it/getting-started/).
```

Puoi evidenziare `codice in linea` con apici inversi.

```md
Puoi evidenziare `codice in linea` con apici inversi.
```

## Immagini

Le immagini in Starlight utilizzano l'ottimizzazione degli asset di Astro.

Markdown e MDX supportano la sintassi Markdown per rappresentare immagini che includono testo alternativo per le tecnologie assistive.

![Un'illustrazione di pianeti e stelle con la scritta "astro"](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![Un'illustrazione di pianeti e stelle con la scritta "astro"](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

I percorsi relativi sono supportati per immagini salvate localmente nel tuo progetto.

```md
// src/content/docs/page-1.md

![Un'astronave nello spazio](../../assets/images/rocket.svg)
```

## Titoli

Puoi strutturare i contenuti utilizzando dei titoli. In Markdown sono indicati dal numero di `#` all'inizio della linea.

### Come strutturare i contenuti della pagina in Starlight

Starlight è configurato per utilizzare automaticamente il titolo della pagina come intestazione e includerà una "Panoramica" in alto per ogni tabella dei contenuti. Si raccomanda di iniziare ogni pagina con un paragrafo e di usare titoli a partire da `<h2>`:

```md
---
title: Guida Markdown
description: Come utilizzare Markdown in Starlight
---

Questa pagina descrive come utilizzare Markdown in Starlight.

## Stili in linea

## Titoli
```

### Link titoli automatici

Utilizzando titoli in Markdown verranno generati automaticamente i rispettivi link per navigare velocemente in certe sezioni della tua pagina:

```md
---
title: La mia pagina dei contenuti
description: Come utilizzare i link automatici di Starlight
---

## Introduzione

Posso collegarmi alla [conclusione](#conclusione) che si trova più in basso.

## Conclusione

`https://my-site.com/page1/#introduzione` porta direttamente all'introduzione.
```

Titoli di livello 2 (`<h2>`) e di livello 3 (`<h3>`) verranno inclusi automaticamente nella tabella dei contenuti.

## Asides

Gli aside (conosciuti anche come "richiami") sono utili per indicare contenuti secondari insieme ai contenuti principali.

Starlight fornisce una sintassi Markdown personalizzata per indicarli. I blocchi aside sono indicati da `:::` per racchiudere i contenuti e possono essere di tipo `note`, `tip`, `caution` o `danger`.

Dentro un "aside" puoi inserire qualsiasi altro contenuto Markdown anche se sono più indicati per contenere poche informazioni.

### Note aside

:::note
Starlight è uno strumento per siti da documentazione con [Astro](https://astro.build/). Puoi iniziare con questo comando:

```sh
npm run create astro@latest --template starlight
```

:::

````md
:::note
Starlight è uno strumento per siti da documentazione con [Astro](https://astro.build/).
Puoi iniziare con questo comando:

```sh
npm run create astro@latest --template starlight
```

:::
````

### Titoli aside personalizzati

Si può specificare un titolo personalizzato per gli aside in parentesi quadre dopo aver specificato il tipo di aside, per esempio `:::tip[Lo sapevi?]`.

:::tip[Lo sapevi?]
Astro ti aiuta a costruire siti più veloci con ["Islands Architecture"](https://docs.astro.build/en/concepts/islands/).
:::

```md
:::tip[Lo sapevi?]
Astro ti aiuta a costruire siti più veloci con ["Islands Architecture"](https://docs.astro.build/en/concepts/islands/).
:::
```

### Altri tipi di aside

Gli aside caution e danger sono d'aiuto per richiamare l'attenzione dell'utente a dettagli che potrebbero sorprenderli.
Se ti ritrovi ad usarli spesso, potrebbe essere segno che quelo che stai documentando potrebbe trarre beneficio da una riprogettazione.

:::caution
Se non sei sicuro di voler un sito per documentazione fantastico, pensaci due volte prima di usare [Starlight](../../../).
:::

:::danger
Gli utenti potrebbero essere più produttivi e trovare il tuo prodotto più facile da usare grazie alle utili funzioni di Starlight.

- Navigazione chiara
- Temi configurabili dall'utente
- [Supporto per i18n](/it/guides/i18n)

:::

```md
:::caution
Se non sei sicuro di voler un sito per documentazione fantastico, pensaci due volte prima di usare [Starlight](../../../).
:::

:::danger
Gli utenti potrebbero essere più produttivi e trovare il tuo prodotto più facile da usare grazie alle utili funzioni di Starlight.

- Navigazione chiara
- Temi configurabili dall'utente
- [Supporto per i18n](/it/guides/i18n)

:::
```

## Citazioni

> Questo è un blockquote, che di solito viene utilizzato per citazioni di persone o documenti.
>
> I blockquote sono indicati da `>` all'inizio di ogni riga.

```md
> Questo è un blockquote, che di solito viene utilizzato per citazioni di persone o documenti.
>
> I blockquote sono indicati da `>` all'inizio di ogni riga.
```

## Blocchi codice

Un blocco di codice è indicato da tre backtick <code>```</code> all'inizio e alla fine. Puoi indicare il linguaggio di programmazione dopo i primi backtick.

```js
// Codice JavaScript con sintassi evidenziata.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// Codice JavaScript con sintassi evidenziata.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
I blocchi lunghi su una linea sola non vanno a capo. Se sono troppo lunghi si può scrollare orizzontalmente. Questo dovrebbe essere abbastanza lungo per dimostrarlo.
```

## Altre funzionalità Markdown utili

Starlight supporta tutte le altre funzionalità Markdown, come liste e tabelle. Guarda la [Markdown Cheat Sheet da The Markdown Guide](https://www.markdownguide.org/cheat-sheet/) per una panoramica veloce su tutte le funzionalità Markdown.
