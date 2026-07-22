---
title: Accessibility Statement
description: Our commitment to making Starlight accessible for everyone.
---

At Starlight, we believe that documentation should be accessible to everyone, regardless of ability or circumstance. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Measures to support accessibility

Starlight takes the following measures to ensure accessibility:

- Include accessibility throughout our development process.
- Review accessibility in pull requests and code reviews.
- Maintain issues labeled [`a11y`][a11y-issues] to track accessibility work.
- Welcome and act on community accessibility feedback and audits.

## Conformance status

The [Web Content Accessibility Guidelines (WCAG)][wcag] defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.

Starlight strives to meet WCAG 2.2 Level AA where possible. We do not currently make a formal conformance claim.

## Feedback

We welcome your feedback on the accessibility of Starlight.
Please let us know if you encounter accessibility barriers:

- **Email**: [accessibility@astro.build](mailto:accessibility@astro.build)
- **GitHub**: [Open an accessibility issue][new-issue]
- **Discord**: [Astro Discord][discord] in the `#starlight` channel

We try to respond to accessibility feedback within 5 business days.

## Technical specifications

Accessibility of Starlight relies on the following technologies:

- HTML
- WAI-ARIA
- CSS
- JavaScript

These technologies are used in combination with modern browsers and assistive technologies to provide an accessible experience.

### Accessibility-supporting features

Starlight includes the following accessibility-supporting features by default:

- Skip link to bypass navigation and jump to main content
- Logical heading hierarchy for screen reader navigation
- Landmark regions (`<nav>`, `<main>`, `<aside>`) for assistive technology navigation
- Keyboard-accessible navigation for Starlight-provided interactive elements
- Arrow key, Home, and End key interaction for tab components
- Escape key support for modals and menus with focus management
- Keyboard shortcuts for search (<kbd><kbd>Ctrl</kbd>+<kbd>K</kbd></kbd> or <kbd><kbd>Command</kbd>+<kbd>K</kbd></kbd>)
- Color contrast targets based on WCAG AA requirements
- Dark and light themes with user preference support
- Responsive design adapting to different viewport sizes
- Visible focus indicators for keyboard navigation
- ARIA attributes where needed in interactive components
- Screen reader labels for non-text controls
- Language attributes for proper pronunciation
- Semantic HTML for meaningful structure

## Limitations and alternatives

Despite our best efforts to ensure accessibility of Starlight, there may be some limitations. Known limitations are tracked in [issues labeled `a11y` on GitHub][a11y-issues].

Please [contact us](#feedback) if you encounter an issue not listed there.

## Assessment approach

Starlight assesses accessibility through the following approaches:

- Self-evaluation by maintainers
- Community accessibility audits
- Automated testing in our CI pipeline

---

This statement was created in January 2026 and last reviewed in June 2026 using the [W3C Accessibility Statement Generator Tool][wai-generator].

[wcag]: https://www.w3.org/WAI/standards-guidelines/wcag/
[wai-generator]: https://www.w3.org/WAI/planning/statements/generator/
[a11y-issues]: https://github.com/withastro/starlight/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22%F0%9F%A4%A9%20a11y%22
[new-issue]: https://github.com/withastro/starlight/issues/new?template=---02-docs-issue.yml
[discord]: https://astro.build/chat
