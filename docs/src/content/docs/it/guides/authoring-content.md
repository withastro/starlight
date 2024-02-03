---
title: Creazione di contenuti in Markdown
description: Una panoramica della sintassi Markdown supportata da Starlight.
---

Starlight supporta l'intera sintassi [Markdown](https://daringfireball.net/projects/markdown/) nei file `.md` insieme al frontmatter [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) per definire metadati come il titolo e la descrizione.

Assicurarsi di guardare la [documentazione MDX](https://mdxjs.com/docs/what-is-mdx/#markdown) o la [documentazione Markdoc](https://markdoc.dev/docs/syntax) se si vogliono usare questi formati, dato che il supporto Markdown può variare.

## Frontmatter

You can customize individual pages in Starlight by setting values in their frontmatter.
Frontmatter is set at the top of your files between `---` separators:

```md title="src/content/docs/example.md"
---
title: My page title
---

Page content follows the second `---`.
```

Every page must include at least a `title`.
See the [frontmatter reference](/reference/frontmatter/) for all available fields and how to add custom fields.

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

Le immagini in Starlight utilizzano [l'ottimizzazione degli asset di Astro](https://docs.astro.build/it/guides/assets/).

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

Posso collegarmi alla [mia conclusione](#conclusione) che si trova più in basso.

## Conclusione

`https://my-site.com/page1/#introduzione` porta direttamente all'introduzione.
```

Titoli di livello 2 (`<h2>`) e di livello 3 (`<h3>`) verranno inclusi automaticamente nella tabella dei contenuti.

Learn more about how Astro processes heading `id`s in [the Astro Documentation](https://docs.astro.build/it/guides/markdown-content/#heading-ids)

## Aside

Gli aside (conosciuti anche come "ammonizioni" o "richiami") sono utili per indicare contenuti secondari insieme ai contenuti principali.

Starlight fornisce una sintassi Markdown personalizzata per indicarli. I blocchi aside sono indicati da `:::` per racchiudere i contenuti e possono essere di tipo `note`, `tip`, `caution` o `danger`.

Dentro un "aside" puoi inserire qualsiasi altro contenuto Markdown anche se sono più indicati per contenere poche informazioni.

### Note aside

:::note
Starlight è uno strumento per siti da documentazione con [Astro](https://astro.build/). Puoi iniziare con questo comando:

```sh
npm run create astro@latest -- --template starlight
```

:::

````md
:::note
Starlight è uno strumento per siti da documentazione con [Astro](https://astro.build/). Puoi iniziare con questo comando:

```sh
npm run create astro@latest -- --template starlight
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
Se non sei sicuro di voler un sito per documentazione fantastico, pensaci due volte prima di usare [Starlight](/it/).
:::

:::danger
Gli utenti potrebbero essere più produttivi e trovare il tuo prodotto più facile da usare grazie alle utili funzioni di Starlight.

- Navigazione chiara
- Temi configurabili dall'utente
- [Supporto per i18n](/it/guides/i18n)

:::

```md
:::caution
Se non sei sicuro di voler un sito per documentazione fantastico, pensaci due volte prima di usare [Starlight](/it/).
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

### Expressive Code features

Starlight uses [Expressive Code](https://github.com/expressive-code/expressive-code/tree/main/packages/astro-expressive-code) to extend formatting possibilities for code blocks.
Expressive Code’s text markers and window frames plugins are enabled by default.
Code block rendering can be configured using Starlight’s [`expressiveCode` configuration option](/reference/configuration/#expressivecode).

#### Text markers

You can highlight specific lines or parts of your code blocks using [Expressive Code text markers](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#usage-in-markdown--mdx-documents) on the opening line of your code block.
Use curly braces (`{ }`) to highlight entire lines, and quotation marks to highlight strings of text.

There are three highlighting styles: neutral for calling attention to code, green for indicating inserted code, and red for indicating deleted code.
Both text and entire lines can be marked using the default marker, or in combination with `ins=` and `del=` to produce the desired highlighting.

Expressive Code provides several options for customizing the visual appearance of your code samples.
Many of these can be combined, for highly illustrative code samples.
Please explore the [Expressive Code documentation](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md) for the extensive options available.
Some of the most common examples are shown below:

- [Mark entire lines & line ranges using the `{ }` marker](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#marking-entire-lines--line-ranges):

  ```js {2-3}
  function demo() {
    // This line (#2) and the next one are highlighted
    return 'This is line #3 of this snippet';
  }
  ```

  ````md
  ```js {2-3}
  function demo() {
    // This line (#2) and the next one are highlighted
    return 'This is line #3 of this snippet';
  }
  ```
  ````

- [Mark selections of text using the `" "` marker or regular expressions](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#marking-individual-text-inside-lines):

  ```js "Individual terms" /Even.*supported/
  // Individual terms can be highlighted, too
  function demo() {
    return 'Even regular expressions are supported';
  }
  ```

  ````md
  ```js "Individual terms" /Even.*supported/
  // Individual terms can be highlighted, too
  function demo() {
    return 'Even regular expressions are supported';
  }
  ```
  ````

- [Mark text or lines as inserted or deleted with `ins` or `del`](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#selecting-marker-types-mark-ins-del):

  ```js "return true;" ins="inserted" del="deleted"
  function demo() {
    console.log('These are inserted and deleted marker types');
    // The return statement uses the default marker type
    return true;
  }
  ```

  ````md
  ```js "return true;" ins="inserted" del="deleted"
  function demo() {
    console.log('These are inserted and deleted marker types');
    // The return statement uses the default marker type
    return true;
  }
  ```
  ````

- [Combine syntax highlighting with `diff`-like syntax](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-text-markers/README.md#combining-syntax-highlighting-with-diff-like-syntax):

  ```diff lang="js"
    function thisIsJavaScript() {
      // This entire block gets highlighted as JavaScript,
      // and we can still add diff markers to it!
  -   console.log('Old code to be removed')
  +   console.log('New and shiny code!')
    }
  ```

  ````md
  ```diff lang="js"
    function thisIsJavaScript() {
      // This entire block gets highlighted as JavaScript,
      // and we can still add diff markers to it!
  -   console.log('Old code to be removed')
  +   console.log('New and shiny code!')
    }
  ```
  ````

#### Frames and titles

Code blocks can be rendered inside a window-like frame.
A frame that looks like a terminal window will be used for shell scripting languages (e.g. `bash` or `sh`).
Other languages display inside a code editor-style frame if they include a title.

A code block’s optional title can be set either with a `title="..."` attribute following the code block's opening backticks and language identifier, or with a file name comment in the first lines of the code.

- [Add a file name tab with a comment](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-frames/README.md#adding-titles-open-file-tab-or-terminal-window-title)

  ```js
  // my-test-file.js
  console.log('Hello World!');
  ```

  ````md
  ```js
  // my-test-file.js
  console.log('Hello World!');
  ```
  ````

- [Add a title to a Terminal window](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-frames/README.md#adding-titles-open-file-tab-or-terminal-window-title)

  ```bash title="Installing dependencies…"
  npm install
  ```

  ````md
  ```bash title="Installing dependencies…"
  npm install
  ```
  ````

- [Disable window frames with `frame="none"`](https://github.com/expressive-code/expressive-code/blob/main/packages/%40expressive-code/plugin-frames/README.md#overriding-frame-types)

  ```bash frame="none"
  echo "This is not rendered as a terminal despite using the bash language"
  ```

  ````md
  ```bash frame="none"
  echo "This is not rendered as a terminal despite using the bash language"
  ```
  ````

## Altre funzionalità Markdown utili

Starlight supporta tutte le altre funzionalità Markdown, come liste e tabelle. Guarda la [Markdown Cheat Sheet da The Markdown Guide](https://www.markdownguide.org/cheat-sheet/) per una panoramica veloce su tutte le funzionalità Markdown.

## Advanced Markdown and MDX configuration

Starlight uses Astro’s Markdown and MDX renderer built on remark and rehype. You can add support for custom syntax and behavior by adding `remarkPlugins` or `rehypePlugins` in your Astro config file. See [“Configuring Markdown and MDX”](https://docs.astro.build/en/guides/markdown-content/#configuring-markdown-and-mdx) in the Astro docs to learn more.
