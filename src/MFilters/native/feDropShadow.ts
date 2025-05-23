import {type FilterDef} from "@/MFilters/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feDropShadow = {
	displayName: "Drop Shadow",
	author: "(SVG Native)",
	appuid: "native:feDropShadow",
	interfaceFor: "feDropShadow",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feDropShadow v:dx="dx" v:dy="dy" v:stdDeviation="stdDeviation" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: { label: "Input" },
	},
	values: {
		dx: {type: "NUMBER", label: "dx", ...numeric(-500, 0, 500, 1)},
		dy: {type: "NUMBER", label: "dy", ...numeric(-500, 0, 500, 1)},
		stdDeviation: {type: "NUMBER", label: "Blur Radius", ...numeric(0, 4, 50, 0.1)}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feDropShadow;
