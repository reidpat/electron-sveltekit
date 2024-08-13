<script>
    async function compile() {
        const response = await fetch("/api/compile");
        const text = await response.text();
        console.log(text);
    }
</script>

<button on:click={compile}>Compile</button>