import type { AstroUserConfig } from 'astro';
import { h as _h, s as _s, Properties } from 'hastscript';
import type { Paragraph as P, Root } from 'mdast';
import remarkDirective from 'remark-directive';
import type { Plugin, Transformer } from 'unified';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';

/** Hacky function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: Properties = {}, children: any[] = []): P {
  const { tagName, properties } = _h(el, attrs);
  return {
    type: 'paragraph',
    data: { hName: tagName, hProperties: properties },
    children,
  };
}

/** Hacky function that generates an mdast SVG tree ready for conversion to HTML by rehype. */
function s(el: string, attrs: Properties = {}, children: any[] = []): P {
  const { tagName, properties } = _s(el, attrs);
  return {
    type: 'paragraph',
    data: { hName: tagName, hProperties: properties },
    children,
  };
}

/**
 * remark plugin that converts blocks delimited with `:::` into styled
 * asides (a.k.a. “callouts”, “admonitions”, etc.). Depends on the
 * `remark-directive` module for the core parsing logic.
 *
 * For example, this Markdown
 *
 * ```md
 * :::tip[Did you know?]
 * Astro helps you build faster websites with “Islands Architecture”.
 * :::
 * ```
 *
 * will produce this output
 *
 * ```astro
 * <aside class="starbook-aside starbook-aside--tip" aria-label="Did you know?">
 *   <p class="starbook-aside__title" aria-hidden="true">Did you know?</p>
 *   <section class="starbook-aside__content">
 *     <p>Astro helps you build faster websites with “Islands Architecture”.</p>
 *   </section>
 * </Aside>
 * ```
 */
function remarkAsides(): Plugin<[], Root> {
  type Variant = 'note' | 'tip' | 'caution' | 'danger';
  const variants = new Set(['note', 'tip', 'caution', 'danger']);
  const isAsideVariant = (s: string): s is Variant => variants.has(s);

  // TODO: hook these up for i18n once the design for translating strings is ready
  const defaultTitles = {
    note: 'Note',
    tip: 'Tip',
    caution: 'Caution',
    danger: 'Danger',
  };

  const transformer: Transformer<Root> = (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index === null || node.type !== 'containerDirective') {
        return;
      }
      const variant = node.name;
      if (!isAsideVariant(variant)) return;

      // remark-directive converts a container’s “label” to a paragraph in
      // its children, but we want to pass it as the title prop to <Aside>, so
      // we iterate over the children, find a directive label, store it for the
      // title prop, and remove the paragraph from children.
      let title = defaultTitles[variant];
      remove(node, (child): boolean | void => {
        if (child.data?.directiveLabel) {
          if (
            'children' in child &&
            Array.isArray(child.children) &&
            'value' in child.children[0]
          ) {
            title = child.children[0].value;
          }
          return true;
        }
      });

      const aside = h(
        'aside',
        {
          'aria-label': title,
          class: `starbook-aside starbook-aside--${variant}`,
        },
        [
          h('p', { class: 'starbook-aside__title', 'aria-hidden': 'true' }, [
            h('span', { class: 'starbook-aside__icon' }, [
              // TODO: Make this map to the correct icons we decide to use.
              s('svg', { viewBox: '0 0 16 16', width: 16, height: 16 }, [
                s('path', {
                  d: 'M8.9 1.5C8.7 1.2 8.4 1 8 1s-.7.2-.9.5l-7 12a1 1 0 0 0 0 1c.2.3.6.5 1 .5H15c.4 0 .7-.2.9-.5a1 1 0 0 0 0-1l-7-12zM9 13H7v-2h2v2zm0-3H7V6h2v4z',
                }),
              ]),
            ]),
            { type: 'text', value: title },
          ]),
          h('section', { class: 'starbook-aside__content' }, node.children),
        ]
      );

      parent.children[index] = aside;
    });
  };

  return function attacher() {
    return transformer;
  };
}

type RemarkPlugins = NonNullable<
  NonNullable<AstroUserConfig['markdown']>['remarkPlugins']
>;

export function starbookAsides(): RemarkPlugins {
  return [remarkDirective, remarkAsides()];
}
