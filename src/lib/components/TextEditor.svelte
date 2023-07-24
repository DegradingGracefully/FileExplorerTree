<script lang="ts">
    import { onMount } from "svelte";
    import { getContext } from "svelte";

    // Get the textContentStore from context
    const textContentStore = getContext("textContentStore");

    // useless ? let textContent = "";

    // Subscribe to changes in the textContentStore and update the textContent
    // ? $ textContentStore: textContent = $textContentStore;

    // Perform updates through the textContentStore
    onMount(() => {
        // ? what is that ? $textContentStore = textContent;
    });

    // Handle changes in the textContent and update the textContentStore
    function textInputHandler(event) {
        const textInput: string = event.target.value;
        console.log("text input. Input:");
        console.log(textInput);
        $textContentStore = textInput;
    }
</script>

<div class="text-editor">
    <textarea
        value={$textContentStore}
        placeholder="Start writing here..."
        on:input={textInputHandler}
    />
</div>

<style>
    /* ... existing styles ... */

    .text-editor {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
</style>
