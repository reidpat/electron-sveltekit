<script>
    import { onMount } from "svelte";
    import DynamicFrame from "../lib/DynamicFrame.svelte";

    let fileName;
    let mapName = "frames-pitch";

    let currentCoordinates = {
        x: 0,
        y: 0,
    };

    let map = null;

    $: fileName = map && map[currentCoordinates.x][currentCoordinates.y].name;

    onMount(async () => {
        let fileContent = await window.electronAPI.readLocalFile(
            `C:/frames/maps/${mapName}.json`,
        );
        map = await JSON.parse(fileContent);
        console.log(map);

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    });

    function changeCoordinates(x, y) {
        if (canMove(x, y)) {
            currentCoordinates.x += x;
            currentCoordinates.y += y;
            console.log(currentCoordinates);
        }
    }

    $: canMove = (x, y) => {
        if (!map) return false;
        const newX = currentCoordinates.x + x;
        const newY = currentCoordinates.y + y;
        return map[newX] && map[newX][newY] !== undefined;
    };

    function handleKeyPress(event) {
        switch(event.key) {
            case 'ArrowLeft':
                changeCoordinates(-1, 0);
                break;
            case 'ArrowRight':
                changeCoordinates(1, 0);
                break;
            case 'ArrowUp':
                changeCoordinates(0, -1);
                break;
            case 'ArrowDown':
                changeCoordinates(0, 1);
                break;
        }
    }
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="slide-container">
    {#if fileName}
        <DynamicFrame bind:fileName />
    {/if}
</div>
<div class="map-buttons">
    <button class="outline {canMove(-1, 0) ? '' : 'secondary'}" on:click={() => changeCoordinates(-1, 0)}>Left</button>
    <div class="map-buttons-center">
        <button class="outline {canMove(0, -1) ? '' : 'secondary'}" on:click={() => changeCoordinates(0, -1)}>Up</button>
        <button class="outline {canMove(0, 1) ? '' : 'secondary'}" on:click={() => changeCoordinates(0, 1)}>Down</button>
    </div>
    <button class="outline {canMove(1, 0) ? '' : 'secondary'}" on:click={() => changeCoordinates(1, 0)}>Right</button>
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