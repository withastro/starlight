---
title: Accessibility Statement
description: Our commitment to making Starlight accessible for everyone.
---

At Starlight, we believe that documentation should be accessible to everyone, regardless of ability or circumstance. Accessibility is a core value that guides how we build and maintain this documentation theme.

## Our commitment

Starlight is designed to conform to the [Web Content Accessibility Guidelines (WCAG) 2.2][wcag], Level AA.
These guidelines help ensure web content is accessible to people with a wide range of disabilities, including visual, auditory, motor, speech, cognitive, language, learning, and neurological disabilities.

We actively work to meet and exceed these standards because accessible documentation benefits everyone: whether you use a screen reader, navigate with a keyboard, have low vision, or simply prefer high contrast modes.

## Accessibility features

Starlight includes the following accessibility features by default:

### Navigation and structure

- **Skip link**: A "Skip to content" link appears when tabbing, allowing keyboard users to bypass repetitive navigation
- **Logical heading hierarchy**: Content follows a structured heading order to support screen reader navigation
- **Landmark regions**: Proper use of HTML5 landmarks (`<nav>`, `<main>`, `<aside>`) helps assistive technologies understand page structure
- **Consistent navigation**: The sidebar and header remain consistent across pages

### Keyboard support

- **Full keyboard navigability**: All interactive elements are accessible via keyboard
- **Tab component navigation**: Arrow keys, Home, and End keys navigate between tabs
- **Escape key support**: Closes modals and menus, returning focus appropriately
- **Keyboard shortcuts**: Search opens with `Ctrl` + `K` or `⌘` + `K`

### Visual accessibility

- **Color contrast**: Text and interactive elements meet WCAG AA contrast requirements
- **Dark and light themes**: Choose the theme that works best for you
- **Responsive design**: Content adapts to different viewport sizes and zoom levels
- **Focus indicators**: Visible focus states for keyboard navigation

### Screen reader support

- **ARIA attributes**: Used throughout components to convey state and relationships
- **Accessible labels**: Interactive elements include descriptive labels for assistive technologies
- **Language attributes**: Proper `lang` attributes support screen reader pronunciation
- **Text alternatives**: Icons include screen reader text; decorative images are hidden appropriately

### Content accessibility

- **Semantic HTML**: Content uses appropriate HTML elements for meaning, not just appearance
- **Link text**: Links describe their destination, not just "click here"
- **Code blocks**: Syntax-highlighted code maintains readability and supports copy functionality

## Areas for improvement

We recognize that accessibility is an ongoing effort and are actively working on the following improvements:

- **Search experience**: Enhancing screen reader feedback for search results and focus management
- **Interactive elements**: Adding more visual indicators beyond color for hover and focus states
- **Consistent focus styling**: Implementing uniform focus outlines across all browsers
- **High zoom support**: Improving the layout when browsers are zoomed to 400%

:::tip[Want to help?]
These focus areas were identified through [community feedback][audit]. If you spot accessibility issues or have suggestions, we'd love to hear from you!
:::

## Feedback

We welcome your feedback on the accessibility of Starlight.
If you encounter barriers or have suggestions for improvement, please let us know:

- **GitHub Issues**: [Open an accessibility issue][new-issue] with details about the barrier you encountered
- **Discord**: Join the [Astro Discord][discord] and share your feedback in the `#starlight` channel

When reporting issues, please include:

- The URL of the page where you experienced the issue
- A description of the problem and how it affects your use of the documentation
- The assistive technology you were using (if applicable)

## Resources

Learn more about web accessibility:

- [Web Content Accessibility Guidelines (WCAG) 2.2][wcag]
- [WebAIM: Web Accessibility In Mind][webaim]
- [The A11Y Project][a11y-project]
- [MDN: Accessibility][mdn-a11y]

---

This statement was last updated on December 2024.

[wcag]: https://www.w3.org/WAI/standards-guidelines/wcag/
[webaim]: https://webaim.org/
[a11y-project]: https://www.a11yproject.com/
[mdn-a11y]: https://developer.mozilla.org/en-US/docs/Web/Accessibility
[audit]: https://github.com/withastro/starlight/issues/2693
[new-issue]: https://github.com/withastro/starlight/issues/new?labels=a11y&template=---02-docs-issue.yml
[discord]: https://astro.build/chat
