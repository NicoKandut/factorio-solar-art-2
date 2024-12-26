<script lang="ts">
	import { NOOP } from '$lib/constants';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		topright?: Snippet;
		content: Snippet;
		bottomleft?: Snippet;
		bottomright?: Snippet;
	}

	let {
		title,
		topright = NOOP as Snippet,
		content,
		bottomleft = NOOP as Snippet,
		bottomright = NOOP as Snippet
	}: Props = $props();
</script>

<section class="section" id={title}>
	<div class="section-title">
		<span>{title}</span>
		<div class="section-spacer"></div>
		{@render topright()}
	</div>

	<div class="section-content">
		<div class="section-content-inner">
			{@render content()}
		</div>
	</div>

	{#if bottomleft !== NOOP || bottomright !== NOOP}
		<div class="section-title">
			{@render bottomleft()}
			<div class="section-spacer"></div>
			{@render bottomright()}
		</div>
	{/if}
</section>
