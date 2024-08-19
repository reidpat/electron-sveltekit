<script>
    import { fly } from "svelte/transition";

    let vsCodePath = "C:/Coding/frames";

    export let fileName;
    export let loadComponent;
    export let map;

    let show = false;

    function toggleShow() {
        show = !show;
    }

    import Menu from "~icons/mynaui/menu";

    async function compile(name) {
        // console.log(app);
        let compile = window.electronAPI.compileSvelte(
            `C:/frames/frames/${name}.svelte`,
            `C:/frames/compiled/${name}.js`,
        );
    }

    async function compileAllInMap(){
        for(let x = 0; x < map.length; x++){
            for(let y = 0; y < map[x].length; y++){
                console.log(map[x][y].name);
                compile(map[x][y].name);
            }
        }
    }
</script>

<div class="top-buttons">
    {#if show}
        <div
            on:mouseleave={toggleShow}
            transition:fly={{ y: -100, duration: 100 }}
        >
            <button on:click={loadComponent}>Reload Component</button>
            <button on:click={()=> compile(fileName)}>Compile</button>
            <button on:click={compileAllInMap}>Compile All</button>
            <a
                href="vscode://file/{vsCodePath}\src\lib\frames\{fileName}.svelte"
                ><button>Edit</button></a
            >
        </div>
    {:else}
        <button class="secondary" on:mouseenter={toggleShow}><Menu /></button>
    {/if}
</div>

<style>
    .top-buttons {
        position: absolute;
        top: 0;
    }
    .secondary {
        border: none;
        background: none;
        position: absolute;
        top: 0;
    }
</style>
