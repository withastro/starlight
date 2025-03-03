---
'@astrojs/starlight-markdoc': minor
---

Adds support for the `title`, `frame`, and `meta` fence attributes to code blocks.
 
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
