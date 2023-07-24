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
// Function to display the name of the currently edited file
function getCurrentFileName() {
    return selectedFSItem && selectedFSItem.type === FSItemType.FILE
      ? selectedFSItem.name
      : "No file selected";
  }
</script>

<style>
    /* Styling for the main page layout */
    main {
      display: flex;
      height: 100vh;
      padding: 20px;
      background-color: #f1f1f1;
    }
  
    .left-pane {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      overflow: auto;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .left-pane h1 {
      margin-bottom: 10px;
      color: #444;
    }
  
    .right-pane {
      flex: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border: 1px solid #ccc;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .right-pane h1 {
      margin-bottom: 20px;
      color: #444;
    }
  
    /* Styling for the currently edited file name */
    .file-name {
      font-size: 18px;
      margin-bottom: 10px;
      color: #666;
    }
  </style>
  
  <main>
    <div class="left-pane">
      <h1>File Explorer</h1>
      <FileExplorerTree bind:textContent on:selectedFSItemChanged={selectedFSItemChangedHandler} />
    </div>
  
    <div class="right-pane">
      <h1>Text Editor</h1>
      <div class="file-name">Currently editing file: {getCurrentFileName()}</div>
      <TextEditor />
    </div>
  </main>