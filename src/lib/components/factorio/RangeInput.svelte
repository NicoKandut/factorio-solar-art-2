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

	let stringValue = $derived(`${value.toFixed(2)}`);

	const handleChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		value = Number(input.value);
	};
</script>

<label class="numberbox-label" title={hint}>
	{label}

	<input
		type="range"
		{min}
		{max}
		{step}
		value={stringValue}
		onchange={handleChange}
		{disabled}
		placeholder={hint}
		class="range-input-slider"
	/>
	<input
		type="text"
		{min}
		{max}
		{step}
		value={stringValue}
		onchange={handleChange}
		{disabled}
		placeholder={hint}
		class="range-input-direct"
	/>
</label>

<style>
	.range-input-slider {
		flex: 1;
	}

	.range-input-direct {
		width: 3.5rem;
		height: 30px;
		text-align: center;
		font-size: 14px;
		background-color: var(--bg-light);
		box-shadow: var(--shadow-cutout);
	}
</style>
