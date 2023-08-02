<script lang="ts">
  import { onMount } from "svelte";
  import { getContext } from "svelte";

  export let textContentStore;

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
    data-test-id="text-editor-text-area"
    value={$textContentStore}
    placeholder="Start writing here..."
    on:input={textInputHandler}
  />
</div>

<style>
  .text-editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #f2f2f2; /* Off-white */
  }
  .text-editor textarea {
    width: 100%;
    height: 100%;
    resize: none;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff; /* White */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
  }

  .text-editor textarea:focus {
    outline: none;
    border-color: #4e8cff; /* Light blue */
  }
</style>
