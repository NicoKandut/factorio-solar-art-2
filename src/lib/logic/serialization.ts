import { deflate, inflate } from 'pako';

const VERSION = '0';
const UINT_CHUNK_SIZE = 50000; // 65536;

export const uint8ToString = (array: Uint8Array) => {
	let c = '';
	for (let i = 0; i < array.length; i += UINT_CHUNK_SIZE) {
		c += String.fromCharCode.apply(
			null,
			array.subarray(i, i + UINT_CHUNK_SIZE) as unknown as number[]
		);
	}
	return c;
};

/**
 * Encodes a blueprint object to an importable string.
 */
export const encode = (blueprint: unknown) => {
	const start = performance.now();
	const jsonString = JSON.stringify(blueprint);
	const compressed_uint8array = deflate(jsonString);
	const b64encoded_string = btoa(uint8ToString(compressed_uint8array));
	const end = performance.now();

	console.info(`Encoding took ${end - start} ms`);

	return VERSION + b64encoded_string;
};

// /**
//  * Parses a string into a blueprint object.
//  */
export const decode = (bluebrintString: string) => {
	const base64 = bluebrintString.substring(1);
	const charArray = atob(base64);
	const compressed = Uint8Array.from(charArray, (c) => c.charCodeAt(0));
	const jsonString = inflate(compressed, { to: 'string' });

	return JSON.parse(jsonString) as unknown;
};
