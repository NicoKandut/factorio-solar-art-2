import * as factorio from '$lib/factorio-blueprint-utils/src';
import type { Config, Extent } from '$lib/types';
import {
	index,
	mapColor,
	needsLightningRod,
	needsRadar,
	needsRoboPort,
	needsSubstation
} from './utils';
import { TILES_PER_PIXEL } from './constants';
import { resetIdGenerator } from './entityIdGenerator';
import { createPixel } from './pixelFactory';

/**
 * Creates a blueprint object
 */
export const calculateBlueprints = (
	data: Uint8ClampedArray,
	config: Config,
	extent: Extent,
	progress: (data: number) => void
): factorio.WrappedBlueprint[] => {
	const start = performance.now();

	resetIdGenerator();

	const blueprints: Array<factorio.WrappedBlueprint> = [];

	const blueprintWidth = config.isBook ? Math.ceil(extent.width / config.blueprintSize) : 1;
	const blueprintHeight = config.isBook ? Math.ceil(extent.height / config.blueprintSize) : 1;

	progress(1);

	for (let index = 0; index < blueprintWidth * blueprintHeight; ++index) {
		const x = index % blueprintWidth;
		const y = Math.floor(index / blueprintWidth);
		const from = {
			x: x * config.blueprintSize,
			y: y * config.blueprintSize
		};
		const to = {
			x: from.x + config.blueprintSize,
			y: from.y + config.blueprintSize
		};

		blueprints.push({
			blueprint: {
				item: 'blueprint',
				label: `Blueprint #${index} (${x}, ${y})`,
				description: `Contains the pixels from (${from.x}, ${from.y}) to (${to.x}, ${to.y})`,
				entities: [],
				tiles: [],
				version: 1,
				...(config.snap
					? {
							'snap-to-grid': {
								x: config.snapSize,
								y: config.snapSize
							},
							'absolute-snapping': true
						}
					: {})
			},
			index
		});
	}

	progress(2);

	const tilesPerPixel = TILES_PER_PIXEL;

	const tileWidth = extent.width * tilesPerPixel;
	const tileHeight = extent.height * tilesPerPixel;
	const tileOffsetX = -Math.floor(tileWidth / 2);
	const tileOffsetY = -Math.floor(tileHeight / 2);

	for (let pixelY = 0, tileY = 0; pixelY < extent.height; pixelY++, tileY += tilesPerPixel) {
		for (let pixelX = 0, tileX = 0; pixelX < extent.width; pixelX++, tileX += tilesPerPixel) {
			const blueprint = config.isBook
				? blueprints[
						index(
							Math.floor(pixelX / config.blueprintSize),
							Math.floor(pixelY / config.blueprintSize),
							blueprintWidth
						)
					]
				: blueprints[0];

			const i = index(pixelX, pixelY, extent.width, 4);
			const color = [data[i], data[i + 1], data[i + 2], data[i + 3]];
			const type = mapColor(color, config);

			const pixel = createPixel(type, tileX, tileY, {
				concrete: config.stonePath,
				refinedConcrete: config.refinedConcrete,
				substation: needsSubstation(pixelX, pixelY),
				lightningRod: needsLightningRod(pixelX, pixelY),
				roboport: config.roboports && needsRoboPort(pixelX, pixelY),
				radar: config.radars && needsRadar(pixelX, pixelY),
				offsetX: tileOffsetX,
				offsetY: tileOffsetY
			});

			blueprint.blueprint.entities.push(...pixel.entities);
			blueprint.blueprint.tiles.push(...pixel.tiles);
		}

		progress(2 + pixelY);
	}

	const end = performance.now();

	console.debug('calculation time: %d ms', end - start);

	return blueprints;
};
