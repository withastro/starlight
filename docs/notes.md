Welcome to DocsGeek.io

Landing page

DocsGeek
About me
Contact details: Twitter, LinkedIn, Github
About page
Latest projects - Links to Github
Selected Projects
/ebooks
/posts
/podcasts

Twitter feed or Linkedin feedback
Github updates.

Do a breadcrumb for blog and subpages.

Add animation from protfolio site of typing and make docsgeek.io courier

Maybe make descriptions hash tags?

Maybe make a project tree of your site structure with links

Need to set light hero icon if it is light mode

Dark mode default but this will get overrided.

```html
<starlight-theme-select>
  {/* TODO: Can we give this select a width that works well for each language’s
  strings? */}
  <!-- i edited this -->
  <Select icon="laptop" label={t('themeSelect.accessibleLabel')} value="auto"
  options={[ { label: t('themeSelect.dark'), selected: true, value: 'dark' }, {
  label: t('themeSelect.light'), selected: false, value: 'light' }, { label:
  t('themeSelect.auto'), selected: false, value: 'auto' }, ]} width="6.25em" />
</starlight-theme-select>
```

Task template DITA:
https://www.oxygenxml.com/dita/1.3/specs/archSpec/technicalContent/dita-task-topic.html

### Theme tweaks

/Users/mawentowski/Repos/docsgeek/node_modules/@astrojs/starlight/components/ThemeProvider.astro

/Users/mawentowski/Repos/docsgeek/node_modules/@astrojs/starlight/components/ThemeSelect.astro

/Users/mawentowski/Repos/docsgeek/docs/node_modules/@astrojs/starlight/components/ThemeProvider.astro

# setup

Install pnpm for lubrary
cd into docs
pnpm update
pnpm update --dev
pnpm install
pnpm dev

#

FOr:

```json "dependencies": {
    "@astrojs/starlight": "workspace:*",
```

Try to make the custom theme a library located on github instead

```json
"dependencies": {
  "@astrojs/starlight": "github:githubusername/reponame#branch-or-tag-name"
}
```
