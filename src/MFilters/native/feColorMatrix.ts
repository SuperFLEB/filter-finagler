import type {FilterDef} from "@/MFilters/types.ts";

const feColorMatrix = {
	native: true,
	interfaceFor: "feColorMatrix",

	displayName: "Color Matrix",
	author: "(SVG Native)",
	appuid: "native:feColorMatrix",
	version: [1, 0, 0],

	template: `<fragment xmlns:v="vars"><feColorMatrix v:in="in" v:type="type" v:values="values" v:result="result" /></fragment>`,

	contexts: ["//filter"],

	inputs: {
		 in: { label: "Input" },
	},
	values: {
		type: {
			type: "SELECT",
			label: "Type",
			values: ["matrix", "saturate", "hueRotate", "luminanceToAlpha"],
			defaultValue: "matrix"
		},
		values: {type: "MATRIX", label: "Values"}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feColorMatrix;