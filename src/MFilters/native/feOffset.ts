import {type FilterDef, type SVGFilterDef} from "@/MFilters/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feOffset: SVGFilterDef = {
	displayName: "Offset",
	author: "(SVG Native)",
	appuid: "native:feOffset",
	interfaceFor: "feOffset",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feOffset v:in="in" v:dx="dx" v:dy="dy" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"},
	},
	values: {
		dx: {type: "NUMBER", label: "dx", ...numeric(-500, 0, 500, 1)},
		dy: {type: "NUMBER", label: "dy", ...numeric(-500, 0, 500, 1)}
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feOffset;
