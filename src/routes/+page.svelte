<script>
    import { onMount } from "svelte";
    import DynamicFrame from "../lib/DynamicFrame.svelte";
    import { fade } from "svelte/transition";

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

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    });

    function changeCoordinates(x, y) {
        if (canMove(x, y)) {
            if (x != 0) {
                currentCoordinates.y = 0;
            }
            currentCoordinates.x += x;
            currentCoordinates.y += y;
            console.log(currentCoordinates);
        }
    }

    $: canMove = (x, y) => {
        if (!map) return false;
        if (x != 0) {
            return map[currentCoordinates.x + x];
        }
        const newX = currentCoordinates.x + x;
        const newY = currentCoordinates.y + y;
        return map[newX] && map[newX][newY] !== undefined;
    };

    function handleKeyPress(event) {
        switch (event.key) {
            case "ArrowLeft":
                changeCoordinates(-1, 0);
                break;
            case "ArrowRight":
                changeCoordinates(1, 0);
                break;
            case "ArrowUp":
                changeCoordinates(0, -1);
                break;
            case "ArrowDown":
                changeCoordinates(0, 1);
                break;
        }
    }

    import NavigationCluster from "$lib/NavigationCluster.svelte";
    import MapNavigator from "../lib/MapNavigator.svelte";
    import VerticalProgress from "../lib/VerticalProgress.svelte";
    import HorizontalProgress from "../lib/HorizontalProgress.svelte";
    
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="slide-container">
    {#if fileName}
        <DynamicFrame bind:fileName {map} />
    {/if}
</div>

<NavigationCluster {canMove} {changeCoordinates} />
{#if map}
    <HorizontalProgress value={currentCoordinates.x} max={map.length - 1} />
    <VerticalProgress value={currentCoordinates.y} max={map[currentCoordinates.x].length - 1} />
    <MapNavigator mapData={map} bind:currentCoordinates {mapName} />
{/if}

<style>
    .slide-container {
        height: 100vh;
    }

</style>
