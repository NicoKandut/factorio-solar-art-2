<script lang="ts">
	import { NOOP } from '$lib/constants';
	import type { Snippet } from 'svelte';
	import MatIcon from '../site/MatIcon.svelte';
	import SquareButton from './SquareButton.svelte';

	let { visible = $bindable(), title, content, bottomright = NOOP as Snippet } = $props();
</script>

<div class="screen" class:visible>
	<section class="section" id={title}>
		<div class="section-title">
			<span>{title}</span>
			<div class="section-spacer"></div>
			<SquareButton onclick={() => (visible = false)}>
				<MatIcon icon="close" />
			</SquareButton>
		</div>
		{@render content()}
		{#if bottomright !== NOOP}
			<div class="section-title">
				<div class="section-spacer"></div>
				{@render bottomright()}
			</div>
		{/if}
	</section>
</div>

<style>
	.screen {
		display: none;
		place-items: center;
		height: 100vh;
		width: 100vw;
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;

		background-color: #000000a0;
	}

	.visible {
		display: grid;
	}
</style>
