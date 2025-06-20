import {type SVGFilterDef} from "@/MFilter/types.ts";
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
		radius: {
			type: "VECTOR",
			label: "Radius",
			defaultValue: [5, 5],
			clamps: [
				numeric(0, 5, 10, 0.001, true),
				numeric(0, 5, 10, 0.001, true)
			]
		},
	},
	derivations: {
		stdDeviation: values => values.radius.join(" ")
	},
	outputs: {
		result: {
			label: "Result"
		}
	}
};

export default feGaussianBlur;
