---
title: Getting Started
---

Welcome to Starlight, an intuitive and user-friendly framework ideal for documentation websites. In this introductory guide, we will explore the main features and benefits of Starlight.

## Getting started with Starlight

Starlight is built on top of the [Astro](https://astro.build) all-in-one framework. You can create a new Astro + Starlight project using the following command:

```sh
# create a new project with npm
npm create astro --template starlight
```

This will create a new project directory with all the necessary files and configurations for your site.

## What’s in the box?

Starlight includes all the features you need to get a documentation site up and running quickly:

- Easy-to-read typographic styles
- Syntax highlighting for code blocks
- Simple-to-configure navigation menus
- Built-in site search
- [Internationalization features](/guides/i18n)
- Mix components (from any framework!) and content in MDX
- Support for custom styles

With these features, you can create rich and engaging documentation that is easy to read and understand.

## Creating content with Starlight

Starlight supports authoring content in Markdown and MDX.

Adding new pages is done by adding a new `.md` or `.mdx` file to `src/content/docs/`. For example, `src/content/docs/hello-world.md` will be available on your site at `/hello-world`.

All Starlight pages share a common set of frontmatter properties you can set to control how the page appears:

```md
---
title: Hello, World!
description: This is a page in my Starlight-powered site
---
```

If you forget anything important, Starlight will let you know.

## Deploying your Starlight website

Once you have created and customized your Starlight website, you can deploy it to a web server or hosting platform of your choice. Astro provides built-in support for several popular hosting platforms, including Netlify, Vercel, and GitHub Pages, which means you can deploy your website with just a few simple commands.

[Learn about deploying an Astro site in the Astro docs.](https://docs.astro.build/en/guides/deploy/)
