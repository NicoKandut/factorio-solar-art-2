<script lang="ts">
	import { setFile } from '$lib/store/upload.svelte';
	import MatIcon from './MatIcon.svelte';

	let { visible } = $props();

	let inputRef: HTMLInputElement;

	const handleChange = (event: Event) => {
		const file = event.target?.files[0];
		setFile(file);
	};
	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		const file = event.dataTransfer?.files?.[0];
		if (file) {
			setFile(file);
		}
	};
	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
	};
</script>

<div class:visible>
	<button onclick={() => inputRef.click()} ondrop={handleDrop} ondragover={handleDragOver}>
		<MatIcon icon="upload" />
		<span>Click here to upload a picture or drag and drop a picture here</span>
	</button>
</div>

<input type="file" onchange={handleChange} multiple={false} accept="image/*" bind:this={inputRef} />

<style>
	input {
		display: none;
	}

	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		border: 2px dashed var(--text-color);
		opacity: 0.5;
		background-color: transparent;

		&:hover {
			opacity: 1;
		}
	}

	div {
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		background-color: var(--section-color);
	}

	button,
	:global(.upload) {
		font-size: 4rem;
	}

	span {
		display: block;
	}

	div:not(.visible) {
		display: none;
	}
</style>
