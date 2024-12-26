<script lang="ts">
	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		hint: string;
		label: string;
		disabled?: boolean;
	}

	let {
		value = $bindable(),
		min = undefined,
		max = undefined,
		step = undefined,
		hint,
		label,
		disabled = false
	}: Props = $props();

	let stringValue = $derived(`${value}`);

	const handleChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		value = Number(input.value);
	};
</script>

<label class="numberbox-label" title={hint}>
	{label}
	<input
		type="number"
		{min}
		{max}
		{step}
		value={stringValue}
		onchange={handleChange}
		{disabled}
		placeholder={hint}
		class="numberbox-input"
	/>
</label>
