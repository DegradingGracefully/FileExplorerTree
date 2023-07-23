// code taken from https://stackoverflow.com/questions/73550514/move-cypress-folder-ts-config
// july 2023: introduced Component Testing . see https://docs.cypress.io/guides/references/configuration
// for a table of all the possible options that you can add below in this file

// july 2023: no, as of july 2023, it seems Cypress doesn't support Svelte Kit yet ! namely Component Testing doesn't work see
// https://github.com/cypress-io/cypress/issues/26064

//const { defineConfig } = require('cypress')
import { defineConfig } from "cypress";
import { svelte } from '@sveltejs/vite-plugin-svelte'

//module.exports = defineConfig({
export default defineConfig({
  // same options as Cypress v9
  fixturesFolder: "src/tests/cypress/fixtures",

  screenshotsFolder: "src/tests/cypress/screenshots",
  videosFolder: "src/tests/cypress/videos",
  downloadsFolder: "src/tests/cypress/downloads",

  // these options are specific for e2e test
  e2e: {
    // TODO : not needed ? baseUrl: 'http://localhost:1234',

    //supportFile: 'src/tests/cypress/support/e2e.js',
    supportFile: "src/tests/cypress/support/e2e.ts",

    // TODO ? "legacy pluginsFile" really needed ?
    //  import a legacy pluginsFile that has moved under /test folder
    /*setupNodeEvents(on, config) {
      return require('./src/tests/cypress/plugins/index.js')(on, config)
    },*/

    // wildcard pattern for all tests
    specPattern: "src/tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    // OR named list of tests
    /*specPattern: [
      src/tests/cypress/e2e/test1.cy.js,
      src/tests/cypress/e2e/test2.cy.js,
    ]*/
  },

  component: {
    setupNodeEvents(on, config) {
			return Object.assign({}, config);
		},
		devServer: {
			framework: 'svelte',
			bundler: 'vite',
      viteConfig: () => {
				return {
          // Code below is a fix given by Cypress developer see issue https://github.com/cypress-io/cypress/issues/26064#issuecomment-1475437226
          // problem was affecting "Component Testing" mode in cypress
          // "the problem was "SvelteKit is overwriting the base option for the Vite config." ?
					plugins: [svelte()]
				}
			}
		},

    supportFile: "src/tests/cypress/support/component.ts",
    indexHtmlFile: "src/tests/cypress/support/component-index.html",

    // wildcard pattern for all tests
    specPattern: "src/tests/cypress/component/**/*.cy.{js,jsx,ts,tsx}",
  },
});
