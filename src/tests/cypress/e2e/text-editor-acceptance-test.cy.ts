describe("FSItemAPI", () => {
    const NEW_FILE1 = "File 1 FOR TEST";
    const NEW_FILE2 = "File 2 FOR TEST";
    const NEW_FILE1_SOME_TEXT_CONTENT = "Some text content...";

    it('should persist text editions between 2 page reloads', () => {
        ///////////////////////////////////////////////
        // 1) Add 2 test files (necessitates loading the page twice, for changing the prompt stub...)
        ///////////////////////////////////////////////

        // file 1

        // stub for file 1 name
        cy.visit('http://localhost:5173/', {
            onBeforeLoad(win) {
                let promptStub = cy.stub(win, 'prompt').returns(NEW_FILE1);
            },
        });

        // !!! needed to wait for Svelte to "hydrate" the DOM
        cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
        cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

        // create file 1
        cy.get('.tree-item-name').contains('rootDirectory').rightclick().get('[data-test-item-id="create-file"]').click();

        // reload the page for creating file 2

        // stub for file 2 name
        cy.visit('http://localhost:5173/', {
            onBeforeLoad(win) {
                let promptStub = cy.stub(win, 'prompt').returns(NEW_FILE2);
            },
        });

        cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
        cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

        // create file 2
        cy.get('.tree-item-name').contains('rootDirectory').rightclick().get('[data-test-item-id="create-file"]').click();

        // ok from now on we've created the 2 files we needed for this test

        ///////////////////////////////////////////////
        // 2) Edit file 1 content
        ///////////////////////////////////////////////

        // select file 1 to load it in the text editor
        cy.get('.tree-item-name').contains(NEW_FILE1).click();

        // write in the text editor
        cy.get('[data-test-id="text-editor-text-area"]').type(NEW_FILE1_SOME_TEXT_CONTENT);
        cy.wait(1000); // ! I observed that the text content was truncated. Have to wait a bit after typing ?

        // select file 2 to change what's loaded in the editor
        cy.get('.tree-item-name').contains(NEW_FILE2).click();

        // reselect file 1 : do we still have the new content ?
        cy.get('.tree-item-name').contains(NEW_FILE1).click();
        cy.get('[data-test-id="text-editor-text-area"]').should('have.value', NEW_FILE1_SOME_TEXT_CONTENT);

        ///////////////////////////////////////////////
        // 3) Finally, reload and assert that file 1 new content has been persisted
        ///////////////////////////////////////////////

        // Reload the page
        cy.reload();
        cy.get("#data-test-cypress-wait-for-svelte-hydratation").should("have.value", "OK");
        cy.get('[data-test-item-id="expand-all-button"]').click(); // always expand before doing actions

        // reselect file 1 : do we still have the new content ?
        cy.get('.tree-item-name').contains(NEW_FILE1).click();
        cy.get('[data-test-id="text-editor-text-area"]').should('have.value', NEW_FILE1_SOME_TEXT_CONTENT);

        ///////////////////////////////////////////////
        // 4) Deleting the file (yes we need to clean up now :p)
        ///////////////////////////////////////////////

        // remove the files
        cy.get('.tree-item-name').contains(NEW_FILE1).rightclick().get('[data-test-item-id="remove-item"]').click();
        cy.get('.tree-item-name').contains(NEW_FILE2).rightclick().get('[data-test-item-id="remove-item"]').click();
    });
});