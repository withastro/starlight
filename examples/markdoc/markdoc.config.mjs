import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import starlightMarkdoc from '@astrojs/starlight-markdoc';

export default defineMarkdocConfig({
	extends: [starlightMarkdoc()],
});
