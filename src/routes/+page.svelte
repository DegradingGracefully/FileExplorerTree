<script lang="ts">
  import FileExplorerTree from "$lib/components/FileExplorerTree.svelte";
  import TextEditor from "$lib/components/TextEditor.svelte";
  import { type FSItem, FSItemType } from "$lib/models/FSItem";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  /**
   * This main page uses different Svelte mechanisms for keeping track of 2 different variables:
   *
   * - TEXT CONTENT: the main page here creates a Svelte store called textContentStore, that only holds
   * the text content of the current item, and that it provides to both FileExplorerTree and TextEditor as a prop
   *
   * - SELECTED FSITEM: the FileExplorerTree component notifies of a change of selected item
   * by triggering the selectedItemChanged event
   */
  // Create a writable store to hold the textContent
  const textContentStore = writable("");

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

<center>
  <input
      type="button"
      value="Big Global Debug Button!"
      style="top: 0px ; width: 300px; padding: 10px; margin-bottom: 50px;
      font-family: calibri,'Font Awesome 5 Free';
      font-size:20px;
      display: none"
      on:click={mainDebugButton}
  /><br />
</center>

<main>
  <div class="left-pane">
    <FileExplorerTree
      textContentStore={textContentStore}
      on:selectedFSItemChanged={selectedFSItemChangedHandler}
    />
  </div>

  <div class="right-pane">
    {#if selectedFSItem && selectedFSItem.type === FSItemType.FILE}
      <div class="file-name">Currently editing file: {selectedFSItem.name}</div>
    {:else}
      <div class="file-name">Please select a file in the left panel to start writing.</div>
    {/if}
    <TextEditor textContentStore={textContentStore} />
  </div>
</main>

<style>
  main {
    display: flex;
    height: 100vh;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9; /* Light gray */
  }

  .left-pane {
    flex: 1;
    max-width: 300px;
    background-color: #f2f2f2; /* Off-white */
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .right-pane {
    flex: 2;
    display: flex;
    flex-direction: column;
    background-color: #fff; /* White */
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  /* Styling for the currently edited file name */
  .file-name {
    font-size: 18px;
    font-weight: bold;
    color: #185c39; /* Dark green */
    margin-bottom: 10px;
    text-align: center;
  }
</style>
