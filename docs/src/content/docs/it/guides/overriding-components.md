---
title: Sostituzione dei componenti
description: Scopri come sovrascrivere i componenti integrati di Starlight per aggiungere elementi personalizzati all'interfaccia utente del tuo sito di documentazione.
sidebar:
  badge: Nuovo
---

L'interfaccia utente predefinita e le opzioni di configurazione di Starlight sono progettate per essere flessibili e funzionare con una vasta gamma di contenuti. Gran parte dell'aspetto predefinito di Starlight può essere personalizzato con [CSS](/it/guides/css-and-tailwind/) e [opzioni di configurazione](/it/guides/customization/).

Quando hai bisogno di più di ciò che è possibile fare di base, Starlight supporta la creazione di componenti personalizzati per estendere o sovrascrivere (sostituire completamente) i suoi componenti predefiniti.

## Quando eseguire una sostituzione

Sostituire i componenti predefiniti di Starlight può essere utile quando:

- Desideri modificare l'aspetto di una parte dell'interfaccia utente di Starlight in un modo non possibile con [CSS personalizzato](/it/guides/css-and-tailwind/).
- Vuoi cambiare il comportamento di una parte dell'interfaccia utente di Starlight.
- Vuoi aggiungere qualche interfaccia utente aggiuntiva accanto all'interfaccia utente esistente di Starlight.

## Come eseguire una sostituzione

1. Scegli il componente Starlight che desideri sovrascrivere.
   È possibile trovare un elenco completo dei componenti nel [Riferimento alle sostituzioni](/it/reference/overrides/).

   Questo esempio sovrascriverà il componente [`SocialIcons`](/it/reference/overrides/#socialicons) di Starlight nella barra di navigazione della pagina.

2. Creare un componente Astro con cui sostituire il componente Starlight.
   Questo esempio esegue il rendering di un collegamento di contatto.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">Inviami un'e-mail</a>
   ```

3. Specifica a Starlight di utilizzare il tuo componente personalizzato nell'opzione di configurazione [`components`](/it/reference/configuration/#components) in `astro.config.mjs`:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'La Mia Documentazione con Sostituzioni',
         components: {
           // Sostituisce il componente `SocialIcons` predefinito.
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Riutilizza un componente integrato

Puoi creare con i componenti dell'interfaccia utente predefiniti di Starlight proprio come faresti con i tuoi: importandoli e renderizzandoli nei tuoi componenti personalizzati. Ciò ti consente di mantenere tutta l'interfaccia utente di base di Starlight all'interno del tuo progetto, aggiungendo al contempo un'interfaccia utente aggiuntiva.

L'esempio seguente mostra un componente personalizzato che esegue il rendering di un collegamento di posta elettronica insieme al componente `SocialIcons` predefinito:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">Inviami un'e-mail</a>
<Default {...Astro.props}><slot /></Default>
```

Quando si esegue il rendering di un componente integrato all'interno di un componente personalizzato:

- Distribuisci `Astro.props` al suo interno. Ciò garantisce che riceva tutti i dati necessari per il rendering.
- Aggiungi un [`<slot />`](https://docs.astro.build/it/core-concepts/astro-components/#slots) all'interno del componente predefinito. Ciò garantisce che se al componente vengono passati elementi figlio, Astro sa dove renderizzarli.

## Utilizza i dati della pagina

Quando sostituisci un componente Starlight, la tua implementazione personalizzata riceve un oggetto standard `Astro.props` contenente tutti i dati per la pagina corrente.
Ciò ti consente di utilizzare questi valori per controllare il modo in cui viene eseguito il rendering del modello di componente.

Ad esempio, puoi leggere i valori frontmatter della pagina come `Astro.props.entry.data`. Nell'esempio seguente, un componente sostitutivo [`PageTitle`](/it/reference/overrides/#pagetitle) lo utilizza per visualizzare il titolo della pagina corrente:

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

Scopri di più su tutti gli oggetti di scena disponibili nel [Riferimento agli override](/it/reference/overrides/#proprietà-dei-componenti).

### Sostituisci solo su pagine specifiche

Le sostituzioni dei componenti si applicano a tutte le pagine. Tuttavia, puoi eseguire il rendering in modo condizionale utilizzando i valori di `Astro.props` per determinare quando mostrare la tua interfaccia utente personalizzata, quando mostrare l'interfaccia utente predefinita di Starlight o anche quando mostrare qualcosa di completamente diverso.

Nell'esempio seguente, un componente che sovrascrive il [`Footer`](/it/reference/overrides/#footer) di Starlight visualizza "Costruito con Starlight 🌟" solo sulla home page e altrimenti mostra il piè di pagina predefinito su tutte le altre pagine:

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Costruito con Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Scopri di più sul rendering condizionale nella [Guida alla sintassi dei modelli di Astro](https://docs.astro.build/it/core-concepts/astro-syntax/#dynamic-html).
