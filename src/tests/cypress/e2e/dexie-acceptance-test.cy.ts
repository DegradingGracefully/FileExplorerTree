describe("FSItemAPI", () => {
  const NEW_FILE_NAME = "I am a new File";
  const NEW_FILE_NAME_RENAMED = "I am a new File and I've been RENAMED";

  it('should persist the new file and its rename after page reload', () => {
    ///////////////////////////////////////////////
    // 1) Adding a file
    ///////////////////////////////////////////////

    // First we need to set up the test : we load page and we prepare the prompt where we write the file name
    cy.visit('http://localhost:5173/', {
      // TODO: only way to use a prompt is here in cy.visit ... ?
      // https://docs.cypress.io/api/commands/stub#Replace-built-in-window-methods-like-prompt
      // https://stackoverflow.com/questions/73903455/cypress-is-it-possible-to-verify-text-in-prompt
      onBeforeLoad(win) {
        // Stub your functions here
        let promptStub = cy.stub(win, 'prompt').returns(NEW_FILE_NAME);
      },
    });

    // !!! needed to wait for Svelte to "hydrate" the DOM
    cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
    cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

    // now create the new file (actually triggers the creation, which is done through the prompt stub)
    cy.get('.tree-item-name').contains('rootDirectory').rightclick().get('[data-test-item-id="create-file"]').click();

    //cy.get('.tree-item-name').contains(NEW_FILE_NAME).should('exist');
    // NO. We don't need to test that the newly created file was added to the tree.
    // The purpose of this test case is to test the db, we're not testing the create feature here

    // Reload the page
    cy.reload();
    cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
    cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

    // Assert that the new file is still present
    cy.get('.tree-item-name').contains(NEW_FILE_NAME).should('exist');

    ///////////////////////////////////////////////
    // 2) Renaming a file
    ///////////////////////////////////////////////

    // First we need to set up the test : we reload page and we prepare the prompt where we write the new name of the file for renaming it
    cy.visit('http://localhost:5173/', {
      // TODO: only way to use a prompt is here in cy.visit ... ?
      // https://docs.cypress.io/api/commands/stub#Replace-built-in-window-methods-like-prompt
      // https://stackoverflow.com/questions/73903455/cypress-is-it-possible-to-verify-text-in-prompt
      onBeforeLoad(win) {
        // Stub your functions here
        let promptStub = cy.stub(win, 'prompt').returns(NEW_FILE_NAME_RENAMED);
      },
    });

    // !!! needed to wait for Svelte to "hydrate" the DOM
    cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
    cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

    // now rename the new file (actually triggers the renaming, which is done through the prompt stub)
    cy.get('.tree-item-name').contains(NEW_FILE_NAME).rightclick().get('[data-test-item-id="rename-item"]').click();

    // Reload the page
    cy.reload();
    cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
    cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

    // Assert that the file is still correctly renamed
    cy.get('.tree-item-name').contains(NEW_FILE_NAME_RENAMED).should('exist');

    ///////////////////////////////////////////////
    // 3) Deleting the file (yes we need to clean up now :p)
    ///////////////////////////////////////////////

    // remove the file
    cy.get('.tree-item-name').contains(NEW_FILE_NAME_RENAMED).rightclick().get('[data-test-item-id="remove-item"]').click();

    // Reload the page
    cy.reload();
    cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
    cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

    // Assert that the file is still correctly gone
    cy.get('.tree-item-name').contains(NEW_FILE_NAME_RENAMED).should('not.exist');
  });
});