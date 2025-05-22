export type Matrix = number[];
export type Table = number[];

export type FeBlendMode = 'normal' | 'multiply' | 'screen' | 'darken' | 'lighten';
export type FeColorMatrixType = 'matrix' | 'saturate' | 'hueRotate' | 'luminanceToAlpha';
export type FeCompositeOperator =
	| 'over'
	| 'in'
	| 'out'
	| 'atop'
	| 'xor'
	| 'lighter'
	| 'arithmetic';
export type FeEdgeMode = 'duplicate' | 'wrap' | 'none';
export type FeChannelSelector = 'R' | 'G' | 'B' | 'A';
export type FeMorphologyOperator = 'erode' | 'dilate';
export type FeTurbulenceType = 'turbulence' | 'fractalNoise';
export type FeStitchTiles = 'stitch' | 'noStitch';

export type FeBlend = {
	fe: 'feBlend';
	in: string;
	in2: string;
	mode?: FeBlendMode;
};

export type FeColorMatrix = {
	type: FeColorMatrixType;
	fe: 'feColorMatrix';
	in: string;
	values?: Matrix;
};

export type FeComponentTransfer = {
	fe: 'feComponentTransfer';
	in: string;
	tableValues?: Table;
};

export type FeComposite = {
	fe: 'feComposite';
	in: string;
	in2: string;
	operator?: FeCompositeOperator;
	k1?: number;
	k2?: number;
	k3?: number;
	k4?: number;
};

export type FeConvolveMatrix = {
	fe: 'feConvolveMatrix';
	in: string;
	order: number | [number, number];
	kernelMatrix: Matrix;
	divisor?: number;
	bias?: number;
	targetX?: number;
	targetY?: number;
	edgeMode?: FeEdgeMode;
	preserveAlpha?: boolean;
};

export type FeDiffuseLighting = {
	fe: 'feDiffuseLighting';
	in: string;
	surfaceScale?: number;
	diffuseConstant?: number;
	kernelUnitLength?: number | [number, number];
	lightingColor?: string;
};

export type FeDisplacementMap = {
	fe: 'feDisplacementMap';
	in: string;
	in2: string;
	scale: number;
	xChannelSelector?: FeChannelSelector;
	yChannelSelector?: FeChannelSelector;
};

export type FeDropShadow = {
	fe: 'feDropShadow';
	dx: number;
	dy: number;
	stdDeviation: number;
};

export type FeFlood = {
	fe: 'feFlood';
	floodColor?: string;
	floodOpacity?: number;
};

export type FeGaussianBlur = {
	fe: 'feGaussianBlur';
	in: string;
	stdDeviation: number;
	edgeMode?: FeEdgeMode;
};

export type FeImage = {
	fe: 'feImage';
	href: string;
	preserveAspectRatio?: string;
};

export type FeMerge = {
	fe: 'feMerge';
	inputs: string[];
};

export type FeMorphology = {
	fe: 'feMorphology';
	in: string;
	operator: FeMorphologyOperator;
	radius: number | [number, number];
};

export type FeOffset = {
	fe: 'feOffset';
	in: string;
	dx?: number;
	dy?: number;
};

export type FeSpecularLighting = {
	fe: 'feSpecularLighting';
	in: string;
	surfaceScale?: number;
	specularConstant?: number;
	specularExponent?: number;
	kernelUnitLength?: number | [number, number];
	lightingColor?: string;
};

export type FeTile = {
	fe: 'feTile';
	in: string;
};

export type FeTurbulence = {
	fe: 'feTurbulence';
	type?: FeTurbulenceType;
	baseFrequency: number | [number, number];
	numOctaves?: number;
	seed?: number;
	stitchTiles?: FeStitchTiles;
};

export type FeFilter =
	| FeBlend
	| FeColorMatrix
	| FeComponentTransfer
	| FeComposite
	| FeConvolveMatrix
	| FeDiffuseLighting
	| FeDisplacementMap
	| FeDropShadow
	| FeFlood
	| FeGaussianBlur
	| FeImage
	| FeMerge
	| FeMorphology
	| FeOffset
	| FeSpecularLighting
	| FeTile
	| FeTurbulence;