<script>
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { onMount } from 'svelte';

export let mapData;
export let currentCoordinates;
export let mapName;

let open = false

function goToCoordinates(x, y) {
    currentCoordinates = {x,y};
}

function isActive(x, y) {
    return currentCoordinates.x == x && currentCoordinates.y == y;
}

onMount(()=>
console.log(mapData))


import NumList from '~icons/mynaui/list-number';
</script>

{#if open}
<div
    class="map-overlay"
    on:mouseleave={() => (open = false)}
    transition:slide={{duration: 300, easing: quintOut, axis: 'y' }}
>
<!-- <a  href="/editor/{mapName}" class="btn btn-ghost top-4 left-4">Edit</a> -->
    {#each mapData as column, x}
        <div class="flex flex-col">
            {#each column as item, y}
                <button
                    class="{isActive(x, y) ? 'primary' : 'outline'}"
                    on:click={() => {
                        goToCoordinates(x, y);
                        open = false;
                    }}
                >
                    {item.name}
                </button>
            {/each}
        </div>
    {/each}
    
</div>
{:else}
<button
    class="outline navigator-icon"
    on:mouseenter={() => (open = true)}
>
    <NumList />
</button>
{/if}

<style>
    .flex {
        display: flex;
        flex-direction: column;
        
    }
    .flex > button {
        height: 5rem !important;
        width: 6rem;
        margin: 0.5rem;
        padding: 0px;
        overflow: hidden;
    }
    .outline.navigator-icon{
        position: absolute;
        bottom:0px;
        left:0px;
        border: none;
    }
.map-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-height: 70%;
    overflow-x: auto;
    overflow-y: auto;
    z-index: 50;
    display: flex;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: var(--pico-background-color);
    opacity: 0.95;
}

.btn:hover, .btn:focus {
    outline: none; /* Custom styles for focus can be added for accessibility */
}
</style>
