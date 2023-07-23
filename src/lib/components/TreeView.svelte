<script lang="ts">
  import {
    FSItem,
    FileItem,
    DirectoryItem,
    FSItemType,
  } from "$lib/models/FSItem";
  import { idOfItemThatHasOpenedMenu } from "$lib/components/FileExplorerTree.svelte";
  import { createEventDispatcher, onMount } from "svelte";

  import ContextMenu from '$lib/components/ContextMenu.svelte';

  export let item: FSItem;
  
  const isDirectory: boolean = item.type === "D";
  let expanded: boolean = false;
  const dispatch = createEventDispatcher();

  let contextMenuX = 0;
  let contextMenuY = 0;
  let showContextMenu = false;

  onMount(() => {
    idOfItemThatHasOpenedMenu.subscribe((idOfItemThatHasOpenedMenu: number | null) => {
      //console.log("idOfItemThatHasOpenedMenu from store has changed value. New id=" + idOfItemThatHasOpenedMenu);
      //console.log(item.id);

      if (showContextMenu && idOfItemThatHasOpenedMenu !== item.id) {
        hideContextMenu();
      }
    });
  });

  function toggleExpanded(): void {
    item.isExpanded = !item.isExpanded;
  }

  function showContextMenuHandler(event: MouseEvent, item: FSItem): void {
    if (!showContextMenu) {    
    // checks that another menu is not already open. Only one menu for one item open at all time
      event.preventDefault();
      contextMenuX = event.clientX;
      contextMenuY = event.clientY;
      showContextMenu = true;

      $idOfItemThatHasOpenedMenu = item.id;
    }
  }

  function hideContextMenu(): void {
    showContextMenu = false;
  }

  function rename(): void {
    const newName = prompt("Enter a new name:", item.name);
    if (newName) {
      item.name = newName;
    }
    dispatch("rename");
  }

  function remove(): void {
    if (confirm(`Are you sure you want to remove ${item.name}?`)) {
      console.log("ok");
      dispatch("remove", item);
    }
  }

  function addChild(event: CustomEvent<FSItemType>): void {
    const fsItemTypeToCreate = event.detail;
    const childName = prompt(`Enter the name for the new ${fsItemTypeToCreate}:`);
    let child: FSItem;

    if (childName) {
      if (fsItemTypeToCreate === FSItemType.FILE) {
        child = new FileItem(500, fsItemTypeToCreate, childName);
      } else {
        child = new DirectoryItem(500, fsItemTypeToCreate, childName);
      }
      dispatch("addChild", { parentItem: item, childItem: child });
    }
    hideContextMenu();
  }
</script>

{#if item.isVisible }
  <div class="tree-item">
    <div class="tree-item-header">
      <div class="toggle-button-space">
        {#if isDirectory}
          <button class="toggle-button" on:click={toggleExpanded}>
            {item.isExpanded ? "▼" : "▶"}
          </button>
        {:else}
          <div class="toggle-button" />
        {/if}
      </div>
    
      <div class="tree-item-name" data-test-item-id="{item.id}" on:contextmenu={(event) => showContextMenuHandler(event, item)} >{item.name}</div>
    </div>

    {#if isDirectory && item.isExpanded && item.getChildren()}
      <div class="tree-item-children">
        {#each item.getChildren() as child (child.id)}
          <svelte:self item={child} on:addChild on:rename on:remove />
        {/each}
      </div>
    {/if}
  </div>
{/if}

{#if showContextMenu}
  <ContextMenu
    x={contextMenuX}
    y={contextMenuY}
    fsItemType={item.type}
    on:addChild={addChild}
    on:rename={rename}
    on:remove={remove}
    on:close={hideContextMenu}
  />
{/if}

<style>
  .tree-item {
    margin-left: 10px;
  }

  .tree-item-header {
    display: flex;
    align-items: center;
  }

  .toggle-button-space {
    display: flex;
    align-items: center;
    width: 16px; /* Adjust as needed */
  }

  .toggle-button {
    border: none;
    background-color: transparent;
    color: #777;
    font-size: 14px;
    cursor: pointer;
  }

  .tree-item-name {
    font-weight: bold;
    margin-left: 5px; /* Adjust as needed */
  }

  .tree-item-children {
    margin-left: 20px;
    border-left: 1px dashed #ccc;
    padding-left: 10px;
  }
</style>
