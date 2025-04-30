import { compile } from 'tailwindcss';
import { transform } from 'lightningcss';
import { test, expect, describe } from 'vitest';
import starlightTailwindCss from '../tailwind.css?raw';

const css = String.raw;

test('generates base and utilities CSS layers and defines default theme values', async () => {
	const output = await render();

	// The first line includes Tailwind version so we skip it.
	const outputWithoutVersion = output.split('\n').slice(1).join('\n');
	expect(outputWithoutVersion).toMatchInlineSnapshot(`
		"@layer theme;

		@layer base {
		  *, :after, :before {
		    border: 0 solid;
		  }

		  html, :host {
		    font-family: var(--font-sans);
		  }

		  code, kbd, samp, pre {
		    font-family: var(--font-mono);
		  }
		}

		@layer components;

		@layer utilities {
		  :root {
		    --sl-font: var(--font-sans);
		    --sl-font-mono: var(--font-mono);
		    --sl-color-white: var(--color-white);
		    --sl-color-gray-1: var(--color-gray-200);
		    --sl-color-gray-2: var(--color-gray-300);
		    --sl-color-gray-3: var(--color-gray-400);
		    --sl-color-gray-4: var(--color-gray-600);
		    --sl-color-gray-5: var(--color-gray-700);
		    --sl-color-gray-6: var(--color-gray-800);
		    --sl-color-black: var(--color-gray-900);
		    --sl-color-accent-low: var(--color-accent-950, var(--color-accent-900, #1e1b4b));
		    --sl-color-accent: var(--color-accent-600, #4f46e5);
		    --sl-color-accent-high: var(--color-accent-200, #c7d2fe);

		    &[data-theme="light"] {
		      --sl-color-white: var(--color-gray-900);
		      --sl-color-gray-1: var(--color-gray-800);
		      --sl-color-gray-2: var(--color-gray-700);
		      --sl-color-gray-3: var(--color-gray-500);
		      --sl-color-gray-4: var(--color-gray-400);
		      --sl-color-gray-5: var(--color-gray-300);
		      --sl-color-gray-6: var(--color-gray-200);
		      --sl-color-gray-7: var(--color-gray-100);
		      --sl-color-black: var(--color-white);
		      --sl-color-accent-low: var(--color-accent-200, #c7d2fe);
		      --sl-color-accent: var(--color-accent-600, #4f46e5);
		      --sl-color-accent-high: var(--color-accent-900, #312e81);
		    }
		  }
		}

		:root, :host {
		  --color-accent-200: var(--color-indigo-200);
		  --color-accent-600: var(--color-indigo-600);
		  --color-accent-900: var(--color-indigo-900);
		  --color-accent-950: var(--color-indigo-950);
		  --color-gray-100: var(--color-zinc-100);
		  --color-gray-200: var(--color-zinc-200);
		  --color-gray-300: var(--color-zinc-300);
		  --color-gray-400: var(--color-zinc-400);
		  --color-gray-500: var(--color-zinc-500);
		  --color-gray-600: var(--color-zinc-600);
		  --color-gray-700: var(--color-zinc-700);
		  --color-gray-800: var(--color-zinc-800);
		  --color-gray-900: var(--color-zinc-900);
		}
		"
	`);
});

describe('@theme', () => {
	function getRootVariables(output: string) {
		return output.match(/:root, :host {(.*?)}\n*$/s)?.[1];
	}

	test('defines Tailwind variables with Starlight defaults', async () => {
		const output = await render();
		const rootVariables = getRootVariables(output);

		expect(rootVariables).toMatchInlineSnapshot(`
			"
			  --color-accent-200: var(--color-indigo-200);
			  --color-accent-600: var(--color-indigo-600);
			  --color-accent-900: var(--color-indigo-900);
			  --color-accent-950: var(--color-indigo-950);
			  --color-gray-100: var(--color-zinc-100);
			  --color-gray-200: var(--color-zinc-200);
			  --color-gray-300: var(--color-zinc-300);
			  --color-gray-400: var(--color-zinc-400);
			  --color-gray-500: var(--color-zinc-500);
			  --color-gray-600: var(--color-zinc-600);
			  --color-gray-700: var(--color-zinc-700);
			  --color-gray-800: var(--color-zinc-800);
			  --color-gray-900: var(--color-zinc-900);
			"
		`);
	});

	test('defines Tailwind variables with custom values', async () => {
		// const output = await render();
		const output = await render(
			['dark:bg-black'],
			css`
				@theme {
					/* Custom accent color. */
					--color-accent-50: var(--color-orange-50);
					--color-accent-100: var(--color-orange-100);
					--color-accent-200: var(--color-orange-200);
					--color-accent-300: var(--color-orange-300);
					--color-accent-400: var(--color-orange-400);
					--color-accent-500: var(--color-orange-500);
					--color-accent-600: var(--color-orange-600);
					--color-accent-700: var(--color-orange-700);
					--color-accent-800: var(--color-orange-800);
					--color-accent-900: var(--color-orange-900);
					--color-accent-950: var(--color-orange-950);
					/* Custom gray scale. */
					--color-gray-50: var(--color-violet-50);
					--color-gray-100: var(--color-violet-100);
					--color-gray-200: var(--color-violet-200);
					--color-gray-300: var(--color-violet-300);
					--color-gray-400: var(--color-violet-400);
					--color-gray-500: var(--color-violet-500);
					--color-gray-600: var(--color-violet-600);
					--color-gray-700: var(--color-violet-700);
					--color-gray-800: var(--color-violet-800);
					--color-gray-900: var(--color-violet-900);
					--color-gray-950: var(--color-violet-950);
					/* Custom text font. */
					--font-sans: 'Atkinson Hyperlegible';
					/* Custom code font. */
					--font-mono: 'IBM Plex Mono';
				}
			`
		);
		const rootVariables = getRootVariables(output);

		expect(rootVariables).toMatchInlineSnapshot(`
			"
			  --color-accent-200: var(--color-orange-200);
			  --color-accent-600: var(--color-orange-600);
			  --color-accent-900: var(--color-orange-900);
			  --color-accent-950: var(--color-orange-950);
			  --color-gray-100: var(--color-violet-100);
			  --color-gray-200: var(--color-violet-200);
			  --color-gray-300: var(--color-violet-300);
			  --color-gray-400: var(--color-violet-400);
			  --color-gray-500: var(--color-violet-500);
			  --color-gray-600: var(--color-violet-600);
			  --color-gray-700: var(--color-violet-700);
			  --color-gray-800: var(--color-violet-800);
			  --color-gray-900: var(--color-violet-900);
			  --font-sans: "Atkinson Hyperlegible";
			  --font-mono: "IBM Plex Mono";
			"
		`);
	});
});

