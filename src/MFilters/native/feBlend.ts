import type {SVGFilterDef} from "@/MFilter/types.ts";

const feBlend: SVGFilterDef = {
	type: "SVGNATIVE",
	interfaceFor: "feBlend",

	displayName: "Blend",
	author: "(SVG Native)",
	appuid: "native:feBlend",
	version: [1, 0, 0],

	template: `<fragment xmlns:v="vars"><feBlend v:in="in" v:in2="in2" v:mode="mode" v:result="result" /></fragment>`,

	contexts: ["//filter"],

	inputs: {
		in: {label: "Input"},
		in2: {label: "Input 2"},
	},
	values: {
		mode: {
			type: "SELECT",
			label: "Blend Mode",
			values: ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
			defaultValue: "normal"
		}
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feBlend;