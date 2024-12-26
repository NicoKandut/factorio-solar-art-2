<script lang="ts">
	let { children, value = $bindable(), disabled = false } = $props();
</script>

<label class="checkbox-label">
	<input class="checkbox-input" type="checkbox" bind:checked={value} readonly {disabled} />
	{@render children()}
</label>
