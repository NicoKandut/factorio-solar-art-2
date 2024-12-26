import type { Items } from '$lib/types';

const THUMB_BASE = Object.freeze('https://wiki.factorio.com/images/thumb');

export const ITEM_URLS: Record<Items, string> = Object.freeze({
	'solar-panel': `${THUMB_BASE}/Solar_panel.png/32px-Solar_panel.png`,
	accumulator: `${THUMB_BASE}/Accumulator.png/32px-Accumulator.png`,
	substation: `${THUMB_BASE}/Substation.png/32px-Substation.png`,
	roboport: `${THUMB_BASE}/Roboport.png/32px-Roboport.png`,
	'stone-wall': `${THUMB_BASE}/Wall.png/32px-Wall.png`,
	'refined-concrete': `${THUMB_BASE}/Refined_concrete.png/32px-Refined_concrete.png`,
	radar: `${THUMB_BASE}/Radar.png/32px-Radar.png`,
	'stone-path': `${THUMB_BASE}/Stone_brick.png/32px-Stone_brick.png`,
	'lightning-collector': `${THUMB_BASE}/Lightning_collector.png/48px-Lightning_collector.png`
});
