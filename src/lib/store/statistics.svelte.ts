import { type Items } from '$lib/types';

const initial = (): Record<Items, number> => ({
	accumulator: 0,
	'solar-panel': 0,
	roboport: 0,
	substation: 0,
	'stone-wall': 0,
	'stone-path': 0,
	'refined-concrete': 0,
	radar: 0
});

const statistics = $state(initial());

export const getStatistics = () => statistics;

export const setStatistics = (newStatistics: Record<Items, number>) => {
	for (const key in newStatistics) {
		statistics[key] = newStatistics[key];
	}
};

export const resetStatistics = () => {
	const initialConfig = initial();
	for (const key in initialConfig) {
		statistics[key] = initialConfig[key];
	}
};
