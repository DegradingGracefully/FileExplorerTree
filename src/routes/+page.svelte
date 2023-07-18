<script lang="ts">
    import { onMount } from "svelte";
    import {
        FSItemAPI,
        fsItemStore
    } from "$lib/api/FSItemAPI";
    import TreeView from "$lib/components/TreeView.svelte";
    import { mockRootItem } from "../tests/cypress/fixtures/fsItemFixture1";
    import type { FSItem } from "$lib/models/FSItem";
    import FileExplorerTree from "$lib/components/FileExplorerTree.svelte";

    onMount(() => {
        // HACK: originally, the cypress line cy.get('[data-test="renameButton"]').click(); didn't work.
        // I end up understanding that it was a kind of "race" condition:
        // indeed the on:click handler wasn't yet positioned on the "renameButton" DOM element
        // at the time cypress was clicking it (in Svelte terminology, the DOM was not yet "hydrated")

        // SO, I had to add this global attribute to this Svelte page, that is set to the value "OK" 
        // to signal that Svelte has finished mounting the component
        (document.getElementById("data-test-cypress-wait-for-svelte-hydratation") as HTMLInputElement).value = "OK";

        FSItemAPI.setRootItem(mockRootItem);
    });

    function mainDebugButton() {   
        //FSItemAPI.add();
    }
  

</script>

<input type="text" id="data-test-cypress-wait-for-svelte-hydratation" style="display: none" value="" autocomplete="off" />

<center>
    <input
        type="button"
        value="Big Global Debug Button!"
        style="top: 0px ; width: 300px; padding: 10px; margin-bottom: 50px;
        font-family: calibri,'Font Awesome 5 Free';
        font-size:20px;"
        on:click={mainDebugButton}
    /><br />
</center>

<div class="container">
    <FileExplorerTree />
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }
</style>
