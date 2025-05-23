import type {FilterDef} from "@/MFilters/types.ts";

const feMerge = {
	displayName: "Merge",
	author: "(SVG Native)",
	appuid: "native:feMerge",
	interfaceFor: "feMerge",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feMerge v:result="result"><v:inputs /></feMerge></fragment>`,
	contexts: ["//filter"],
	inputs: {
		inputs: {label: "InputsNode"}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feMerge;
