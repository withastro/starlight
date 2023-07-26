import { defineVitestConfig } from '../test-config';

export default defineVitestConfig({
	title: 'Sidebar Test',
	sidebar: [
		// A single link item labelled “Home”.
		{ label: 'Home', link: '/' },
		// A group labelled “Start Here” containing two links.
		{
			label: 'Start Here',
			items: [
				{ label: 'Introduction', link: '/intro' },
				{ label: 'Next Steps', link: '/next-steps' },
			],
		},
		// A group linking to all pages in the reference directory.
		{
			label: 'Reference',
			autogenerate: { directory: 'reference' },
		},
	],
});
