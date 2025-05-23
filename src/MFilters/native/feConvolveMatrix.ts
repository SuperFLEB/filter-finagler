import {type FilterDef} from "@/MFilters/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feConvolveMatrix = {
	displayName: "Convolve Matrix",
	author: "(SVG Native)",
	appuid: "native:feConvolveMatrix",
	interfaceFor: "feConvolveMatrix",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feConvolveMatrix v:in="in" v:order="order" v:kernelMatrix="kernelMatrix" v:divisor="divisor" v:bias="bias" v:targetX="targetX" v:targetY="targetY" v:edgeMode="edgeMode" v:preserveAlpha="preserveAlpha" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"},
	},
	values: {
		order: {type: "NUMBER", label: "Order", ...numeric(1, 3, 25, 1, true)},
		kernelMatrix: {type: "MATRIX", label: "Kernel Matrix"},
		divisor: {type: "NUMBER", label: "Divisor", ...numeric(0.001, 1, 100, 0.01)},
		bias: {type: "NUMBER", label: "Bias", ...numeric(-1, 0, 1, 0.01)},
		targetX: {type: "NUMBER", label: "Target X", ...numeric(0, 0, 25, 1)},
		targetY: {type: "NUMBER", label: "Target Y", ...numeric(0, 0, 25, 1)},
		edgeMode: {
			type: "SELECT",
			label: "Edge Mode",
			values: ["duplicate", "wrap", "none"],
			defaultValue: "none"
		},
		preserveAlpha: {
			type: "SELECT",
			label: "Preserve Alpha",
			values: ["true", "false"],
			defaultValue: "false"
		}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feConvolveMatrix;