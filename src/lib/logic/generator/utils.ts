import { Transparency, type Config } from '$lib/types';
import {
	PIXEL_RADIUS_LIGHTNING_COLLECTOR,
	PIXEL_RADIUS_RADAR,
	PIXEL_RADIUS_ROBOPORT,
	PIXEL_RADIUS_SUBSTATION,
	PIXEL_RANGE_LIGHTNING_COLLECTOR,
	PIXEL_RANGE_RADAR,
	PIXEL_RANGE_ROBOPORT,
	PIXEL_RANGE_SUBSTATION
} from './constants';
import type { PixelType } from './pixelFactory';

export const needsSubstation = (x: number, y: number) =>
	(x + PIXEL_RADIUS_SUBSTATION) % PIXEL_RANGE_SUBSTATION === 0 &&
	(y + PIXEL_RADIUS_SUBSTATION) % PIXEL_RANGE_SUBSTATION === 0;
export const needsLightningRod = (x: number, y: number) =>
	(x + PIXEL_RADIUS_LIGHTNING_COLLECTOR + 1) % PIXEL_RANGE_LIGHTNING_COLLECTOR === 0 &&
	(y + PIXEL_RADIUS_LIGHTNING_COLLECTOR + 1) % PIXEL_RANGE_LIGHTNING_COLLECTOR === 0;
export const needsRoboPort = (x: number, y: number) =>
	(x + PIXEL_RADIUS_ROBOPORT) % PIXEL_RANGE_ROBOPORT === 0 &&
	(y + PIXEL_RADIUS_ROBOPORT) % PIXEL_RANGE_ROBOPORT === 0;
export const needsRadar = (x: number, y: number) =>
	(x + PIXEL_RADIUS_RADAR) % PIXEL_RANGE_RADAR === 0 &&
	(y + PIXEL_RADIUS_RADAR) % PIXEL_RANGE_RADAR === 0;

export const index = (x: number, y: number, width: number, size: number = 1) =>
	(y * width + x) * size;

export const mapColor = ([r, g, b, a]: number[], config: Config): PixelType => {
	if (a <= config.alphaThreshold) {
		switch (config.transparency) {
			case Transparency.Transparent:
				return 'transparent';
			case Transparency.Wall:
				return 'stone-wall';
			case Transparency.Accumulator:
				return 'accumulator';
			case Transparency.SolarPanel:
				return 'solar-panel';
		}
	}
	const brightness = (0.2126 * r + 0.7152 * g + 0.0772 * b) / 255;
	if (config.walls && brightness > config.wallsThreshold) {
		return 'stone-wall';
	}
	return brightness > config.accumulatorThreshold ? 'accumulator' : 'solar-panel';
};
