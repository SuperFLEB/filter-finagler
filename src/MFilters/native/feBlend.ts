import type {FilterDef} from "@/MFilters/types.ts";

const feBlend = {
	native: true,
	interfaceFor: "feBlend",

	displayName: "Blend",
	author: "(SVG Native)",
	appuid: "native:feBlend",
	version: [1, 0, 0],

	template: `<fragment xmlns:v="vars"><feBlend v:in="in" v:in2="in2" v:mode="mode" v:result="result" /></fragment>`,

	contexts: ["//filter"],

	inputs: {
		in: { label: "Input" },
		in2: { label: "Input 2" },
	},
	values: {
		mode: {
			type: "SELECT",
			label: "Blend Mode",
			values: ["normal", "multiply", "screen", "darken", "lighten"],
			defaultValue: "normal"
		}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feBlend;