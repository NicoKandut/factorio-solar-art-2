<script lang="ts">
    let { onfile, ref } = $props();
    const handleChange = (event) => {
        const file = event.target?.files[0];
        onfile(file);
    };
</script>

<input type="file" onchange={handleChange} multiple={false} accept="image/*" bind:this={ref} />

<style>
    input {
        display: none;
    }
</style>