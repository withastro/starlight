# @astrojs/starlight-markdoc

## 0.3.0

### Minor Changes

- [#2931](https://github.com/withastro/starlight/pull/2931) [`10b93b3`](https://github.com/withastro/starlight/commit/10b93b336cf4e3500e3003635b5afc430284d1a7) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Adds support for the `title`, `frame`, and `meta` fence attributes to code blocks.

  These new optional attributes add support for Expressive Code [text & line markers](https://expressive-code.com/key-features/text-markers/). The following example renders a code block using a [terminal frame](https://expressive-code.com/key-features/frames/#terminal-frames) with a [title](https://expressive-code.com/key-features/frames/#code-editor-frames):

  ````mdoc
  ```js {% title="editor.exe" frame="terminal" %}
  console.log('Hello, world!');
  ```
  ````

  Any other text or line markers should be specified using the `meta` fence attribute. For example, the following code block renders a code block using the `diff` syntax combined with the `js` language syntax highlighting and the `markers` text highlighted:

  ````mdoc
  ```diff {% meta="lang=js 'markers'" %}
    function thisIsJavaScript() {
      // This entire block gets highlighted as JavaScript,
      // and we can still add diff markers to it!
  -   console.log('Old code to be removed')
  +   console.log('New and shiny code!')
    }
  ```
  ````

  To learn more about all the available options, check out the [Expressive Code documentation](https://expressive-code.com/key-features/text-markers/#usage-in-markdown--mdx).

## 0.2.0

### Minor Changes

- [#2612](https://github.com/withastro/starlight/pull/2612) [`8d5a4e8`](https://github.com/withastro/starlight/commit/8d5a4e8000d9e3a4bb9ca8178767cf3d8bc48773) Thanks [@HiDeoo](https://github.com/HiDeoo)! - ⚠️ **BREAKING CHANGE:** The minimum supported version of Starlight is now 0.30.0

  Please use the `@astrojs/upgrade` command to upgrade your project:

  ```sh
  npx @astrojs/upgrade
  ```

### Patch Changes

- [#2664](https://github.com/withastro/starlight/pull/2664) [`62ff007`](https://github.com/withastro/starlight/commit/62ff0074d9a3f82e46f5c62db85c04d87ff5e931) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Publishes provenance containing verifiable data to link a package back to its source repository and the specific build instructions used to publish it.

## 0.1.0

### Minor Changes

- [#2249](https://github.com/withastro/starlight/pull/2249) [`20cbf3b`](https://github.com/withastro/starlight/commit/20cbf3b6a4d1598a62fdb176ebaa849bc7b978f7) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Adds Starlight Markdoc preset.

  See the [“Markdoc”](https://starlight.astro.build/guides/authoring-content/#markdoc) guide to learn more on how to use this preset in a new or existing project.
