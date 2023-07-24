<script lang="ts" context="module">
    import { writable } from "svelte/store";

    // this Svelte store holds track of the id of the item on which the menu is currently open (if any)
    // indeed the rule is: there can be one and only one contextual menu opened at all time
    // therefore, all items subscribe to this store in onMount. And when they are notified that the id contained in this store
    // changes, if this id is not their own item's id => they close the contextual menu if opened
    export const idOfItemThatHasOpenedMenu = writable<number | null>(undefined);
</script>

<script lang="ts">
    import {
        FSItemAPI,
        fsItemStore,
    } from "$lib/api/FSItemAPI";
    import TreeView from "$lib/components/TreeView.svelte";
    import type { DirectoryItem, FSItem } from "$lib/models/FSItem";
    import { onMount } from "svelte";
    //import { mockRootItem } from "../../tests/cypress/fixtures/fsItemFixture1";
    import { FSItemRepository } from "$lib/api/FSItemRepository";
    //import { mockRootItem } from "../../tests/cypress/fixtures/fsItemFixture1";
        
    let searchQuery = "";

    onMount(() => {
        // First we load the root item from the db ...

        //FSItemAPI.setRootItem(mockRootItem);
        //console.log(mockRootItem.toString());

        FSItemRepository.init();
       
        FSItemRepository.loadRootFSItem().then((root: DirectoryItem) => {
            console.log("root"+root);
            FSItemAPI.setRootItem(root);
        
            // .. then we set the "flag" that indicates that everything is ready
            //  // HACK: originally, the cypress line cy.get('[data-test="renameButton"]').click(); didn't work.
            // I ended up understanding that it was a kind of "race" condition:
            // indeed the on:click handler wasn't yet positioned on the "renameButton" DOM element
            // at the time cypress was clicking it (in Svelte terminology, the DOM was not yet "hydrated")

            // SO, I had to add this global attribute to this Svelte page, that is set to the value "OK" 
            // to signal that Svelte has finished mounting the component            
            (document.getElementById("data-test-cypress-wait-for-svelte-hydratation") as HTMLInputElement).value = "OK";           
        });

        //(document.getElementById("data-test-cypress-wait-for-svelte-hydratation") as HTMLInputElement).value = "OK";
        // ...I moved the "OK" flag into the then case see above
    });
        
    /**
     * TODO: code smell ? the event handler below exists only to be able to trigger the update of the store
     * and thus trigger the update to the database.
     * @param event
     */
    function renameHandler(event: CustomEvent<FSItem>) {
        //console.log(typeof event.detail + " item" + event.detail);
        //const item: FSItem = event.detail;
        //item.updateItem(item); // TODO: code smell ? weird call        
        FSItemAPI.forceRefreshStore();
        FSItemAPI.printRootItem();
    }

    function removeHandler(event: CustomEvent<FSItem>) {
        console.log(typeof event.detail + " item" + event.detail);
        const item: FSItem = event.detail;
        if (item !== null) {
            item.getParent().remove(item);
        }
        FSItemAPI.forceRefreshStore();

        //console.log(typeof $fsItemStore + " " + $fsItemStore);
        //console.log(JSON.stringify($fsItemStore));
        //console.log(typeof ($fsItemStore as FSItem) + "  " + ($fsItemStore as FSItem));
        //console.log(($fsItemStore as FSItem).toString());
        FSItemAPI.printRootItem();
    }

    function addHandler(event: CustomEvent) {
        //console.log("parent item=" + event.detail.parentItem);
        //console.log("child item=" + event.detail.childItem);
        const parentItem: FSItem = event.detail.parentItem;
        const childItem: FSItem = event.detail.childItem;
        childItem.id = $fsItemStore?.getNextAvailableId();
        console.log("Creating child item:");
        console.log(childItem);

        parentItem.add(childItem);
        FSItemAPI.forceRefreshStore();
        FSItemAPI.printRootItem();
    }

    function handleSearch(event: CustomEvent<string>) {
        searchQuery = event.target.value.trim().toLowerCase();

        // first hide all children
        $fsItemStore?.executeOnAllChildren((item) => item.isVisible = false);

        // then redisplay all children whose name match, plus their parent

        // for that we first collect all the matching items
        const matchingItems: Array<FSItem> = $fsItemStore?.findByName(searchQuery);
        
        console.log("looping with matchingItems.forEach to set the visible flag to true...");

        // then we update these items isVisible flag
        matchingItems.forEach(function updateTheWholeBranch(item: FSItem) {
            console.log(item.name);
            item.isVisible = true;

            if (item.getParent()) {
                updateTheWholeBranch(item.getParent());
            }
        });

        console.log("whole root item with isVisible flags set to true:");
        console.log($fsItemStore);
        
        FSItemAPI.forceRefreshStore();
    }

    function handleExpandAll() {
        expandAllItems($fsItemStore);
        FSItemAPI.forceRefreshStore();
    }

    function expandAllItems(item: FSItem | null) {
        if (!item) return;
        item.isExpanded = true;
        item.getChildren()?.forEach((child) => {
            expandAllItems(child);
        });
    }
</script>

<div class="container">
    <h1>File System Explorer</h1>

    <!-- The search input field -->
    <input
        type="text"
        data-test-item-id="search-input-field"
        placeholder="Search..."
        on:input={handleSearch}
    />
    
    <!-- The Expand All button -->
    <button data-test-item-id="expand-all-button" on:click={handleExpandAll}>Expand All</button>
      ____________________________________________________________________________________________________________________________________
    {#if $fsItemStore}
        <TreeView
            item={$fsItemStore}
            on:rename={renameHandler}
            on:remove={removeHandler}
            on:addChild={addHandler}
        />
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }
</style>
