<script lang="ts">
	import { ITEM_URLS } from '$lib/data/items';
	import { compactFormat } from '$lib/logic/numberformatting';
	import type { Items } from '$lib/types';

	interface Props {
		count: number;
		name: Items;
	}

	let { count, name }: Props = $props();
</script>

<div class="item" title={name}>
	<img src={ITEM_URLS[name]} alt={name} class="item-image" />
	<span class="item-count">{compactFormat(count)}</span>
</div>
