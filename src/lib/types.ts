export const enum Transparency {
	Transparent = 0,
	Wall = 1,
	Accumulator = 2,
	SolarPanel = 3
}

export const enum ExportMode {
	File = 0,
	Clipboard = 1
}

export interface Export {
	status: string;
	percent: number;
}

export interface Config {
	name: string;

	isBook: boolean;
	blueprintSize: number;
	splitVisible: boolean;

	snap: boolean;
	snapSize: number;

	cropTop: number;
	cropBottom: number;
	cropLeft: number;
	cropRight: number;

	tileSize: number;

	fillMaterial: Transparency;
	transparency: Transparency;

	alphaThreshold: number;
	wallsThreshold: number;
	accumulatorThreshold: number;

	scale: number;

	walls: boolean;
	stonePath: boolean;
	refinedConcrete: boolean;
	roboports: boolean;
	radars: boolean;
	lightningRods: boolean;

	exportMode: ExportMode;
}

export type EntityType =
	| 'substation'
	| 'roboport'
	| 'solar-panel'
	| 'accumulator'
	| 'stone-wall'
	| 'radar'
	| 'lightning-collector';

export type TileType = 'stone-path' | 'refined-concrete';

export const sizes: Record<EntityType | TileType, number> = {
	accumulator: 2,
	'solar-panel': 3,
	roboport: 4,
	'lightning-collector': 2,
	substation: 2,
	'stone-wall': 1,
	'stone-path': 1,
	'refined-concrete': 1,
	radar: 3
};

export type Items = EntityType | TileType;

export type WorkerRequest =
	| {
			type: 'blueprint';
			config: Config;
			extent: Extent;
			file: File;
	  }
	| { type: 'abort' };

export type WorkerResponse =
	| { type: 'progress'; data: number }
	| { type: 'stats'; data: Record<Items, number> }
	| { type: 'status'; data: string }
	| { type: 'file'; data: File };

export interface Extent {
	width: number;
	height: number;
}

export type ButtonType = 'neutral' | 'positive' | 'negative';
