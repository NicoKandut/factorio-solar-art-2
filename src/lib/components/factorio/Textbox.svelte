<script lang="ts">
	interface Props {
		value: string;
		hint: string;
		label: string;
		disabled?: boolean;
	}

	let { value = $bindable(), hint, label, disabled = false }: Props = $props();
</script>

<label class="textbox-label" title={hint}>
	{label}
	<input type="text" class="textbox-input" bind:value {disabled} placeholder={hint} />
</label>
