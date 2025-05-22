import {
	type FilterDef,
	type InputValueDef,
	type FilterInputValues,
	type InputTypeName,
	type SupportedInputType,
	type Value,
	verifyTypeFromKey
} from "@/MFilter/types.ts";
import objectMap from "@/util/objectMap.ts";
import {colord} from "colord";

export const numeric = (min: number, defaultValue: number, max: number, step: number = .001, hardMin = false, hardMax = false) => ({
	min,
	defaultValue,
	max,
	step,
	hardMin,
	hardMax
});

export function clampedNumber(input: number | string | undefined, def: InputValueDef, index = 0): number {
	const num = Number(input);
	if (input === "" || input === undefined || num === undefined || isNaN(num)) {
		if (def.defaultValue === undefined) return 0;
		return (Array.isArray(def.defaultValue) ? Number(def.defaultValue[index]) : Number(def.defaultValue));
	}
	const min = def.hardMin ? (def.min ?? -Infinity) : -Infinity;
	const max = def.hardMax ? (def.max ?? Infinity) : Infinity;
	return Math.max(min, Math.min(max, num));
}

export function parseStringInput(value: string, inputDef: InputValueDef | undefined): Value | undefined {
	if (!inputDef) return value;
	const typeKey = inputDef.type;
	switch (typeKey) {
		case "STRING":
		case "RESULT":
			return value;
		case "SELECT":
			return (inputDef.values.includes(value)) ? value : undefined;
		case "COLOR":
			return colord(value).toRgbString();
		case "NUMBER":
			const numValue = Number(value);
			return isNaN(numValue) ? undefined : numValue;
		case "TABLE":
		case "MATRIX":
			const matches = value.match(/[0-9.]+/g);
			if (matches === null) return undefined;
			const numbers = matches.map(n => Number(n)).filter(n => !isNaN(n));
			if (!numbers.length) return undefined;
			return numbers;
	}
}

export function processInputsToValues(inputs: FilterInputValues, def: FilterDef): Record<string, Value> {
	if (!def.inputs) return {};
	return objectMap<InputValueDef, SupportedInputType>(def.inputs, ([inputName, inputDef]) => {
		if (inputs[inputName] === undefined) return undefined;
		const value = processInputToValue(inputs[inputName], inputDef);
		if (value === undefined) return undefined;
		return [inputName, value];
	});
}

function processInputToValue<T extends InputTypeName>(input: SupportedInputType | undefined = undefined, def: InputValueDef<T>): SupportedInputType | undefined {
	switch (def.type) {
		case "NUMBER":
			if (input !== undefined && !verifyTypeFromKey(input, "NUMBER")) throw new Error(`Invalid value for expected type ${def.type}`);
			return clampedNumber(input, def);
		case "STRING":
		case "SELECT":
		case "RESULT":
			if (input !== undefined && !verifyTypeFromKey(input, "STRING")) throw new Error(`Invalid value for expected type ${def.type}`);
			// TODO: Validate SELECT inputs
			return input ?? def.defaultValue ?? undefined;
		case "MATRIX":
		case "TABLE":
			if (input !== undefined && !verifyTypeFromKey(input, "TABLE")) throw new Error(`Invalid value for expected type ${def.type}`);
			// TODO: Process MATRIX and TABLE inputs
			return input ?? def.defaultValue ?? undefined;
		case "COLOR":
			if (!verifyTypeFromKey(input, "COLOR")) throw new Error(`Invalid value for expected type ${def.type}`);
			if ((input ?? def.defaultValue ?? undefined) === undefined) return undefined;
			return colord((input ?? def.defaultValue) as string).toRgbString();
	}
	// @ts-ignore (Just in case something slips past the types)
	throw new Error(`Unknown input type ${def.type}`);
}

export function processOutputsToValues(allValues: Record<string, string>, filterDef: FilterDef): Record<string, string> {
	return Object.fromEntries(Object.keys(filterDef.outputs ?? {}).map(k => allValues[k] ? [k, allValues[k]] : null).filter(kv => kv !== null));
}