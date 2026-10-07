import { expect, test } from '@playwright/test';
import { BuiltInIcons } from '../src/components-internals/Icons';

const viewBoxSize = 24;
// Number precision used when optimizing icons with SVGOMG.
const svgoNumberPrecision = 2;
// Allowed tolerance for icons extending beyond the viewBox. A tolerance is required due to
// coordinates being rounded when SVGs are optimized and potential floating point imprecision.
// Such minimal tolerance and possible overflows are not visually significant.
const tolerance = 10 ** -svgoNumberPrecision;

test('SVG icons are contained within their viewBox', async ({ page }) => {
	await page.setContent(
		// We only test built-in icons and not file icons because the `file-icons-generator` already
		// fits them in the viewBox.
		Object.entries(BuiltInIcons)
			.map(
				([name, markup]) =>
					`<svg data-name="${name}" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">${markup}</svg>`
			)
			.join('')
	);

	const overflows = await page.evaluate(
		({ viewBoxSize, tolerance }) => {
			return [...document.querySelectorAll('svg')].flatMap((svg) => {
				const { x, y, width, height } = svg.getBBox();

				// Largest size the icon extends beyond any edge of the viewBox (a negative value means fully
				// inside the viewBox).
				const overflow = Math.max(-x, -y, x + width - viewBoxSize, y + height - viewBoxSize);

				return overflow > tolerance
					? [{ name: svg.dataset['name'], markup: svg.innerHTML, overflow, x, y, width, height }]
					: [];
			});
		},
		{ viewBoxSize, tolerance }
	);

	const details = overflows
		.toSorted((a, b) => b.overflow - a.overflow)
		.map(
			({ name, overflow, markup, ...bbox }) =>
				`- ${name}: ${overflow}\n\nRun the following command to generate an updated icon to review:\n\n${getFitIconInViewBoxCommand(markup, bbox)}\n`
		)
		.join('\n');

	expect(
		overflows.length,
		`${overflows.length} icon(s) extend beyond their viewBox by more than ${tolerance} units:\n\n${details}`
	).toBe(0);
});

function getFitIconInViewBoxCommand(
	markup: string,
	{ x, y, width, height }: { x: number; y: number; width: number; height: number }
) {
	// Scale ratio to shrink the icon so it fits in the viewBox (but without enlarging it if it's
	// smaller).
	const scale = Math.min(1, viewBoxSize / width, viewBoxSize / height);

	// Smallest shift to move the scaled icon back inside the viewBox.
	const translateX = Math.max(0, -scale * x) + Math.min(0, viewBoxSize - scale * (x + width));
	const translateY = Math.max(0, -scale * y) + Math.min(0, viewBoxSize - scale * (y + height));

	// Apply the computed translation and scaling to the path coordinates.
	const svg = `<svg><g transform="translate(${translateX} ${translateY}) scale(${scale})">${markup}</g></svg>`;

	// Generate an SVG command to optimize the icon like SVGOMG does.
	return `pnpm dlx svgo@4 -p ${svgoNumberPrecision} --final-newline -s '${svg}'`;
}
