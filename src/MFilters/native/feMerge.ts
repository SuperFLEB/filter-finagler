import type {SVGFilterDef} from "@/MFilters/types.ts";

const feMerge: SVGFilterDef = {
	displayName: "Merge",
	author: "(SVG Native)",
	appuid: "native:feMerge",
	interfaceFor: "feMerge",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feMerge v:result="result"><v:inputs /></feMerge></fragment>`,
	contexts: ["//filter"],
	values: {
		mode: {
			type: "SELECT",
			values: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
			defaultValue: "normal",
		}
	},
	inputs: {
		in: {label: "Input 1"},
		in2: {label: "Input 2"},
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feMerge;
