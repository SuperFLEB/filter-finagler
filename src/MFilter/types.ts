import {type StringToTypeMap, type TypeFromString, verifyTypeFromString} from "@t/TypeFromString.ts";

export type Value = string | number | number[];

type BlendType =
	"normal"
	| "multiply"
	| "screen"
	| "overlay"
	| "darken"
	| "lighten"
	| "color-dodge"
	| "color-burn"
	| "hard-light"
	| "soft-light"
	| "difference"
	| "exclusion"
	| "hue"
	| "saturation"
	| "color"
	| "luminosity";

type CompositeOperator = "over" | "in" | "out" | "atop" | "xor" | "lighter" | "arithmetic";

const InputTypeStringMap = Object.freeze({
	"STRING": "string",
	"SELECT": "string",
	"RESULT": "string",
	"COLOR": "string",
	"NUMBER": "number",
	"MATRIX": "number[]",
	"TABLE": "number[]",
} as const);

export function verifyTypeFromKey<S extends keyof typeof InputTypeStringMap>(value: any, typeKey: S): value is StringToTypeMap[typeof InputTypeStringMap[S]] {
	const expectType = InputTypeStringMap[typeKey];
	return verifyTypeFromString(value, expectType);
}

export type InputTypeMap = {
	[k in keyof typeof InputTypeStringMap]: TypeFromString<typeof InputTypeStringMap[k]>;
}

export type InputTypeName = keyof InputTypeMap;
export type SupportedInputType = InputTypeMap[keyof InputTypeMap];

type Clamps<T extends number | never> = {
	min?: T extends number ? number : never,
	max?: T extends number ? number : never,
	step?: T extends number ? number : never,
	hardMin?: T extends number ? boolean : never,
	hardMax?: T extends number ? boolean : never,
}

export type InputValueDef<T extends keyof InputTypeMap = keyof InputTypeMap> = {
	label?: string;
	type: T;
} & (
	({ type: "NUMBER", defaultValue?: number | null | undefined } & Clamps<number>) |
	({ type: "TABLE" | "MATRIX", defaultValue?: number[] | null | undefined } & Clamps<number>) |
	({ type: "COLOR" | "STRING", defaultValue?: string | null | undefined } & Clamps<never>) |
	({
		type: "SELECT",
		values: string[],
		defaultValue?: string | null | undefined,
	} & Clamps<never>)
);

export type InputReferenceDef = {
	label?: string;
};

export type OutputDef = { label: string };

export type FilterInputValues = Record<string, Value>;
export type FilterOutputs = Record<string, string>;

export type SemverArray = [number, number, number];
export type FilterInputValueDefs = Record<string, InputValueDef>;
export type FilterInputReferenceDefs = Record<string, InputReferenceDef>;
export type FilterOutputDefs = Record<string, OutputDef>;

export type FilterDef = {
	displayName: string;
	author: string;
	appuid: string;
	version: SemverArray;

	native?: boolean;
	interfaceFor?: string;

	template: string;

	contexts?: string[];
	derivations?: Record<string, (values: Record<string, any>) => any>;
	inputs?: FilterInputReferenceDefs;
	values?: FilterInputValueDefs;
	outputs?: FilterOutputDefs;

	// The "upgrade" function is not implemented yet, but is included for future use.
	upgrade?: (previousVersion: SemverArray, element: Element) => Record<string, any>;

	transformAttributes?: (feElement: Element, currentAttributes: Record<string, Value | undefined>) => Record<string, string | undefined>;
} & ({
	native: true;
	interfaceFor: string;
} | {
	native?: false,
	interfaceFor?: never
});

export type DisplayInfo = {
	x?: number;
	y?: number;
	name?: string;
}

export type MFilterInfo = {
	displayName: string,
	instanceId: string,
	inputs: FilterDef["inputs"],
	outputs: FilterDef["outputs"],
	display?: DisplayInfo,
};
