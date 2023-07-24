<script lang="ts">
    import FileExplorerTree from "$lib/components/FileExplorerTree.svelte";
    import TextEditor from "$lib/components/TextEditor.svelte";
    import { type FSItem, FSItemType } from "$lib/models/FSItem";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    /**
     * This main page uses different Svelte mechanisms for keeping track of 2 different variables:
     * 
     * - TEXT CONTENT: for 2 way "binding" of the text content , it uses a svelte store called $textContentStore,
     * plus the bind:textContent of FileExplorerTree
     * 
     * - SELECTED FSITEM: the FileExplorerTree component notifies of a change of selected item
     * by triggering the selectedItemChanged event 
     */
    // Create a writable store to hold the textContent
    const textContentStore = writable("");
    setContext('textContentStore', textContentStore);
    let textContent: string;

    $: {
        textContentStore.set(textContent);
    }

    textContentStore.subscribe((textContentFromStore: string) => {
        textContent = textContentFromStore;
    });
    //$: $textContentStore = textContent;    
  
    let selectedFSItem: FSItem = undefined;

    /**
     * catch the selectedItemChangedHandler event triggered by FileExplorerTree
     * @param event
     */
    function selectedFSItemChangedHandler(event) {
        selectedFSItem = event.detail;
        console.log("selected item changed. New selected item:");
        console.log(selectedFSItem);        
    }

    function mainDebugButton() {
        //FSItemAPI.add();
    }
</script>

<input
    type="text"
    id="data-test-cypress-wait-for-svelte-hydratation"
    style="display: none"
    value=""
    autocomplete="off"
/>

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

<main>
    {#if selectedFSItem && selectedFSItem.type === FSItemType.FILE}
        <h1>Currently editing file {selectedFSItem.name}</h1>
    {/if}
    <div class="left-pane">
        <h1>File Explorer</h1>
        <FileExplorerTree bind:textContent on:selectedFSItemChanged={selectedFSItemChangedHandler}/>
    </div>

    <div class="right-pane">
        <h1>Text Editor</h1>
        <TextEditor />
    </div>
</main>

<style>
    /* Styling for the main page layout */
    main {
        display: flex;
        height: 100vh;
        gap: 20px;
        padding: 20px;
    }

    .left-pane,
    .right-pane {
        flex: 1;
    }
</style>
