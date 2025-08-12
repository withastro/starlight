import type { ComponentChildren } from 'preact';

import './debug.css';

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

// https://github.com/cloudflare/cloudflare-docs/blob/production/src/components/ResourcesBySelector.tsx
export function IslandCfExample() {
	const visibleResources: {
		collection: string;
		id: string;
		data: {
			title: string;
			description: string;
			url: string;
		};
	}[] = [
		{
			collection: 'stream',
			id: 'example-video',
			data: {
				title: 'Example Video',
				description: 'This is an example video from Cloudflare Stream.',
				url: 'example-video-url',
			},
		},
		{
			collection: 'docs',
			id: 'example-doc',
			data: {
				title: 'Example Document',
				description: 'This is an example document from Cloudflare Docs.',
				url: 'example-doc-url',
			},
		},
	];

	return (
		<div>
			<div className={`grid grid-cols-2 gap-4`}>
				{visibleResources.map((page) => {
					const href = page.collection === 'stream' ? `/videos/${page.data.url}/` : `/${page.id}/`;

					return (
						<a
							key={page.id}
							href={href}
							className="flex flex-col gap-2 rounded-sm border border-solid border-gray-200 p-6 text-black no-underline hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
						>
							<p className="decoration-accent underline decoration-2 underline-offset-4">
								{page.data.title}
							</p>
							<span className="line-clamp-3" title={page.data.description}>
								{page.data.description}
							</span>
						</a>
					);
				})}
			</div>
		</div>
	);
}

export function IslandGraph() {
	return (
		<div>
			<svg width="640" height="400">
				<g
					transform="translate(0,370)"
					fill="none"
					font-size="10"
					font-family="sans-serif"
					text-anchor="middle"
				>
					<path class="domain" stroke="currentColor" d="M40,6V0H620V6"></path>
					<g class="tick" opacity="1" transform="translate(40,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							2023
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(89.26027397260273,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							February
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(133.75342465753425,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							March
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(183.013698630137,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							April
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(230.6849315068493,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							May
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(279.94520547945206,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							June
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(327.6164383561644,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							July
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(376.87671232876704,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							August
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(426.1369863013699,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							September
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(473.8082191780822,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							October
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(523.068493150685,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							November
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(570.7397260273973,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							December
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(620,0)">
						<line stroke="currentColor" y2="6"></line>
						<text fill="currentColor" y="9" dy="0.71em">
							2024
						</text>
					</g>
				</g>
				<g
					transform="translate(40,0)"
					fill="none"
					font-size="10"
					font-family="sans-serif"
					text-anchor="end"
				>
					<path class="domain" stroke="currentColor" d="M-6,370H0V20H-6"></path>
					<g class="tick" opacity="1" transform="translate(0,370)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							0
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,335)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							10
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,300)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							20
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,265)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							30
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,230)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							40
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,195)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							50
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,160)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							60
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,125.00000000000001)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							70
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,89.99999999999999)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							80
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,54.99999999999999)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							90
						</text>
					</g>
					<g class="tick" opacity="1" transform="translate(0,20)">
						<line stroke="currentColor" x2="-6"></line>
						<text fill="currentColor" x="-9" dy="0.32em">
							100
						</text>
					</g>
				</g>
			</svg>
		</div>
	);
}

export function IslandQuizz(props: {
	children: ComponentChildren;
	'answer-1': ComponentChildren;
	'answer-2': ComponentChildren;
	'answer-3': ComponentChildren;
}) {
	return (
		<section>
			<div>
				<h3 id="test-your-knowledge">Test your knowledge</h3>
			</div>
			{props.children}
			<form>
				<ol>
					<li>
						<label>
							<input type="radio" name="foo" />
							{props['answer-1']}
						</label>
					</li>
					<li>
						<label>
							<input type="radio" name="foo" />
							{props['answer-2']}
						</label>
					</li>
					<li>
						<label>
							<input type="radio" name="foo" />
							{props['answer-3']}
						</label>
					</li>
				</ol>
				<div>
					<button type="submit" disabled>
						Submit
					</button>
				</div>
			</form>
		</section>
	);
}

export function IslandAside(props: {
	children: ComponentChildren;
	title: ComponentChildren;
	footer: ComponentChildren;
}) {
	return (
		<aside>
			<header>{props.title}</header>
			<main>{props.children}</main>
			<footer>{props.footer}</footer>
		</aside>
	);
}

export function IslandNewsletter() {
	return (
		<form class="not-content">
			<label>
				Subscribe to our newsletter
				<input type="email" name="email" placeholder="user@example.com" required />
			</label>
			<button type="submit">Subscribe</button>
		</form>
	);
}
