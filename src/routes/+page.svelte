<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import Widget from "../lib/Widget.svelte";

  let DynamicComponent;
  let fileContent;
  let error;
  let target;

  async function loadComponent() {
    if (browser && window.electronAPI) {
      try {
        console.log("Attempting to read file...");
        // Read the file content
        fileContent = await window.electronAPI.readLocalFile(
          "C:/Coding/frames-electron-sveltekit/src/assets/test.js",
        );
        console.log("File content:", fileContent);

        if (!fileContent) {
          throw new Error("File content is empty");
        }

        console.log("Creating blob...");
        // Create a blob URL from the file content
        const blob = new Blob([fileContent], {
          type: "application/javascript",
        });
        const url = URL.createObjectURL(blob);

        console.log("Importing module...");
        // Dynamically import the component
        const module = await import(/* @vite-ignore */ url);
        console.log("Module imported:", module);

        DynamicComponent = module.default;
        console.log("Dynamic component:", DynamicComponent);

        // Clean up the blob URL
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error loading dynamic component:", err);
        error = err.message;
      }
    } else {
      console.error("electronAPI not available");
      error = "electronAPI not available";
    }
  }

  async function compile() {
    const response = await fetch("/api/compile");
  }

  onMount(async () => {
    await loadComponent();
  });
</script>

<a href="./api/compile">compile page</a>
<button on:click={loadComponent}>Reload Component</button>
<button on:click={compile}>Compile</button>

{#if DynamicComponent}
  <Widget this={DynamicComponent} />
{:else if fileContent}
  <pre>{fileContent}</pre>
{:else if error}
  <p>Error: {error}</p>
{:else}
  <p>Loading component...</p>
{/if}
