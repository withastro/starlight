---
title: Inhalte in Markdown verfassen
description: Ein Überblick über die von Starlight unterstützte Markdown-Syntax.
---

Starlight unterstützt die gesamte Bandbreite der [Markdown](https://daringfireball.net/projects/markdown/) Syntax in `.md` Dateien sowie Frontmatter [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) um Metadaten wie Titel und Beschreibung zu definieren.

Bitte prüfe die [MDX docs](https://mdxjs.com/docs/what-is-mdx/#markdown) oder [Markdoc docs](https://markdoc.dev/docs/syntax), wenn du diese Dateiformate verwendest, da die Unterstützung und Verwendung von Markdown unterschiedlich sein kann.

## Inline-Stile

Text kann **fett**, _italic_, oder ~~durchgestrichen~~ sein.

```md
Text kann **fett**, _italic_, oder ~~durchgestrichen~~ sein.
```

Sie können [auf eine andere Seite](/de/getting-started/) verlinken.

```md
Sie können [auf eine andere Seite](/de/getting-started/) verlinken.
```

Du kannst `inline code` mit Backticks hervorheben.

```md
Du kannst `inline code` mit Backticks hervorheben.
```

## Bilder

Bilder in Starlight verwenden [Astros eingebaute optimierte Asset-Unterstützung](https://docs.astro.build/de/guides/assets/).

Markdown und MDX unterstützen die Markdown-Syntax für die Anzeige von Bildern, einschließlich Alt-Text für Bildschirmleser und unterstützende Technologien.

![Eine Illustration von Planeten und Sternen mit dem Wort "Astro"](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![Eine Illustration von Planeten und Sternen mit dem Wort "astro"](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-imag)
```
