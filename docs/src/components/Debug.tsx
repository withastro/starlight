import type { ComponentChildren } from 'preact';

export function IslandBlock() {
	return <p>This is an Astro Island block.</p>;
}

export function IslandInline() {
	return <a href="#">Island inline link</a>;
}

export function IslandBlocks() {
	return (
		<>
			<p>This is an Astro Island block.</p>
			<p>And another block</p>
		</>
	);
}

export function IslandSlot(props: { children: ComponentChildren }) {
	return (
		<>
			<p>This is an Astro Island block START.</p>
			{props.children}
			<p>This is an Astro Island block END.</p>
		</>
	);
}
