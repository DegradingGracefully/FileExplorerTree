import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		// from https://kit.svelte.dev/docs/configuration#alias
		alias: {
			// this will match a directory and its contents
			// (`my-directory/x` resolves to `path/to/my-directory/x`)
			//'cypress': 'cypress' // TODO: remove. Aliases are only for accessing subfolder of src ?
			// TODO : find a way for SvelteKit to access cypress/fixtures folder, to share the fixtures
			// must be a SvelteKit or a Vite configuration option somewhere ...?
			// I will createa an issue on SvelteKit GitHub as I found mention of this kind of configuration in the docs
		},

		// hack for working with pouchdb
		// found @ https://github.com/pouchdb/pouchdb/issues/8286
		/*vite: {
			define: {
				global: 'window',
				process: { env: {} }
			}
		}*/
	}
};

export default config;
