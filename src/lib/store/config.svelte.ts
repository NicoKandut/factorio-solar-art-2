import { ExportMode, Transparency, type Config } from '$lib/types';

const initial = (): Config => ({
	name: 'Solar Blueprint',

	isBook: false,
	blueprintSize: 50,
	splitVisible: true,

	snap: false,
	snapSize: 6,

	cropBottom: 0,
	cropTop: 0,
	cropLeft: 0,
	cropRight: 0,

	tileSize: 6,

	transparency: Transparency.Transparent,
	fillMaterial: Transparency.Transparent,

	alphaThreshold: 0.5,
	wallsThreshold: 0.9,
	accumulatorThreshold: 0.5,

	scale: 1,

	walls: true,
	stonePath: true,
	refinedConcrete: true,
	roboports: true,
	radars: true,
	lightningRods: false,

	exportMode: ExportMode.File
});

export const config = $state(initial());

export const resetConfig = () => {
	console.log('resetConfig');
	const initialConfig = initial();
	config.name = initialConfig.name;
	config.isBook = initialConfig.isBook;
	config.blueprintSize = initialConfig.blueprintSize;
	config.splitVisible = initialConfig.splitVisible;
	config.snap = initialConfig.snap;
	config.snapSize = initialConfig.snapSize;
	config.cropBottom = initialConfig.cropBottom;
	config.cropTop = initialConfig.cropTop;
	config.cropLeft = initialConfig.cropLeft;
	config.cropRight = initialConfig.cropRight;
	config.tileSize = initialConfig.tileSize;
	config.transparency = initialConfig.transparency;
	config.fillMaterial = initialConfig.fillMaterial;
	config.alphaThreshold = initialConfig.alphaThreshold;
	config.wallsThreshold = initialConfig.wallsThreshold;
	config.accumulatorThreshold = initialConfig.accumulatorThreshold;
	config.scale = initialConfig.scale;
	config.walls = initialConfig.walls;
	config.stonePath = initialConfig.stonePath;
	config.refinedConcrete = initialConfig.refinedConcrete;
	config.roboports = initialConfig.roboports;
	config.radars = initialConfig.radars;
	config.lightningRods = initialConfig.lightningRods;
	config.exportMode = initialConfig.exportMode;
};
