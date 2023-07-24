<script lang="ts">
    import FileExplorerTree from "$lib/components/FileExplorerTree.svelte";

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
