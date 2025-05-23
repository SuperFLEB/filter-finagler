import type {FilterDef} from "@t/MFilter.ts";

const feTile = {
	displayName: "Tile",
	author: "(SVG Native)",
	appuid: "native:feTile",
	interfaceFor: "feTile",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feTile v:in="in" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feTile;
