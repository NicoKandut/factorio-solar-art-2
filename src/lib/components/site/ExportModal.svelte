<script lang="ts">
	import Modal from '$lib/components/factorio/Modal.svelte';
	import { bytes } from '$lib/logic/numberformatting';
	import { decode } from '$lib/logic/serialization';
	import { config } from '$lib/store/config.svelte';
	import { isModalOpen } from '$lib/store/modal.svelte';
	import { getExportFile, getImageSize } from '$lib/store/upload.svelte';
	import { ExportMode } from '$lib/types';
	import Panel from '../factorio/Panel.svelte';
	import Select from '../factorio/Select.svelte';
	import TextButton from '../factorio/TextButton.svelte';
	import MatIcon from './MatIcon.svelte';

	let loading = $state(false);
	let success = $state(false);
	let error = $state('');

	const doExport = () => {
		const exportFile = getExportFile();
		loading = true;
		success = false;
		error = '';
		if (exportFile) {
			switch (config.exportMode) {
				case ExportMode.Clipboard:
					exportFile
						.text()
						.then((text) => navigator.clipboard.writeText(text))
						.then(() => {
							success = true;
						})
						.catch((err) => {
							error = (err as any)?.message ?? `${err}`;
						})
						.finally(() => {
							loading = false;
						});
					break;
				case ExportMode.File:
					try {
						const url = URL.createObjectURL(exportFile);
						const a = document.createElement('a');
						a.href = url;
						a.download = 'blueprint.txt';
						a.click();
						URL.revokeObjectURL(url);
						success = true;
					} catch (err) {
						error = (err as any)?.message ?? `${err}`;
					} finally {
						loading = false;
						break;
					}
				default:
					console.warn('Unknown export mode', config.exportMode);
					error = 'Unknown export mode';
					loading = false;
			}
		}
	};

	$effect(() => {
		if (!isModalOpen.exportModal) {
			loading = false;
			success = false;
			error = '';
		}
	});

	const isLarge = $derived(getExportFile()?.size ?? 0 >= 1000000);
</script>

<Modal title="Export Blueprint" bind:visible={isModalOpen.exportModal}>
	{#snippet content()}
		<div class="section-content">
			<div class="section-content-inner">
				<Panel>
					<Select
						label="Export Target"
						bind:value={config.exportMode}
						options={[
							['Clipboard', ExportMode.Clipboard],
							['File', ExportMode.File]
						]}
					/>
				</Panel>
				<Panel>
					<h2>Size</h2>
					<div class="stat-row">
						<span>File Size (pixels)</span>
						<span>{getImageSize().width} x {getImageSize().height}</span>
					</div>
					<div class="stat-row">
						<span>File Size (bytes)</span>
						<span>{bytes(getExportFile()?.size ?? 0)}</span>
					</div>
				</Panel>
				{#if isLarge}
					<Panel>
						<h2>Warning</h2>
						<p>This blueprint is quite large.<br />I recommend exporting it as a file.</p>
					</Panel>
				{/if}
				{#if error}
					<Panel>
						<h2>Export Failed</h2>
						<code>{error}</code>
					</Panel>
				{/if}
			</div>
		</div>
	{/snippet}
	{#snippet bottomright()}
		<MatIcon icon={loading ? 'hourglass' : error !== '' ? 'error' : success ? 'check' : ''} />
		<TextButton onclick={doExport} type="positive" disabled={loading}>Confirm</TextButton>
	{/snippet}
</Modal>

<style>
	code {
		background-color: var(--section-color);
		padding: 0.5rem;
		box-shadow: var(--shadow-cutout);
	}
</style>
