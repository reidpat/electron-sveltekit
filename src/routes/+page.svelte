<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import Widget from "../lib/Widget.svelte";

  let DynamicComponent;
  let fileContent;
  let error;
  let target;

  let data;

  async function loadComponent() {
    if (browser && window.electronAPI) {
      try {
        
        fileContent = await window.electronAPI.readLocalFile(
          "C:/frames/test.js",
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
        let url = URL.createObjectURL(blob);
        // url += `?${parseInt(Math.random() * 1000000)}`

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

  import { invalidateAll } from '$app/navigation';
  // import {app} from 'electron'
  async function compile() {
    // console.log(app);
    let compile = window.electronAPI.compileSvelte("C:/frames/test.svelte", "C:/frames/test.js");
  }

  onMount(async () => {
    console.log(data);
    await loadComponent();
  });
  
</script>

<a href="./api/compile">compile page</a>
<button on:click={loadComponent}>Reload Component</button>
<button on:click={compile}>Compile</button>

{#if DynamicComponent}
  <Widget this={DynamicComponent} />
{:else if fileContent}
  <!-- <pre>{fileContent}</pre> -->
{:else if error}
  <p>Error: {error}</p>
{:else}
  <p>Loading component...</p>
{/if}
