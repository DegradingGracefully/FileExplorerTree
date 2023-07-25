<script lang="ts">
    import { type FSItem, FSItemType } from "$lib/models/FSItem";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    export let x: number;
    export let y: number;

    export let fsItemType: FSItemType;

    const dispatch = createEventDispatcher();

    function handleAddChild(type: FSItemType): void {
        dispatch("addChild", type);
    }

    function handleRename(): void {
        dispatch("rename");
        dispatch("close");
    }

    function handleRemove(): void {
        dispatch("remove");
        dispatch("close");
    }

    function handleClickOutside(event: MouseEvent): void {
        if (
            event.target instanceof HTMLElement &&
            !event.target.closest(".context-menu")
        ) {
            dispatch("close");
        }
    }

    onMount(() => {
        window.addEventListener("click", handleClickOutside);
        // how to close the menu on the right click elsewhere ? window.addEventListener("contextmenu", handleClickOutside);
    });

    onDestroy(() => {
        window.removeEventListener("click", handleClickOutside);
    });
</script>

<div class="context-menu" style="left: {x}px; top: {y}px;">
    <ul>
        {#if fsItemType === FSItemType.DIRECTORY}
            <li
                data-test-item-id="create-file"
                on:click={(event) => handleAddChild(FSItemType.FILE)}
            >
                Add File
            </li>
            <li on:click={(event) => handleAddChild(FSItemType.DIRECTORY)}>
                Add Directory
            </li>
        {/if}
        <li data-test-item-id="rename-item" on:click={handleRename}>Rename</li>
        <li data-test-item-id="remove-item" on:click={handleRemove}>Remove</li>
    </ul>
</div>

<style>
    /* Existing styles... */

    .context-menu {
        position: fixed;
        z-index: 1000;
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        padding: 0;
        list-style: none;
        font-size: 14px;
    }

    .context-menu ul {
        margin: 0;
        padding: 0;
        list-style-type: none; /** no bullet */
    }

    .context-menu li {
        padding: 8px 12px;
        cursor: pointer;
    }

    .context-menu li:hover {
        background-color: #f5f5f5;
    }
</style>
