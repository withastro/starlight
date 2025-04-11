---
title: Ersetzung von Komponenten Referenz
description: Ein Überblick über die Komponenten und Komponenten&shy;eigenschaften, die von Starlight Ersetzungen unterstützt werden.
tableOfContents:
  maxHeadingLevel: 4
sidebar:
  label: Ersetzung von Komponenten
---

Du kannst Starlights eingebaute Komponenten überschreiben, indem du Pfade zu Ersatzkomponenten in Starlights [`components`](/de/reference/configuration/#components)-Konfigurations&shy;option angibst.
Diese Seite listet alle Komponenten auf, die überschrieben werden können, und verweist auf ihre Standard&shy;implementierungen auf GitHub.

Erfahre mehr in der [Anleitung zum Überschreiben von Komponenten](/de/guides/overriding-components/).

---

## Komponenten

### Head

Diese Komponenten werden innerhalb des `<head>`-Elements jeder Seite gerendert.
Sie sollten nur [innerhalb von `<head>` erlaubte Elemente](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head#see_also) enthalten.

#### `Head`

**Standardkomponente:** [`Head.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Head.astro)

Diese Komponente wird innerhalb des `<head>` einer jeden Seite gerendert.

Überschreibe diese Komponente nur, wenn es unbedingt notwendig ist.
Bevorzuge die [Konfigurationsoption `head`](/de/reference/configuration/#head), das [Frontmatter-Feld `head`](/de/reference/frontmatter/#head) oder eine [Routendaten-Middleware](/de/guides/route-data/#anpassen-der-routendaten), um die von der Standardkomponente dargestellten Routendaten nach Möglichkeit anzupassen.

#### `ThemeProvider`

**Standardkomponente:** [`ThemeProvider.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeProvider.astro)

Diese Komponente wird innerhalb von `<head>` gerendert und richtet die Unterstützung für dunkle/helle Themen ein.
Die Standard-Implementierung enthält ein Inline-Skript und ein `<template>`, welches vom Skript in [`<ThemeSelect />`](#themeselect) verwendet wird.

---

### Barrierefreiheit

#### `SkipLink`

**Standardkomponente:** [`SkipLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SkipLink.astro)

Diese Komponente wird als erstes Element innerhalb von `<body>` dargestellt und verweist aus Gründen der Barrierefreiheit auf den Hauptinhalt der Seite.
Die Standard&shy;implementierung ist ausgeblendet, bis ein Benutzer sie durch Tabulatorbewegungen mit der Tastatur aktiviert.

---

### Layout

Diese Komponenten sind für das Layout der Starlight-Komponenten und die Verwaltung von Ansichten über verschiedene Haltepunkte hinweg verantwortlich.
Das Überschreiben dieser Komponenten ist mit erheblicher Komplexität verbunden.
Wenn möglich, bevorzuge das Überschreiben einer Komponente auf einer niedrigeren Ebene.

#### `PageFrame`

**Standardkomponente:** [`PageFrame.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageFrame.astro)  
**Benannte Slots:** `header`, `sidebar`

Diese Layout-Komponente beinhaltet den größten Teil des Seiteninhalts.
Die Standard&shy;implementierung konfiguriert das Kopfzeilen-Seitennavigation-Haupt-Layout und beinhaltet `header` und `sidebar` benannte Slots zusammen mit einem Standard-Slot für den Hauptinhalt.
Sie rendert auch [`<MobileMenuToggle />`](#mobilemenutoggle), um das Umschalten der Seitenleisten&shy;navigation auf kleinen (mobilen) Viewports zu unterstützen.

#### `MobileMenuToggle`

**Standardkomponente:** [`MobileMenuToggle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuToggle.astro)

Diese Komponente wird innerhalb von [`<PageFrame>`](#pageframe) gerendert und ist für das Umschalten der Seitenleisten&shy;navigation auf kleinen (mobilen) Viewports verantwortlich.

#### `TwoColumnContent`

**Standardkomponente:** [`TwoColumnContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TwoColumnContent.astro)  
**Benannter Slot:** `right-sidebar`

Dies ist die Layout-Komponente, welche die Hauptinhaltsspalte und die rechte Seitenleiste (Inhaltsverzeichnis) beinhaltet.
Die Standard&shy;implementierung behandelt den Wechsel zwischen einem einspaltigen Layout mit kleinem Sichtfeld und einem zweispaltigen Layout mit größerem Sichtfeld.

---

### Kopfzeile

Diese Komponenten stellen die obere Navigationsleiste von Starlight dar.

#### `Header`

**Standardkomponente:** [`Header.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Header.astro)

Dies ist eine Kopfzielen-Komponente, welche oben auf jeder Seite angezeigt wird.
Die Standard&shy;implementierung zeigt [`<SiteTitle />`](#sitetitle), [`<Search />`](#search), [`<SocialIcons />`](#socialicons), [`<ThemeSelect />`](#themeselect), und [`<LanguageSelect />`](#languageselect).

#### `SiteTitle`

**Standardkomponente:** [`SiteTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SiteTitle.astro)

Die Komponente wird die am Anfang des Website-Headers gerendert, um den Titel der Website darzustellen.
Die Standard&shy;implementierung enthält die Logik für die Darstellung von Logos, die in der Starlight-Konfiguration definiert sind.

#### `Search`

**Standardkomponente:** [`Search.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Search.astro)

Diese Komponente wird verwendet, um Starlights Suchoberfläche darzustellen.
Die Standard&shy;implementierung enthält die Schaltfläche in der Kopfzeile und den Code für die Anzeige eines Suchmodals, wenn darauf geklickt wird, und das Laden von [Pagefinds UI](https://pagefind.app/).

Wenn [`pagefind`](/de/reference/configuration/#pagefind) deaktiviert ist, wird die Standard-Suchkomponente nicht angezeigt.
Wenn du jedoch `Search` überschreibst, wird deine benutzerdefinierte Komponente immer angezeigt, auch wenn die Konfigurations&shy;option `pagefind` auf `false` gesetzt ist.
So kannst du eine Benutzeroberfläche für alternative Suchanbieter hinzufügen, wenn du Pagefind deaktivierst.

#### `SocialIcons`

**Standardkomponente:** [`SocialIcons.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/SocialIcons.astro)

Diese Komponente wird in der Kopfzeile der Website gerendert und enthält Symbol-Links zu sozialen Netzwerken.
Die Standard&shy;implementierung verwendet die Option [`social`](/de/reference/configuration/#social) in der Starlight-Konfiguration, um Symbole und Links darzustellen.

#### `ThemeSelect`

**Standardkomponente:** [`ThemeSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ThemeSelect.astro)

Diese Komponente wird in der Kopfzeile der Website gerendert und ermöglicht es den Benutzern, ihr bevorzugtes Farbschema auszuwählen.

#### `LanguageSelect`

**Standardkomponente:** [`LanguageSelect.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LanguageSelect.astro)

Die Komponente wird in der Kopfzeile der Website angezeigt und ermöglicht es den Nutzern, die Sprache auszuwählen.

---

### Globale Seitenleiste

Die globale Seitenleiste von Starlight enthält die Hauptnavigation der Website.
Bei schmalen Ansichtsfenstern ist diese hinter einem Dropdown-Menü versteckt.

#### `Sidebar`

**Standardkomponente:** [`Sidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Sidebar.astro)

Die Komponente wird die vor dem Seiteninhalt gerendert und enthält eine globale Navigation.
Die Standard&shy;implementierung wird als Seitenleiste in ausreichend breiten Ansichtsfenstern und innerhalb eines Dropdown-Menüs in kleinen (mobilen) Ansichtsfenstern angezeigt.
Sie rendert auch [`<MobileMenuFooter />`](#mobilemenufooter), um zusätzliche Elemente innerhalb des mobilen Menüs anzuzeigen.

#### `MobileMenuFooter`

**Standardkomponente:** [`MobileMenuFooter.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileMenuFooter.astro)

Diese Komponente wird die am unteren Ende des mobilen Dropdown-Menüs gerendert.
Die Standard&shy;implementierung rendert [`<ThemeSelect />`](#themeselect) und [`<LanguageSelect />`](#languageselect).

---

### Seitenleiste des Inhalts

Die Seitenleiste von Starlight ist für die Anzeige eines Inhalts&shy;verzeichnisses verantwortlich, welches die Untertitel der aktuellen Seite anzeigt.
Bei schmalen Ansichtsfenstern wird diese Leiste zu einem Dropdown-Menü.

#### `PageSidebar`

**Standardkomponente:** [`PageSidebar.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageSidebar.astro)

Diese Komponente wird die vor dem Inhalt der Hauptseite gerendert, um ein Inhaltsverzeichnis anzuzeigen.
Die Standard&shy;implementierung rendert [`<TableOfContents />`](#tableofcontents) und [`<MobileTableOfContents />`](#mobiletableofcontents).

#### `TableOfContents`

**Standardkomponente:** [`TableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/TableOfContents.astro)

Eine Komponente zur Darstellung des Inhalts&shy;verzeichnisses der aktuellen Seite in breiteren Ansichtsfenstern.

#### `MobileTableOfContents`

**Standardkomponente:** [`MobileTableOfContents.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MobileTableOfContents.astro)

Diese Komponete zeigt das Inhaltsverzeichnis der aktuellen Seite auf kleinen (mobilen) Bildschirmen an.

---

### Inhalt

Folgende Komponenten werden in der Hauptspalte des Seiteninhalts wiedergegeben.

#### `Banner`

**Standardkomponente:** [`Banner.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Banner.astro)

Diese Bannerkomponente wird oben auf jeder Seite angezeigt.
Die Standard-Implementierung verwendet den [`banner`](/de/reference/frontmatter/#banner)-Frontmatter-Wert der Seite, um zu entscheiden, ob sie gerendert wird oder nicht.

#### `ContentPanel`

**Standardkomponente:** [`ContentPanel.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/ContentPanel.astro)

Diese Layout-Komponente beinhaltet Abschnitte der Hauptinhaltsspalte.

#### `PageTitle`

**Standardkomponente:** [`PageTitle.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/PageTitle.astro)

Eine Komponente, welche das `<h1>`-Element für die aktuelle Seite enthält.

Implementierungen sollten sicherstellen, dass sie `id="_top"` auf dem `<h1>` Element wie in der Standard&shy;implementierung setzen.

#### `DraftContentNotice`

**Standardkomponente:** [`DraftContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/DraftContentNotice.astro)

Hinweis, der den Nutzern während der Entwicklung angezeigt wird, wenn die aktuelle Seite als Entwurf markiert ist.

#### `FallbackContentNotice`

**Standardkomponente:** [`FallbackContentNotice.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/FallbackContentNotice.astro)

Ein Hinweis, welcher den Benutzern auf der Seite angezeigt wird, für die keine Übersetzung in der aktuellen Sprache verfügbar ist.
Wird nur auf mehrsprachigen Websites verwendet.

#### `Hero`

**Standardkomponente:** [`Hero.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Hero.astro)

Diese Komponente wird am oberen Rand der Seite angezeigt, wenn [`hero`](/de/reference/frontmatter/#hero) in frontmatter eingestellt ist.
Die Standard&shy;implementierung zeigt einen großen Titel, eine Tagline und Call-to-Action-Links neben einem optionalen Bild.

#### `MarkdownContent`

**Standardkomponente:** [`MarkdownContent.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/MarkdownContent.astro)

Die Kompoente wird um den Hauptinhalt jeder Seite gerendert.
Die Standard&shy;implementierung richtet grundlegende Stile ein, die auf Markdown-Inhalte angewendet werden.

Die Markdown-Inhaltsstile werden auch in der Datei `@astrojs/starlight/style/markdown.css` veröffentlicht und auf die CSS-Klasse `.sl-markdown-content` bezogen.

---

### Fußzeile

Diese Komponenten werden am unteren Ende der Hauptspalte des Seiteninhalts dargestellt.

#### `Footer`

**Standardkomponente:** [`Footer.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Footer.astro)

Diese Fußzeile-Komponente wird am unteren Rand jeder Seite angezeigt.
Die Standard&shy;implementierung zeigt [`<LastUpdated />`](#lastupdated), [`<Pagination />`](#pagination), und [`<EditLink />`](#editlink).

#### `LastUpdated`

**Standardkomponente:** [`LastUpdated.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/LastUpdated.astro)

Eine Komponente, die in der Fußzeile der Seite gerendert wird, um das zuletzt aktualisierte Datum anzuzeigen.

#### `EditLink`

**Standardkomponente:** [`EditLink.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/EditLink.astro)

Die Komponente wird in der Fußzeile der Seite gerendert, um einen Link anzuzeigen, über den die Seite bearbeitet werden kann.

#### `Pagination`

**Standardkomponente:** [`Pagination.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/components/Pagination.astro)

Diese Komponente wird in der Fußzeile der Seite gerendert, um Navigationspfeile zwischen vorherigen/nächsten Seiten anzuzeigen.
