import { rehype } from 'rehype';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';

interface Panel {
  panelId: string;
  tabId: string;
  label: string;
}

declare module 'vfile' {
  interface DataMap {
    panels: Panel[];
  }
}

export const TabItemTagname = 'starlight-tab-item';

let count = 0;
const getIDs = () => {
  const id = count++;
  return { panelId: 'tab-panel-' + id, tabId: 'tab-' + id };
};

/**
 * Rehype processor to extract tab panel data and turn each
 * `<starlight-tab-item>` into a `<section>` with the necessary
 * attributes.
 */
const tabsProcessor = rehype()
  .data('settings', { fragment: true })
  .use(function tabs() {
    return (tree, file) => {
      file.data.panels = [];
      let isFirst = true;
      visit(tree, 'element', (node) => {
        if (node.tagName !== TabItemTagname || !node.properties) {
          return CONTINUE;
        }

        const { dataLabel } = node.properties;
        const ids = getIDs();
        file.data.panels?.push({
          ...ids,
          label: String(dataLabel),
        });

        // Remove `<TabItem>` props
        delete node.properties.dataLabel;
        // Turn into `<section>` with required attributes
        node.tagName = 'section';
        node.properties.id = ids.panelId;
        node.properties['aria-labelledby'] = ids.tabId;
        node.properties.role = 'tabpanel';
        node.properties.tabindex = -1;
        // Hide all panels except the first
        // TODO: make initially visible tab configurable
        if (isFirst) {
          isFirst = false;
        } else {
          node.properties.hidden = true;
        }

        // Skip over the tab panel’s children.
        return SKIP;
      });
    };
  });

/**
 * Process tab panel items to extract data for the tab links and format
 * each tab panel correctly.
 * @param html Inner HTML passed to the `<Tabs>` component.
 */
export const processPanels = (html: string) => {
  const file = tabsProcessor.processSync({ value: html });
  return {
    /** Data for each tab panel. */
    panels: file.data.panels,
    /** Processed HTML for the tab panels. */
    html: file.toString(),
  };
};
