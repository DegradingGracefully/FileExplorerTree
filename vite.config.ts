import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
			// hack for working with pouchdb
		// found @ https://github.com/pouchdb/pouchdb/issues/8286
	/*
			define: {
				global: 'window',
				process: { env: {} }
			}*/

/*
				rollupOptions: {
				  external: ['pouchdb'],
				},*/

		
};

export default config;
