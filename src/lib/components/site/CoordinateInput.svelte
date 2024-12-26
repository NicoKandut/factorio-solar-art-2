<script lang="ts">
	let { x = $bindable(), y = $bindable(), hint, label, disabled = false } = $props();
</script>

<label class="textbox-label" title={hint}>
	{label}
	<div></div>
	<input type="number" class="textbox-input" bind:value={x} {disabled} placeholder={hint} />
	<input type="number" class="textbox-input" bind:value={y} {disabled} placeholder={hint} />
</label>

<style>
	div {
		flex-grow: 1;
	}
	input {
		width: 6rem;
	}
</style>
