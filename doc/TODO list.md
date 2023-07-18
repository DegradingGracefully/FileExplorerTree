# OK / Exploring the model of Files / Directories json to define the Typescript structure

* write some json examples, for exploring purposes

Q1: do files have the children property ? is it mandatory that this property is present ?
{
    "type": "F",
    "name": "a-file-at-the-root-of-tree",
    "children": []
}

* then, from these json examples, we can extract the Typescript classes
* then try to integrate these Typescript models into Dexie (see next feature)

# OK / write files and directories fixtures

# OK / display the fixtures in a Svelte component

# PENDING: introduce unit / integration testing / TDDing with Cypress or some other tools (see items below)
(would be good to have tests in place and working once I start the next step of integrating the models into Dexie)

# OK : install Cypress and validates the set up by confirming that it sees the FileAndDirectory items (raw text items) written in the page in +page.svelte

# OK: Cypress works. Now we need to use TypeScript with it and write specs.ts files instead of Cypress default specs.js files : Set up TypeScript for Cypress
https://dzone.com/articles/cypress-typescript-end-to-end-automation-testing-from-scratch

# TODO: configure Cypress code completion
"You can read the Cypress IntelliSense guide on how to set it up."
https://glebbahmutov.com/blog/cypress-js-to-ts/#step-2-configure-the-intelligent-code-completion

############# DEXIE INTEGRATION

# OK Dexie populating triggered on load see onMount in page.svelte

# TODO: continue working on Dexie later... For now we load hard coded data

################ programming the API

# OK FSUnit new composite class

# write a long story that tests CRUD functions on the API, and search functions etc...
(that is the exploring part of TDD. That is, CRUDing directories, searching for files...
are things that I know I will need. Therefore, I explore all these known functions, to get a chance
to discover beforehand some subtelties or aspects of building the API that I didn't think about.
BUT I still don't build anything that I won't need ;)

# write the json so that it can be injected into the FSUnit class ?
 
# write a first simple story (load json )

# ??: use the models into Dexie

################ the acceptance test
# CLEAN THE CYPRESS UNIT TEST (rename folders and unit-test-TDD.cy.ts properly for later, etc...)

# OK move the new FSItem and FSItemAPI classes under Svelte model folder

# OK should we move the whole cypress folder under svelte folder ?
check how cypress can access this folder
UPDATE => cypress file structure => actually we can move all cypress subfolders to svelte/tests and configure Cypress so that is works in that subfolder ?
https://docs.cypress.io/guides/references/configuration#Folders--Files
https://stackoverflow.com/questions/49196173/move-cypress-folder-from-the-root-of-the-project

new content of cypress.config.ts found at:
https://stackoverflow.com/questions/73550514/move-cypress-folder-ts-config

# OK the fixture folder has been moved: update all pathes that import fixtures
TODO: what a mess these fixtures. Needs cleaning some time !

# OK we've created a new different composite pattern style FSItem class => inject this new FSItem mock in the existing Svelte code to display it as before, in place of the old FileAndDirectory class

################ UI now! coding the file and directory features in page.svelte!

# add 5 global buttons (rename, delete... )
# the rename feature
    * Add Checkbox In Front Of Each FSItem
    * add a global state for knowing which FSItem is slected
    

################ misc

# OK Introduced a logging library: tslog

=> !!! after thinking a bit more about adding the tslog dependency => since I plan to share this code, that could be improved or reused => better have the least dependencies possible ??? remove tslog ?



I want to refactor the whole FSItem svelte project. The aim of the project is now to create a Svelte component that i will share on github. It will be called FSTree . The data of this FSTree will be managed by an FSItemAPI class. This class exposes static methods that some other code calls to set the root FS Item, add an FSItem, remove, etc.. the CRUD methods. In the background, this FSItemAPI class stores its data in dexie. Also, the root FSItem that the FSItemAPI manages is binded to an FSTree svelte component. Each time we call FSItemAPI.add(newFSitem) for example, the FSTree component must be automatically updated. ie the new FSItem should be added to the Svelte tree.

------
last step, for the end, when I will publish the svelte component: see chatgpt detailed answer (I really have to use a bundler like Rollup ...?)
"This way, users who install the FSTree component will have access to the complete functionality without needing to separately install the FSItemAPI or Dexie dependencies."