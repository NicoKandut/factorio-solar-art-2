import type { Export } from '$lib/types';

export const progress = $state<Export>({
	percent: 0,
	status: 'Starting...'
});
