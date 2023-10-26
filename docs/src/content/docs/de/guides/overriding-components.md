---
title: Komponenten ersetzen
description: In Starlight kannst du eingebauten Komponenten ersetzen, um eigene Elemente in die Benutzeroberfläche deiner Dokumentationsseite einzufügen.
sidebar:
  badge: New
---

Starlight's Standard-UI und Konfigurationsoptionen sind so gestaltet, dass sie flexibel sind und für eine Reihe von Inhalten funktionieren. Ein Großteil des Standardaussehens von Starlight kann mit [CSS](/de/guides/css-and-tailwind/) und [Konfigurationsoptionen](/de/guides/customization/) angepasst werden.

Wenn du mehr brauchst als das, was von Haus aus möglich ist, unterstützt Starlight die Erstellung eigener Komponenten, um die Standardkomponenten zu erweitern oder zu ersetzen.

## Wann solltest du ersetzen

Die Standardkomponenten von Starlight zu überschreiben kann nützlich sein, wenn:

- Du das Aussehen eines Teils der Starlight-Benutzeroberfläche auf eine Weise ändern möchest, was mit [eigenem CSS](/de/guides/css-and-tailwind/) nicht möglich ist.
- Du das Verhalten eines Teils der Starlight-Benutzeroberfläche ändern möchtest.
- Du zusätzliche UI neben Starlights bestehender UI hinzufügen willst.

## Wie kann man das ersetzen

1. Wähle die Starlight-Komponente, die du überschreiben möchtest.
   Du kannst eine vollständige Liste der Komponenten in der [Komponenten-Ersetzung Referenz](/de/reference/overrides/) finden.

   In diesem Beispiel wird die Starlight-Komponente [`SocialIcons`](/de/reference/overrides/#socialicons) in der Navigationsleiste der Seite außer Kraft gesetzt.

2. Erstelle eine Astro-Komponente, mit der du die Starlight-Komponente ersetzt.
   Dieses Beispiel rendert einen Kontakt-Link.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">Schreib mir</a>
   ```

3. Sage Starlight, dass deine benutzerdefinierte Komponente in der Konfigurationsoption [`components`](/de/reference/configuration/#components) in `astro.config.mjs` verwendet werden soll:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'Meine Dokumentation nutzt eigene Komponenten',
         components: {
           // Ersetze den Standardkomponent `SocialIcons`
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## Eine integrierte Komponente wiederverwenden

Du kannst mit den Standard-UI-Komponenten von Starlight genauso arbeiten, wie du es mit deinen eigenen tun würdest: Importieren und Rendern in deinen eigenen benutzerdefinierten Komponenten. Dadurch kannst du die gesamte grundlegende Benutzeroberfläche von Starlight in deinem Design beibehalten und gleichzeitig zusätzliche Benutzeroberflächen hinzufügen.

Das folgende Beispiel zeigt eine benutzerdefinierte Komponente, die einen E-Mail-Link zusammen mit der Standardkomponente `SocialIcons` rendert:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">Schreib mir</a>
<Default {...Astro.props}><slot /></Default>
```

Beim Rendern einer integrierten Komponente innerhalb einer benutzerdefinierten Komponente:

- Verbreite „Astro.props“ darin. Dadurch wird sichergestellt, dass es alle Daten erhält, die es zum Rendern benötigt.
- Füge einen [`<slot />`](https://docs.astro.build/de/core-concepts/astro-components/#slots) innerhalb der Standardkomponente hinzu. Dadurch wird sichergestellt, dass Astro weiß, wo die Komponente gerendert werden muss, wenn der Komponente untergeordnete Elemente übergeben werden.

## Seitendaten verwenden

Beim Überschreiben einer Starlight-Komponente erhält deine benutzerdefinierte Implementierung ein Standardobjekt „Astro.props“, das alle Daten für die aktuelle Seite enthält.
Dadurch kannst du diese Werte verwenden, um zu steuern, wie deine Komponentenvorlage gerendert wird.

Beispielsweise kannst du die Frontmatter-Werte der Seite als `Astro.props.entry.data` lesen. Im folgenden Beispiel verwendet eine Ersatzkomponente [`PageTitle`](/de/reference/overrides/#pagetitle) dies, um den Titel der aktuellen Seite anzuzeigen:

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

Erfahre mehr über alle verfügbaren Requisiten in der [Komponenten-Ersetzung Referenz](/de/reference/overrides/#komponenteneigenschaften-props).

### Nur auf bestimmten Seiten überschreiben

Komponentenüberschreibungen gelten für alle Seiten. Du kannst jedoch bedingt mit Werten aus „Astro.props“ rendern, um zu bestimmen, wann deine benutzerdefinierte Benutzeroberfläche, wann die Standardbenutzeroberfläche von Starlight oder sogar etwas völlig anderes angezeigt werden soll.

Im folgenden Beispiel zeigt eine Komponente, die Starlights [`Footer`](/de/reference/overrides/#fußzeile) überschreibt, nur auf der Startseite „Verwendet Starlight 🌟“ an und zeigt ansonsten auf allen anderen Seiten die Standardfußzeile an:

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Verwendet Starlight 🌟</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

Weitere Informationen zum bedingten Rendering findest du im [Astro-Leitfaden zur Vorlagensyntax](https://docs.astro.build/de/core-concepts/astro-syntax/#dynamisches-html).
