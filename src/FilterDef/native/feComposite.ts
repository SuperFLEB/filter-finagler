import {type FilterDef} from "@/MFilter/types.ts";
import {numeric} from "@/MFilter/util.ts";

const feComposite = {
	displayName: "Composite",
	author: "(SVG Native)",
	appuid: "native:feComposite",
	interfaceFor: "feComposite",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feComposite v:in="in" v:in2="in2" v:operator="operator" v:k1="k1" v:k2="k2" v:k3="k3" v:k4="k4" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: { label: "Input" },
		in2: { label: "Input 2" },
	},
	values: {
		operator: {
			type: "SELECT",
			label: "Operator",
			values: ["over", "in", "out", "atop", "xor", "lighter", "arithmetic"],
			defaultValue: "over"
		},
		k1: {type: "NUMBER", label: "k1", ...numeric(0, 0, 1, 0.01)},
		k2: {type: "NUMBER", label: "k2", ...numeric(0, 0, 1, 0.01)},
		k3: {type: "NUMBER", label: "k3", ...numeric(0, 0, 1, 0.01)},
		k4: {type: "NUMBER", label: "k4", ...numeric(0, 0, 1, 0.01)}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feComposite;
