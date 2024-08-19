<script>
    import { fade } from "svelte/transition";
    import ChevronUp from "~icons/mynaui/chevron-up";
    import ChevronDown from "~icons/mynaui/chevron-down";
    import ChevronLeft from "~icons/mynaui/chevron-left";
    import ChevronRight from "~icons/mynaui/chevron-right";

    export let canMove;
    export let changeCoordinates;
</script>

<div class="map-buttons">
    <button class="left" on:click={() => changeCoordinates(-1, 0)}>
        <div class="button-content">
            {#if canMove(-1, 0)}
                <div transition:fade={{ duration: 200 }}>
                    <ChevronLeft />
                </div>
            {/if}
        </div>
    </button>
    <button class="up" on:click={() => changeCoordinates(0, -1)}>
        <div class="button-content">
            {#if canMove(0, -1)}
                <div transition:fade={{ duration: 200 }}>
                    <ChevronUp />
                </div>
            {/if}
        </div>
    </button>
    <button class="down" on:click={() => changeCoordinates(0, 1)}>
        <div class="button-content">
            {#if canMove(0, 1)}
                <div transition:fade={{ duration: 200 }}>
                    <ChevronDown />
                </div>
            {/if}
        </div>
    </button>
    <button class="right" on:click={() => changeCoordinates(1, 0)}>
        <div class="button-content">
            {#if canMove(1, 0)}
                <div transition:fade={{ duration: 200 }}>
                    <ChevronRight />
                </div>
            {/if}
        </div>
    </button>
</div>

<style>
    .map-buttons {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 150px;
        height: 150px;
        display: grid;
        grid-template-areas:
            ". up ."
            "left . right"
            ". down .";
        gap: 0px;
        background-color: none;
    }
    button {
        width: 50px;
        height: 50px;
        padding: 0;
        background: none;
        border: none;
        color: var(--pico-primary);
        cursor: pointer;
        position: relative;
    }
    .button-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
    }
    .left {
        grid-area: left;
    }
    .up {
        grid-area: up;
    }
    .down {
        grid-area: down;
    }
    .right {
        grid-area: right;
    }
</style>
