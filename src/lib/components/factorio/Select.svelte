<script lang="ts">
	interface Props<T> {
		label: string;
		value: T;
		options: Array<[string, T]>;
	}

	let { label, value = $bindable(), options }: Props<string | number> = $props();
</script>

<label class="select-label">
	{label}
	<select bind:value class="select-input">
		{#each options as [text, value]}
			<option {value}>{text}</option>
		{/each}
	</select>
</label>
