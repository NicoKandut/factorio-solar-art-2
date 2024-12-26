<script lang="ts">
	import type { ButtonType } from '$lib/types';
	import type { Snippet } from 'svelte';

	interface Props {
		onclick: () => void;
		children: Snippet;
		type?: ButtonType;
		disabled?: boolean;
	}

	let { onclick, children, type = 'neutral', disabled = false }: Props = $props();
</script>

<button
	{onclick}
	class="text-button"
	class:neutral={type === 'neutral'}
	class:positive={type === 'positive'}
	class:negative={type === 'negative'}
	{disabled}
>
	{@render children()}
</button>
