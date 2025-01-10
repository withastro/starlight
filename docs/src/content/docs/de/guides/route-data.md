---
title: Routendaten
description: Erfahre, wie das Seitendatenmodell von Starlight zum Rendern deiner Seiten verwendet wird und wie du es anpassen kannst.
---

Wenn Starlight eine Seite in deiner Dokumentation rendert, erstellt es zunächst ein Routendatenobjekt, das den Inhalt der Seite darstellt.
In diesem Leitfaden wird erklärt, wie Routendaten erzeugt werden, wie sie verwendet werden und wie du sie anpassen kannst, um das Standardverhalten von Starlight zu ändern.

## Was sind Routendaten?

Starlight-Routendaten sind ein Objekt, das für jede Seite deiner Website erstellt wird, indem die folgenden Teile deines Projekts kombiniert werden:

1. Die Starlight-Konfiguration in `astro.config.mjs`
2. Der Inhalt und das Frontmatter der aktuellen Seite

Die Routendaten enthalten zum Beispiel eine Eigenschaft `siteTitle` mit einem Wert, der auf der Option [`title`](/de/reference/configuration/#title-erforderlich) in deiner Starlight-Konfiguration basiert, und eine Eigenschaft `toc`, die aus Überschriften im Inhalt der aktuellen Seite generiert wird.

Einige Funktionen können sowohl global in der Starlight-Konfiguration als auch für eine bestimmte Seite in Markdown Frontmatter konfiguriert werden.
Die im Frontmatter für eine bestimmte Seite festgelegten Werte überschreiben in diesem Fall die globalen oder Standardwerte.
Die Routendaten enthalten zum Beispiel ein `pagination`-Objekt mit Links zu den vorherigen und nächsten Seiten in der Seitenleiste.
Wenn eine Seite eine dieser Funktionen deaktiviert, z.B. durch die Einstellung `prev: false` im Frontmatter, wird dies im Objekt `pagination` reflektiert.

Eine vollständige Liste der verfügbaren Eigenschaften findest du in der [„Routedaten Referenz“](/de/reference/route-data/).

## Wie werden die Routendaten verwendet?

Alle Starlight-Komponenten haben Zugriff auf die Routendaten und verwenden sie, um zu entscheiden, was für jede Seite gerendert werden soll
Der String `siteTitle` wird zum Beispiel verwendet, um den Titel der Seite anzuzeigen, und das Array `sidebar` wird verwendet, um die globale Seitennavigation darzustellen.

Die Routendaten sind in den Astro-Komponenten über das Global `Astro.locals.starlightRoute` verfügbar:

```astro title="beispiel.astro"
---
const { siteTitle } = Astro.locals.starlightRoute;
---

<p>Der Titel dieser Seite lautet „{siteTitle}“</p>
```

Wenn du eine [Komponenten ersetzt](/de/guides/overriding-components/), kannst du auf Routendaten wie diese zugreifen, um die Anzeige anzupassen.

## Anpassen der Routendaten

Starlights Routendaten funktionieren sofort und müssen nicht konfiguriert werden.
Für fortgeschrittene Anwendungsfälle möchtest du jedoch vielleicht die Routendaten für einige oder alle Seiten anpassen, um die Darstellung deiner Website zu verändern.

Das ist ein ähnliches Konzept wie die [Komponentenersetzung](/de/guides/overriding-components/), aber anstatt zu ändern, wie Starlight deine Daten rendert, änderst du die Daten, die Starlight rendert.

### Wann du die Routendaten anpassen solltest

Das Anpassen von Routendaten kann nützlich sein, wenn du die Art und Weise, wie Starlight deine Daten verarbeitet, auf eine Weise ändern möchtest, die mit den bestehenden Konfigurationsoptionen nicht möglich ist.

Du kannst zum Beispiel die Elemente in der Seitenleiste filtern oder die Titel für bestimmte Seiten anpassen.
Bei Änderungen wie dieser müssen die Standardkomponenten von Starlight nicht geändert werden, sondern nur die Daten, die an diese Komponenten übergeben werden.

### Wie du die Routendaten anpasst

Du kannst die Routendaten mithilfe einer speziellen Form von „Middleware“ anpassen.
Dies ist eine Funktion, die jedes Mal aufgerufen wird, wenn Starlight eine Seite rendert, und die Werte im Routendatenobjekt ändern kann.

1. Erstelle eine neue Datei, die eine `onRequest`-Funktion mit Starlights `defineRouteMiddleware()`-Dienstprogramm exportiert:

   ```ts
   // src/routeData.ts
   import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

   export const onRequest = defineRouteMiddleware(() => {});
   ```

2. Teile Starlight mit, wo sich deine Routendaten-Middleware-Datei in der Datei `astro.config.mjs` befindet:

   ```js ins={9}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'Meine wunderbare Dokumentationswebsite',
         routeMiddleware: './src/routeData.ts',
       }),
     ],
   });
   ```

3. Aktualisiere deine `onRequest`-Funktion, um die Routendaten zu ändern.

   Das erste Argument, das die Middleware erhält, ist [Astros `context`-Objekt](https://docs.astro.build/de/reference/api-reference/).
   Es enthält alle Informationen über die aktuell gerenderte Seite, einschließlich der aktuellen URL und `locals`.

   In diesem Beispiel werden wir unsere Dokumente spannender machen, indem wir ein Ausrufezeichen am Ende jedes Seitentitels hinzufügen.

   ```ts
   // src/routeData.ts
   import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

   export const onRequest = defineRouteMiddleware((context) => {
     // Hol dir den Eintrag der Inhaltssammlung für diese Seite.
     const { entry } = context.locals.starlightRoute;
     // Aktualisiere den Titel, um ein Ausrufezeichen hinzuzufügen.
     entry.data.title = entry.data.title + '!';
   });
   ```
