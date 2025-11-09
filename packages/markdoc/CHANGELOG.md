# @astrojs/starlight-markdoc

## 0.5.1

### Patch Changes

- [#3500](https://github.com/withastro/starlight/pull/3500) [`7700456`](https://github.com/withastro/starlight/commit/770045663c8ca3cc44983dd0d444955eba441243) Thanks [@delucis](https://github.com/delucis)! - This is the first release published with OIDC trusted publishing.

## 0.5.0

### Minor Changes

- [#2261](https://github.com/withastro/starlight/pull/2261) [`778b743`](https://github.com/withastro/starlight/commit/778b743cdb832551ed576c745728358d8bbf9d7a) Thanks [@shubham-padia](https://github.com/shubham-padia)! - Adds support for the `icon` attribute in the `aside` tag, allowing the use of any of Starlight’s built-in icons.

## 0.4.0

### Minor Changes

- [#3033](https://github.com/withastro/starlight/pull/3033) [`8c19678`](https://github.com/withastro/starlight/commit/8c19678e57c0270d3d80d4678f23a6fc287ebf12) Thanks [@delucis](https://github.com/delucis)! - Adds support for generating clickable anchor links for headings.

  By default, the Starlight Markdoc preset now includes a default `heading` node, which renders an anchor link beside headings in your Markdoc content.

  If you want to disable this new feature, pass `headingLinks: false` in your Markdoc config:

  ```js
  export default defineMarkdocConfig({
    // Disable the default heading anchor link support
    extends: [starlightMarkdoc({ headingLinks: false })],
  });
  ```

  ⚠️ **BREAKING CHANGE:** The minimum supported peer version of Starlight is now v0.34.0.

  Please update Starlight and the Starlight Markdoc preset together:

  ```sh
  npx @astrojs/upgrade
  ```

## 0.3.1

### Patch Changes

- [#3090](https://github.com/withastro/starlight/pull/3090) [`fc3ffa8`](https://github.com/withastro/starlight/commit/fc3ffa8e27a3113a8eb70a3d8e7bf69c2bb214e5) Thanks [@delucis](https://github.com/delucis)! - Adds support for newer versions of `@astrojs/markdoc`

- [#3109](https://github.com/withastro/starlight/pull/3109) [`b5cc1b4`](https://github.com/withastro/starlight/commit/b5cc1b4d4ee7dc737616c6ada893369b13ddb9c6) Thanks [@dhruvkb](https://github.com/dhruvkb)! - Updates Expressive Code to v0.41.1

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
