<script lang="ts">
	import Modal from '$lib/components/factorio/Modal.svelte';
	import { isModalOpen } from '$lib/store/modal.svelte';
	import { progress } from '$lib/store/progress.svelte';
</script>

<Modal title="Generating Blueprint" bind:visible={isModalOpen.generationModal}>
	{#snippet content()}
		<progress id="generation-progress" value={progress.percent} max="100">
			{progress.percent}%
		</progress>
		<span>{progress.status}</span>
	{/snippet}
</Modal>

<style>
	progress[value] {
		/* Reset the default appearance */
		-webkit-appearance: none;
		appearance: none;

		width: 250px;
		height: 20px;

		box-shadow: var(--shadow-cutout);
	}

	progress[value]::-webkit-progress-bar {
		background-color: transparent;
	}

	progress[value]::-webkit-progress-value {
		background-color: #00f300;
		border-radius: 1px;
	}

	span {
		font-size: 12px;
		opacity: 0.5;
	}
</style>
