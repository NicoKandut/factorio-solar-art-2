import type { Config } from '$lib/types';

const vertexShaderSource = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uSampler;
uniform int tileSize;
uniform int cropBottom;
uniform int cropTop;
uniform int cropLeft;
uniform int cropRight;

out vec2 worldCoords;
out vec2 tileCoords;

const vec2 vertices[3] = vec2[3](
	vec2(-1, -1), 
	vec2(+3, -1), 
	vec2(-1, +3)
);

void main() {
    gl_Position = vec4(vertices[gl_VertexID], 0, 1);

	ivec2 imageSize = textureSize(uSampler, 0);
	ivec2 cropStart = ivec2(
		min(0, cropLeft),
		min(0, cropBottom)
	);
	ivec2 cropEnd = ivec2(
		min(0, cropRight),
		min(0, cropTop)
	);

	vec2 start = vec2(cropStart * tileSize);
	vec2 end = vec2((imageSize - cropEnd) * tileSize);

	vec2 textureCoords = 0.5 * gl_Position.xy + vec2(0.5);
	textureCoords.y = 1.0 - textureCoords.y;

	worldCoords = mix(start, end, textureCoords) - start;
	tileCoords = mix(vec2(0), end - start, textureCoords);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uSampler;
uniform int tileSize;
uniform int walls;
uniform int stonePath;
uniform int refinedConcrete;
uniform int roboports;
uniform int radars;
uniform int lightningRods;
uniform int cropBottom;
uniform int cropTop;
uniform int cropLeft;
uniform int cropRight;
uniform int transparency;
uniform int transparencyFill;
uniform int splitVisible;
uniform int splitSize;
uniform float alphaThreshold;
uniform float wallsThreshold;
uniform float accumulatorThreshold;

in vec2 worldCoords;
in vec2 tileCoords;

out vec4 outColor;

const vec4 C_TRANSPARENT         = vec4(0, 0, 0, 0);
const vec3 C_STONE_WALL          = vec3(217.0/255.0, 216.0/255.0, 207.0/255.0); 
const vec3 C_ACCUMULATOR         = vec3(120.0/255.0, 122.0/255.0, 120.0/255.0);
const vec3 C_STONE_PATH          = vec3( 82.0/255.0,  81.0/255.0,  74.0/255.0); 
const vec3 C_REFINED_CONCRETE    = vec3( 49.0/255.0,  50.0/255.0,  42.0/255.0); 
const vec3 C_ROBOPORT            = vec3(214.0/255.0, 206.0/255.0, 132.0/255.0);
const vec3 C_SUBSTATION          = vec3(          0,  93.0/255.0, 148.0/255.0);
const vec3 C_RADAR               = vec3(          0,  96.0/255.0, 144.0/255.0);
const vec3 C_SOLAR_PANEL         = vec3( 24.0/255.0,  32.0/255.0,  32.0/255.0); 
const vec3 C_LIGHTNING_COLLECTOR = vec3(          0,  96.0/255.0, 144.0/255.0); 

const int RANGE_SUBSTATION = 3;
const int RANGE_LIGHTNING_ROD = 3;
const int RANGE_ROBOPORT = 8;
const int RANGE_RADAR = 36;

const vec3 LUM_COEFFICIENTS = vec3(0.2126, 0.7152, 0.0722);
float luminance(vec3 rgb) {
    return dot(rgb, LUM_COEFFICIENTS);
}

bool isSubstationCandidateTile(ivec2 tileIndex) {
	return tileIndex.x < 2 && tileIndex.y < 2;
}

bool isLightningRodCandidateTile(ivec2 tileIndex) {
	return tileIndex.x < 2 && tileIndex.y < 2;
}

bool isRoboportCandidateTile(ivec2 tileIndex) {
	return tileIndex.x >= 2 && tileIndex.y >= 2;
}

bool isRadarCandidateTile(ivec2 tileIndex) {
	return tileIndex.x >= 3 && tileIndex.y >= 3;
}

void main() {
	ivec2 imageSize = textureSize(uSampler, 0);
	ivec2 cropStart = ivec2(min(0, cropLeft), min(0, cropBottom));
	ivec2 cropEnd = ivec2(min(0, cropRight), min(0, cropTop));

	// image coordinates
	ivec2 imageCoords = ivec2(worldCoords) / tileSize + cropStart;
	ivec2 tileIndex = ivec2(tileCoords) % tileSize;

	// early return if grid enabled
	if (splitVisible == 1) {
		if (imageCoords.x % splitSize == 0 || imageCoords.y % splitSize == 0) {
			outColor = vec4(1, 0, 0, 1);
			return;
		}
	}


	ivec2 gridOrigin = ivec2(cropStart);
	ivec2 gridCoords =  ivec2(worldCoords) / tileSize + gridOrigin;

	// sample
	vec2 uvCoords = (vec2(imageCoords) + 0.5) / vec2(textureSize(uSampler, 0));
	vec4 color = vec4(0);

	bool inBounds = uvCoords.x >= 0.0 && uvCoords.x <= 1.0 && uvCoords.y >= 0.0 && uvCoords.y <= 1.0;

	if (inBounds) {
		color = texture(uSampler, uvCoords);
	}

    float lum = luminance(color.rgb);

	bool isPowerTile     = gridCoords.x % RANGE_SUBSTATION == 0 && gridCoords.y % RANGE_SUBSTATION == 0;
	bool isLogisticsTile = roboports != 0 && gridCoords.x % RANGE_ROBOPORT == 0 && gridCoords.y % RANGE_ROBOPORT == 0;
	bool isLightningTile = lightningRods != 0 && gridCoords.x % RANGE_LIGHTNING_ROD == 1 && gridCoords.y % RANGE_LIGHTNING_ROD == 1;
	bool isRadarTile     = radars != 0 && gridCoords.x % RANGE_RADAR == 0 && gridCoords.y % RANGE_RADAR == 0;	

	bool isVisibleTile      = color.a > alphaThreshold;
	bool isWallTile         = walls != 0 && (isVisibleTile && lum > wallsThreshold)
								|| (!inBounds && transparencyFill == 1)
								|| (inBounds && !isVisibleTile && transparency == 1);
	bool isAccumulatorTile  = (isVisibleTile && lum > accumulatorThreshold)
								|| (!inBounds && transparencyFill == 2)
								|| (inBounds && !isVisibleTile && transparency == 2);
	bool isPanelTile	    = (isVisibleTile && lum <= accumulatorThreshold)
								|| (!inBounds && transparencyFill == 3)
								|| (inBounds && !isVisibleTile && transparency == 3);

	outColor.a = 1.0f;

	if (isSubstationCandidateTile(tileIndex) && isPowerTile) {
		outColor.rgb = C_SUBSTATION;
	} else if (isLightningRodCandidateTile(tileIndex) && isLightningTile) {
		outColor.rgb = C_LIGHTNING_COLLECTOR;
	} else if (isRoboportCandidateTile(tileIndex) && isLogisticsTile) {
		outColor.rgb = C_ROBOPORT;
	} else if (isRadarCandidateTile(tileIndex) && isRadarTile) {
		outColor.rgb = C_RADAR;
	} else if (isWallTile) {
		outColor.rgb = C_STONE_WALL;
	} else	if (isAccumulatorTile) {
		if (isRadarTile && tileIndex.x >= 2 && tileIndex.y >= 2) { 
			if (stonePath != 0) {
				outColor.rgb = C_STONE_PATH;
			} else {
				outColor = C_TRANSPARENT;
			}
		} else{
			outColor.rgb = C_ACCUMULATOR;
		}
	} else if (isPanelTile) {
		if ((isPowerTile && tileIndex.x < 3 && tileIndex.y < 3)
			|| (isLightningTile && tileIndex.x < 3 && tileIndex.y < 3)
			|| isLogisticsTile 
		) {
			if (refinedConcrete != 0) {
				outColor.rgb = C_REFINED_CONCRETE;
			} else {
				outColor = C_TRANSPARENT;
			}
		} else{
			outColor.rgb = C_SOLAR_PANEL;
		}
	} else {
		outColor = C_TRANSPARENT;
	}
}
`;

export class Renderer {
	#canvas!: HTMLCanvasElement;
	#gl!: WebGL2RenderingContext;
	#texture!: WebGLTexture;
	#program!: WebGLProgram;

	setTarget(canvas: HTMLCanvasElement) {
		const context = canvas.getContext('webgl2');
		if (context === null) {
			throw new Error('WebGL2 is not supported');
		}

		this.#canvas = canvas;
		this.#gl = context;
		this.#program = this.createProgram();
		this.#texture = this.#gl.createTexture();

		// this.#gl.pixelStorei(this.#gl.UNPACK_FLIP_Y_WEBGL, true);
		this.#gl.enable(this.#gl.BLEND);
		this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);
	}

	resetTarget() {
		this.#gl.deleteTexture(this.#texture);
		this.#gl.deleteProgram(this.#program);
	}

	updateImage(image: HTMLImageElement | null, config: Config) {
		if (image === null) {
			console.warn('No image to render');
			return;
		}

		if (this.#gl === undefined || this.#program === undefined || this.#texture === undefined) {
			console.warn('Renderer not initialized');
			return;
		}

		const start = performance.now();

		const startX = Math.min(0, config.cropLeft);
		const startY = Math.min(0, config.cropBottom);
		const endX = Math.min(0, config.cropRight);
		const endY = Math.min(0, config.cropTop);

		const viewportWidth = (image.width - startX - endX) * config.tileSize;
		const viewportHeight = (image.height - startY - endY) * config.tileSize;

		this.#canvas.width = viewportWidth;
		this.#canvas.height = viewportHeight;
		this.#gl.viewport(0, 0, viewportWidth, viewportHeight);

		this.#gl.activeTexture(this.#gl.TEXTURE0);
		this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture);

		this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#gl.NEAREST);
		this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#gl.CLAMP_TO_EDGE);
		this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#gl.CLAMP_TO_EDGE);

		this.#gl.texImage2D(
			this.#gl.TEXTURE_2D,
			0,
			this.#gl.RGBA,
			this.#gl.RGBA,
			this.#gl.UNSIGNED_BYTE,
			image
		);

		this.#gl.clearColor(0.0, 0.0, 0.0, 0.0);
		this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

		this.#gl.useProgram(this.#program);

		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'uSampler'), 0);
		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'tileSize'), config.tileSize);
		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'walls'), Number(config.walls));
		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'stonePath'),
			Number(config.stonePath)
		);
		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'refinedConcrete'),
			Number(config.refinedConcrete)
		);
		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'roboports'),
			Number(config.roboports)
		);
		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'radars'), Number(config.radars));
		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'lightningRods'),
			Number(config.lightningRods)
		);

		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'cropBottom'), config.cropBottom);
		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'cropTop'), config.cropTop);
		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'cropLeft'), config.cropLeft);
		this.#gl.uniform1i(this.#gl.getUniformLocation(this.#program, 'cropRight'), config.cropRight);

		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'transparency'),
			config.transparency
		);
		console.log('transparency', config.transparency);
		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'transparencyFill'),
			config.fillMaterial
		);
		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'splitVisible'),
			Number(config.splitVisible && config.isBook)
		);
		this.#gl.uniform1i(
			this.#gl.getUniformLocation(this.#program, 'splitSize'),
			config.blueprintSize
		);

		this.#gl.uniform1f(
			this.#gl.getUniformLocation(this.#program, 'alphaThreshold'),
			config.alphaThreshold
		);
		this.#gl.uniform1f(
			this.#gl.getUniformLocation(this.#program, 'wallsThreshold'),
			config.wallsThreshold
		);
		this.#gl.uniform1f(
			this.#gl.getUniformLocation(this.#program, 'accumulatorThreshold'),
			config.accumulatorThreshold
		);

		this.#gl.drawArrays(this.#gl.TRIANGLE_STRIP, 0, 3);
		this.#gl.flush();

		const end = performance.now();
		console.info(`Rendering took ${end - start} ms`);
	}

	createProgram() {
		const vertexShader = this.loadShader(this.#gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = this.loadShader(this.#gl.FRAGMENT_SHADER, fragmentShaderSource);
		const shaderProgram = this.#gl.createProgram();
		this.#gl.attachShader(shaderProgram, vertexShader);
		this.#gl.attachShader(shaderProgram, fragmentShader);
		this.#gl.linkProgram(shaderProgram);

		if (!this.#gl.getProgramParameter(shaderProgram, this.#gl.LINK_STATUS)) {
			throw new Error(`Failed to link program: ${this.#gl.getProgramInfoLog(shaderProgram)}`);
		}

		return shaderProgram;
	}

	loadShader(type: number, source: string) {
		const shader = this.#gl.createShader(type);
		if (shader === null) {
			throw new Error(`Failed to create shader of type ${type}`);
		}

		this.#gl.shaderSource(shader, source);
		this.#gl.compileShader(shader);

		if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) {
			const err = new Error(`Failed to compile shader: ${this.#gl.getShaderInfoLog(shader)}`);
			this.#gl.deleteShader(shader);
			throw err;
		}

		return shader;
	}
}
