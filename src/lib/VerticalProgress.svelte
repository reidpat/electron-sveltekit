<script>
    export let value = 0;
    export let max = 100;
    export let height = "100vh";
    export let width = "10px";
    export let backgroundColor = "#e6e6e6";
    export let progressColor = "#1095c1";
    export let right = "0px";
    export let top = "0px";

    $: progress = Math.min(100, Math.max(0, (value / max) * 100));
</script>

<div
    class="vertical-progress"
    style="height: {height};  right: {right}; top: {top};"
>
    <div class="progress-fill" style="height: {progress}%;"></div>
</div>

<style>
    .vertical-progress {
        border-radius: 15px;
        right: 0px;
        top:0px;
        overflow: hidden;
        position: absolute;
        z-index: 1000;
        width: 0.5rem;
        overflow: hidden;
        border: 0;
        color: var(--pico-progress-color);
    }

    .progress-fill {
        width: 100%;
        position: fixed;
        overflow: hidden;
        top: 0;
        transition: height 0.3s ease;
        background-color: var(--pico-progress-background-color);
    }
</style>
