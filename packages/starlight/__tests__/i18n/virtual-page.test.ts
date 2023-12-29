import { expect, test } from 'vitest';
import { makeVirtualStaticPaths } from '../../utils/virtual-page';

test('returns all the localized slugs with the associated languages', () => {
	const { getStaticPaths } = makeVirtualStaticPaths(({ getLocalizedSlugs }) => {
		return getLocalizedSlugs(`test/foo`)
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
		      "slug": "fr/test/foo",
		    },
		    "props": {
		      "lang": "fr",
		      "slug": "fr/test/foo",
		    },
		  },
		  {
		    "params": {
		      "slug": "en/test/foo",
		    },
		    "props": {
		      "lang": "en-US",
		      "slug": "en/test/foo",
		    },
		  },
		  {
		    "params": {
		      "slug": "ar/test/foo",
		    },
		    "props": {
		      "lang": "ar",
		      "slug": "ar/test/foo",
		    },
		  },
		  {
		    "params": {
		      "slug": "pt-br/test/foo",
		    },
		    "props": {
		      "lang": "pt-BR",
		      "slug": "pt-br/test/foo",
		    },
		  },
		]
	`);
});
