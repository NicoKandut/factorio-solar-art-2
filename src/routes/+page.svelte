<script lang="ts">
	import ProgressModal from '$lib/components/site/ProgressModal.svelte';
	import Header from '$lib/components/site/Header.svelte';
	import Preview from '$lib/components/site/Preview.svelte';
	import Settings from '$lib/components/site/Settings.svelte';
	import Statistics from '$lib/components/site/Statistics.svelte';
	import ExportModal from '$lib/components/site/ExportModal.svelte';
</script>

<main>
	<Header />
	<Settings />
	<Preview />
	<Statistics />
</main>

<ProgressModal />
<ExportModal />

<style>
	main {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: auto 1fr auto;

		max-height: 100vh;
		max-width: 100vw;

		height: 100%;

		gap: 1rem;
		padding: 1rem;

		background-color: var(--bg-color);
	}

	:global(header),
	:global(footer) {
		grid-column: span 3;
	}

	:global(#Settings),
	:global(#Preview),
	:global(#Statistics) {
		grid-row: span 2;
	}
</style>
