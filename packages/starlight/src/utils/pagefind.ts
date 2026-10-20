import type { Instance } from '@pagefind/component-ui';

let resolvePagefindInstance: (instance: Instance) => void;

export const pagefindInstance = new Promise<Instance>((resolve) => {
	resolvePagefindInstance = resolve;
});

export function setPagefindInstance(instance: Instance) {
	resolvePagefindInstance(instance);
}
