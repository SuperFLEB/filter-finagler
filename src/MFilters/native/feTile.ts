import type {SVGFilterDef} from "@/MFilters/types.ts";

const feTile: SVGFilterDef = {
	displayName: "Tile",
	author: "(SVG Native)",
	appuid: "native:feTile",
	interfaceFor: "feTile",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feTile v:in="in" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"}
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feTile;
