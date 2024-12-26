<script lang="ts">
	import Item from '$lib/components/factorio/Item.svelte';
	import { watts } from '$lib/logic/numberformatting';
	import { config } from '$lib/store/config.svelte';
	import { getImageSize } from '$lib/store/upload.svelte';
	import { getStatistics } from '$lib/store/statistics.svelte';
	import Panel from '../factorio/Panel.svelte';
	import Section from '../factorio/Section.svelte';

	const perfectVanillaRatio = 21 / 25;
	const panelMax = {
		'se-space-solar-panel': 400e3,
		'se-space-solar-panel-2': 800e3,
		'se-space-solar-panel-3': 1600e3,
		'solar-panel': 60e3
	};
	const accumulatorMax = {
		accumulator: 5e6,
		'se-space-accumulator': 50e6,
		'se-space-accumulator-2': 250e6
	};

	const accumulatorType = 'accumulator';
	const panelType = 'solar-panel';

	const perfectRatio = perfectVanillaRatio;

	const ratingOf = (value: number, perfectRatio: number) => {
		const diff = Math.abs(value - perfectRatio);
		if (diff < 0.1) return 'perfect';
		if (diff < 0.5) return 'good';
		if (diff < 1) return 'fair';
		if (diff < 5) return 'bad';
		else return 'awful';
	};

	const statistics = getStatistics();

	const empty = $derived(Object.values(statistics).reduce((a, b) => a + b, 0) === 0);

	const ratio = $derived(statistics[accumulatorType] / statistics[panelType]);
</script>

<Section title="Statistics">
	{#snippet content()}
		{#if empty}
			<p>No statistics available.<br />Generate a blueprint to see statistics.</p>
			<div class="statistics-width">
				<Panel>
					<div class="item-list">
						<div class="slot"></div>
						<div class="slot"></div>
					</div>
				</Panel>
			</div>
		{:else}
			<div class="statistics">
				<Panel>
					<h2>Items</h2>
					<div class="item-list">
						{#each Object.keys(statistics) as name (name)}
							{#if statistics[name] !== 0}
								<div class="slot">
									<Item {name} count={statistics[name]} />
								</div>
							{/if}
						{/each}
					</div>
				</Panel>
				<Panel>
					<h2>Size</h2>
					<div class="stat-row">
						<span>Width</span>
						<span>{getImageSize().width * config.tileSize} tiles</span>
					</div>
					<div class="stat-row">
						<span>Height</span>
						<span>{getImageSize().height * config.tileSize} tiles</span>
					</div>
				</Panel>
				<Panel>
					<div class="stat-row">
						<span>Peak output</span>
						<span>{watts(statistics[panelType] * panelMax[panelType])}</span>
					</div>
				</Panel>
				<Panel>
					<div class="stat-row">
						<span>Average output</span>
						<span>{watts(statistics[panelType] * panelMax[panelType] * 0.7)}</span>
					</div>
				</Panel>

				<Panel>
					<div class="stat-row">
						<span>Acc./Panel Ratio</span>
						<span class={ratingOf(ratio, perfectRatio)}>
							{ratio.toFixed(2)} acc/panel
						</span>
					</div>
				</Panel>
				<Panel>
					<div class="stat-row">
						<span>Optimal ratio</span>
						<span class={ratingOf(perfectRatio, perfectRatio)}
							>{perfectRatio.toFixed(2)} acc/panel</span
						>
					</div>
				</Panel>
			</div>
		{/if}
	{/snippet}
</Section>

<style>
	p {
		padding-block: 1rem;
		text-align: center;
		opacity: 0.5;
	}

	.statistics-width {
		visibility: hidden;
	}
</style>
