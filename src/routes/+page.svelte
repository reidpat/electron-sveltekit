<script>
    import { onMount } from "svelte";
    import DynamicFrame from "../lib/DynamicFrame.svelte";

    let fileName;
    let mapName = "frames-pitch";

    let currentCoordinates = {
        x: 0,
        y: 0,
    };

    let map;

    $: () => {
        if (map) {
            fileName = map[currentCoordinates.x][currentCoordinates.y].name;
            console.log(fileName);
        }
    };

    onMount(async () => {
        let fileContent = await window.electronAPI.readLocalFile(
            `C:/frames/maps/${mapName}.json`,
        );
        map = await JSON.parse(fileContent);
        fileName = map[currentCoordinates.x][currentCoordinates.y].name;
        console.log(map);
    });

    function changeCoordinates(x, y) {
        if (
            !map[currentCoordinates.x + x] ||
            !map[currentCoordinates.x + x][currentCoordinates.y + y]
        ) {
            return;
        }
        currentCoordinates.x += x;
        currentCoordinates.y += y;
        fileName = map[currentCoordinates.x][currentCoordinates.y].name;
        console.log(currentCoordinates);
    }
</script>

<div class="slide-container">
    {#if fileName}
        <DynamicFrame bind:fileName />
    {/if}
</div>
<div class="map-buttons">
    <button on:click={() => changeCoordinates(-1, 0)}>Left</button>
    <div class="map-buttons-center">
        <button on:click={() => changeCoordinates(0, -1)}>Up</button>
        <button on:click={() => changeCoordinates(0, 1)}>Down</button>
    </div>
    <button on:click={() => changeCoordinates(1, 0)}>Right</button>
</div>

<style>
    .slide-container{
        height: 100vh;
    }
    .map-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        position: absolute;
        right: 20px;
        bottom: 20px;
    }
    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }
    button:hover {
        background-color: #f0f0f0;
    }
    button:active {
        background-color: #e0e0e0;
    }
    button:focus {
        outline: none;
    }

    .map-buttons-center {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
