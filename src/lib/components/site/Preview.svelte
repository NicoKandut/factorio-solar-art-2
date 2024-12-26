<script lang="ts">
	import { Renderer } from '$lib/logic/renderer';
	import { config } from '$lib/store/config.svelte';
	import { getFile, getImage, getImageUrl, resetUpload } from '$lib/store/upload.svelte';
	import Section from '../factorio/Section.svelte';
	import SquareButton from '../factorio/SquareButton.svelte';
	import MatIcon from './MatIcon.svelte';
	import UploadArea from './UploadArea.svelte';

	type ViewMode = 'preview' | 'source';

	let view: ViewMode = $state('preview');
	let canvasRef: HTMLCanvasElement | null = $state(null);

	let gl: Renderer = new Renderer();

	const toggleView = () => {
		view = view === 'preview' ? 'source' : 'preview';
	};

	$effect(() => {
		const image = getImage();
		if (image === null) {
			return;
		}
		gl.updateImage(image, config);
	});
	$effect(() => {
		if (canvasRef === null) {
			return;
		}
		gl.setTarget(canvasRef);
		return () => gl.resetTarget();
	});
</script>

<Section title="Preview">
	{#snippet topright()}
		<SquareButton onclick={toggleView}>
			<MatIcon icon="compare" />
		</SquareButton>
		<SquareButton onclick={resetUpload} type="negative">
			<MatIcon icon="clear" />
		</SquareButton>
	{/snippet}
	{#snippet content()}
		<UploadArea visible={!getFile()} />
		<canvas bind:this={canvasRef} class:visible={getImageUrl() && view === 'preview'}></canvas>
		<img src={getImageUrl()} alt="Source" class:visible={getImageUrl() && view === 'source'} />
	{/snippet}
</Section>

<style>
	canvas,
	img {
		flex-grow: 1;
		object-fit: contain;
		image-rendering: pixelated;

		max-width: 100%;
		max-height: 100%;

		width: auto;
		height: 100%;
	}

	img:not(.visible),
	canvas:not(.visible) {
		display: none;
	}

	:global(#Preview .section-content-inner) {
		background-color: var(--ground);
	}
</style>