describe('@layer base', async () => {
	const output = await render();
	const baseLayer = output.match(/@layer base {(.*?)}[\s\n]*@layer/s)?.[1];

	test('restores some styles from Tailwind Preflight in the base layer', () => {
		expect(baseLayer).toMatch(/html, :host {[\s\n]+font-family: var\(--font-sans\);[\s\n]+}/);
		expect(baseLayer).toMatch(
			/code, kbd, samp, pre {[\s\n]+font-family: var\(--font-mono\);[\s\n]+}/
		);
	});
});

describe('@layer utilities', async () => {
	const output = await render(
		['dark:bg-black'],
		css`
			@theme {
				--color-black: #000;
			}
		`
	);
	const utilitiesLayer = output.match(/@layer utilities {(.*?)}[\s\n]*:root, :host/s)?.[1];

	test('configures `--sl-color-*` variables', () => {
		expect(utilitiesLayer).includes('--sl-color-gray-1: var(--color-gray-200);');
		expect(utilitiesLayer).includes('--sl-color-accent: var(--color-accent-600, #4f46e5);');
	});

	test('uses [data-theme="dark"] for dark: utility classes', async () => {
		expect(utilitiesLayer).toMatchInlineSnapshot(`
			"
			  .dark\\:bg-black {
			    &:where([data-theme="dark"], [data-theme="dark"] *) {
			      background-color: var(--color-black);
			    }
			  }

			  :root {
			    --sl-font: var(--font-sans);
			    --sl-font-mono: var(--font-mono);
			    --sl-color-white: var(--color-white);
			    --sl-color-gray-1: var(--color-gray-200);
			    --sl-color-gray-2: var(--color-gray-300);
			    --sl-color-gray-3: var(--color-gray-400);
			    --sl-color-gray-4: var(--color-gray-600);
			    --sl-color-gray-5: var(--color-gray-700);
			    --sl-color-gray-6: var(--color-gray-800);
			    --sl-color-black: var(--color-gray-900);
			    --sl-color-accent-low: var(--color-accent-950, var(--color-accent-900, #1e1b4b));
			    --sl-color-accent: var(--color-accent-600, #4f46e5);
			    --sl-color-accent-high: var(--color-accent-200, #c7d2fe);

			    &[data-theme="light"] {
			      --sl-color-white: var(--color-gray-900);
			      --sl-color-gray-1: var(--color-gray-800);
			      --sl-color-gray-2: var(--color-gray-700);
			      --sl-color-gray-3: var(--color-gray-500);
			      --sl-color-gray-4: var(--color-gray-400);
			      --sl-color-gray-5: var(--color-gray-300);
			      --sl-color-gray-6: var(--color-gray-200);
			      --sl-color-gray-7: var(--color-gray-100);
			      --sl-color-black: var(--color-white);
			      --sl-color-accent-low: var(--color-accent-200, #c7d2fe);
			      --sl-color-accent: var(--color-accent-600, #4f46e5);
			      --sl-color-accent-high: var(--color-accent-900, #312e81);
			    }
			  }
			"
		`);
	});
});

// https://github.com/tailwindlabs/tailwindcss/blob/61af484ff4f34464b317895598c49966c132b410/packages/tailwindcss/src/test-utils/run.ts
async function render(candidates: string[] = [], theme: string = '') {
	let { build } = await compile(css`
		@layer theme, base, components, utilities;

		@layer utilities {
			@tailwind utilities;
		}

		${starlightTailwindCss}

		${theme}
	`);

	return transform({
		code: Uint8Array.from(Buffer.from(build(candidates))),
		filename: 'test.css',
	}).code.toString();
}
