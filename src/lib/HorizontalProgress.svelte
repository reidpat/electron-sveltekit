<script>
    export let value = 0;
    export let max = 100;

    export let width = "100vw";
    export let height = "10px";
    export let backgroundColor = "#e6e6e6";
    export let progressColor = "#1095c1";
    export let left = "0px";
    export let bottom = "0px";

    $: progress = Math.min(100, Math.max(0, (value / max) * 100));
</script>

<div
    class="horizontal-progress"
    style="width: {width}; left: {left}; bottom: {bottom};"
>
    <div class="progress-fill" style="width: {progress}%;"></div>
</div>

<style>
    .horizontal-progress {
        border-radius: 15px;
        overflow: hidden;
        position: absolute;
        z-index: 1000;
        height: 0.5rem;
        overflow: hidden;
        border: 0;
        border-radius: var(--pico-border-radius);
        color: var(--pico-progress-color);
    }

    .progress-fill {
        height: 100%;
        overflow: hidden;
        position: relative;
        left: 0;
        transition: width 0.3s ease;
        background-color: var(--pico-progress-background-color);
    }
</style>