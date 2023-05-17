# Contributor Manual

We welcome contributions of any size and contributors of any skill level.
As an open source project, we believe in giving back to our contributors.
We are happy to help with guidance on PRs, technical writing, and turning any feature idea into a reality.

> **Tip for new contributors:**
> Take a look at [GitHub's Docs](https://docs.github.com/en/get-started/quickstart/hello-world) for helpful information on working with GitHub.

This document is an active work in progress — like Starlight itself! Feel free to join us in [the Astro Discord server][discord] to join the discussion. Look for the `#starlight` channel and say “Hi!” when you arrive.

## Types of contributions

There are lots of ways to contribute to Starlight.

Maintaining Starlight requires writing Astro code, as well as addressing accessibility, styling, and UX concerns.
This repository also contains the code for the Starlight docs website.
Help writing docs, catching typos and errors, as well as translating docs into other languages is always welcome.

You can also get involved by leaving feedback on [issues][issues] or reviewing [pull requests][pulls] by other contributors.

We encourage you to:

- [**Open an issue**][new-issue] to let us know of bugs in Starlight, documentation you found unclear, or other issues you run into.

- [**Look at existing issues**][issues] (especially those labelled [“good first issue”][gfi]) to find ways to contribute.

- **Make a pull request (PR)** to address an open issue or to fix obvious problems.
  Read more about [making a PR in GitHub’s docs][pr-docs]

- [**Review existing PRs**][pulls] to help us merge contributions sooner.

## About this repo

This repo is a “monorepo,” meaning it contains several projects in one. It contains the Starlight docs site in [`docs/`](./docs/) and the packages that make up Starlight in [`packages/`](./packages/).

### Setting up a development environment

#### Developing locally

**Prerequisites:** Developing Starlight requires [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/). Make sure you have these installed before following these steps.

1. **Fork Starlight** to your personal GitHub account by clicking <kbd>Fork</kbd> on the [main Starlight repo page][sl].

2. **Clone your fork** of Starlight to your computer. Replace `YOUR-USERNAME` in the command below with your GitHub username to clone in a Terminal:

   ```sh
   git clone https://github.com/YOUR-USERNAME/starlight.git
   ```

3. **Change directory** to the cloned repo:

   ```sh
   cd starlight
   ```

4. **Install dependencies** with `pnpm`:

   ```sh
   pnpm i
   ```

#### Developing using Gitpod

Instead of working locally on your machine, you can also contribute using an online coding development environment like Gitpod.

**Prerequisites:** Developing Starlight using Gitpod requires a free [Gitpod account](https://gitpod.io).

1. **Open the Gitpod URL** [https://gitpod.io/#https://github.com/withastro/starlight](https://gitpod.io/#https://github.com/withastro/starlight). You can alternatively install a [Gitpod browser extension](https://www.gitpod.io/docs/configure/user-settings/browser-extension) which will add a "Gitpod" button when viewing [Starlight's repo on GitHub](https://github.com/withastro/starlight).

2. **Install dependencies** with `pnpm`:

   ```sh
   pnpm i
   ```

### Testing changes while you work

Run the Astro dev server on the docs site to see how changes you make impact a project using Starlight.

To do this, move into the `docs/` directory from the root of the repo and then run `pnpm dev`:

```sh
cd docs
pnpm dev
```

You should then be able to open <http://localhost:3000> and see your changes.

### Understanding Starlight

- Starlight is built as an Astro integration.
  Read the [Astro Integration API docs][api-docs] to learn more about how integrations work.

  The Starlight integration is exported from [`packages/starlight/index.ts`](./packages/starlight/index.ts).
  It sets up Starlight’s routing logic, parses user config, and adds configuration to a Starlight user’s Astro project.

- Most pages in a Starlight project are built using a single [`packages/starlight/index.astro`](./packages/starlight/index.astro) route.
  If you’ve worked on an Astro site before, much of this should look familiar: it’s an Astro component and uses a number of other components to build a page based on user content.

- Starlight consumes a user’s content from the `'docs'` [content collection](https://docs.astro.build/en/guides/content-collections/).
  This allows us to specify the permissible frontmatter via [a Starlight-specific schema](./packages/starlight/schema.ts) and get predictable data while providing clear error messages if a user sets invalid frontmatter in a page.

- Components that require JavaScript for their functionality are all written without a UI framework, most often as custom elements.
  This helps keep Starlight lightweight and makes it easier for a user to choose to add components from a framework of their choice to their project.

[discord]: https://astro.build/chat
[issues]: https://github.com/withastro/starlight/issues
[sl]: https://github.com/withastro/starlight/pulls
[pulls]: https://github.com/withastro/starlight/pulls
[new-issue]: https://github.com/withastro/starlight/issues/new/choose
[pr-docs]: https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request
[gfi]: https://github.com/withastro/starlight/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+
[api-docs]: https://docs.astro.build/en/reference/integrations-reference/
