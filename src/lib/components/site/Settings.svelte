<script lang="ts">
	import { browser } from '$app/environment';
	import Panel from '$lib/components/factorio/Panel.svelte';
	import Section from '$lib/components/factorio/Section.svelte';
	import MyWorker from '$lib/logic/worker/worker.ts?worker';
	import { config, resetConfig } from '$lib/store/config.svelte';
	import { progress } from '$lib/store/progress.svelte';
	import { setStatistics } from '$lib/store/statistics.svelte';
	import { getExportFile, getFile, getImageSize, setExportFile } from '$lib/store/upload.svelte';
	import { Transparency, type WorkerRequest, type WorkerResponse } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import Checkbox from '../factorio/Checkbox.svelte';
	import Numberbox from '../factorio/Numberbox.svelte';
	import Select from '../factorio/Select.svelte';
	import SquareButton from '../factorio/SquareButton.svelte';
	import Textbox from '../factorio/Textbox.svelte';
	import TextButton from '../factorio/TextButton.svelte';
	import MatIcon from './MatIcon.svelte';
	import { isModalOpen } from '$lib/store/modal.svelte';
	import RangeInput from '../factorio/RangeInput.svelte';

	let largerSide = $derived(Math.max(getImageSize().height, getImageSize().width));

	let exportDisabled = $derived(getExportFile() === null);
	let generateDisabled = $derived(getFile() === null);

	const startGeneration = () => {
		const file = getFile();
		if (file) {
			isModalOpen.generationModal = true;
			progress.percent = 0;
			progress.status = 'Preparing...';
			const request: WorkerRequest = {
				type: 'blueprint',
				extent: { ...getImageSize() },
				file,
				config: { ...config }
			};

			worker?.postMessage(request);
			console.log('POSTED');
		}
	};

	const startExport = () => {
		isModalOpen.exportModal = true;
	};

	let worker: Worker | null = $state(null);

	onMount(() => {
		if (browser) {
			worker = new MyWorker();
			worker.onmessage = (event) => {
				const { type, data } = event.data as WorkerResponse;
				switch (type) {
					case 'progress':
						progress.percent = data;
						break;
					case 'status':
						progress.status = data;
						break;
					case 'stats':
						setStatistics(data);
						break;
					case 'file':
						setExportFile(data);
						progress.status = 'Done';
						isModalOpen.generationModal = false;
						break;
					default:
						console.warn('Unknown response type', type);
				}
			};
			console.log('Worker created', worker);
		}
	});

	onDestroy(() => {
		if (worker) {
			worker.terminate();
			console.log('Worker terminated');
		}
	});
</script>

<Section title="Settings">
	{#snippet topright()}
		<SquareButton onclick={resetConfig} type="negative">
			<MatIcon icon="replay" />
		</SquareButton>
	{/snippet}
	{#snippet content()}
		<Panel>
			<h2>Blueprint</h2>
			<Textbox label="Name" bind:value={config.name} hint="Enter name..." />
			<Checkbox bind:value={config.isBook}>Blueprint Book</Checkbox>
			<div>
				<Numberbox
					label="Split Size"
					bind:value={config.blueprintSize}
					min={1}
					max={largerSide}
					step={1}
					hint="Size of each blueprint..."
					disabled={!config.isBook}
				/>
				<SquareButton
					onclick={() => (config.splitVisible = !config.splitVisible)}
					disabled={!config.isBook}
				>
					<MatIcon icon={config.splitVisible ? 'visibility' : 'visibility_off'} />
				</SquareButton>
			</div>
		</Panel>

		<Panel>
			<h2>Materials</h2>
			<Checkbox bind:value={config.walls}>Walls</Checkbox>
			<Checkbox bind:value={config.stonePath}>Stone Path</Checkbox>
			<Checkbox bind:value={config.refinedConcrete}>Refined Concrete</Checkbox>
			<Checkbox bind:value={config.roboports}>Roboports</Checkbox>
			<Checkbox bind:value={config.radars}>Radars</Checkbox>
			<Checkbox bind:value={config.lightningRods}>Lightning Rods</Checkbox>
		</Panel>

		<Panel>
			<RangeInput
				label="White Threshold"
				bind:value={config.wallsThreshold}
				min={0}
				max={1}
				step={0.01}
				hint="#"
				disabled={!config.walls}
			/>
		</Panel>

		<Panel>
			<RangeInput
				label="Grey Threshold"
				bind:value={config.accumulatorThreshold}
				min={0}
				max={1}
				step={0.01}
				hint="#"
				disabled={!config.walls}
			/>
		</Panel>

		<Panel>
			<h2>Size</h2>
			<Numberbox
				label="Scale"
				bind:value={config.scale}
				min={0.01}
				max={100}
				step={0.01}
				hint="Scale"
			/>
		</Panel>

		<Panel>
			<h2>Crop / Extend</h2>
			<Numberbox label="Left" bind:value={config.cropLeft} hint="Left" />
			<Numberbox label="Right" bind:value={config.cropRight} hint="Right" />
			<Numberbox label="Top" bind:value={config.cropTop} hint="Top" />
			<Numberbox label="Bottom" bind:value={config.cropBottom} hint="Bottom" />
		</Panel>

		<Panel>
			<h2>Snap</h2>
			<Checkbox bind:value={config.snap}>Snap</Checkbox>
			<Numberbox
				label="Snap Size"
				bind:value={config.snapSize}
				min={1}
				max={largerSide}
				step={1}
				hint="Snap Size"
				disabled={!config.snap}
			/>
		</Panel>

		<Panel>
			<h2>Transparency</h2>
			<Select
				label="Transparent Pixels"
				bind:value={config.transparency}
				options={[
					['Transparent', Transparency.Transparent],
					['Walls', Transparency.Wall],
					['Accumulators', Transparency.Accumulator],
					['Solar Panels', Transparency.SolarPanel]
				]}
			/>
			<RangeInput
				label="Threshold"
				bind:value={config.alphaThreshold}
				min={0}
				max={1}
				step={0.01}
				hint="Alpha Threshold"
			/>
		</Panel>

		<Panel>
			<Select
				label="Extension Fill"
				bind:value={config.fillMaterial}
				options={[
					['Transparent', Transparency.Transparent],
					['Walls', Transparency.Wall],
					['Accumulators', Transparency.Accumulator],
					['Solar Panels', Transparency.SolarPanel]
				]}
			/>
		</Panel>
	{/snippet}
	{#snippet bottomright()}
		<TextButton onclick={startGeneration} type="positive" disabled={generateDisabled}>
			Generate
		</TextButton>
		<TextButton onclick={startExport} type="positive" disabled={exportDisabled}>Export</TextButton>
	{/snippet}
</Section>

<style>
	div {
		display: flex;
		width: 100%;
		align-items: center;
		gap: var(--spacing-inline);
	}

	div :global(:first-child) {
		flex: 1;
	}
</style>
