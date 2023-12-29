import { expect, test } from 'vitest';
import { makeVirtualStaticPaths } from '../../utils/virtual-page';

test('returns the same slug with the default language', () => {
	const { getStaticPaths } = makeVirtualStaticPaths(({ getLocalizedSlugs }) => {
		return getLocalizedSlugs(`foo/bar`)
			.map(({ slug, lang }) => {
				return {
					params: { slug },
					props: { slug, lang },
				};
			})
			.flat();
	});

	expect(getStaticPaths()).toMatchInlineSnapshot(`
		[
		  {
		    "params": {
		      "slug": "foo/bar",
		    },
		    "props": {
		      "lang": "en",
		      "slug": "foo/bar",
		    },
		  },
		]
	`);
});
