import {type SVGFilterDef} from "@/MFilters/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feGaussianBlur: SVGFilterDef = {
	displayName: "Gaussian Blur",
	appuid: "native:feGaussianBlur",
	author: "(SVG Native)",
	interfaceFor: "feGaussianBlur",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feGaussianBlur v:stdDeviation="stdDeviation" v:in="in" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {
			label: "Input",
		},
	},
	values: {
		stdDeviation: {
			type: "NUMBER",
			label: "Radius",
			...numeric(0, 5, 10, 0.001, true),
		},
	},
	outputs: {
		result: {
			label: "Result"
		}
	}
};

export default feGaussianBlur;
