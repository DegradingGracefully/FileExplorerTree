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
      class="text-area"
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
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    /* Style for the textarea */
    .text-area {
      width: 100%;
      height: 90%;
      resize: none;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: border-color 0.3s ease;
    }
  
    .text-area:focus {
      outline: none;
      border-color: #4e8cff;
    }
  </style>