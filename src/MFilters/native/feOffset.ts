import {type SVGFilterDef} from "@/MFilter/types.ts";
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
		distance: {type: "VECTOR", label: "Distance", defaultValue: [0, 0], clamps: [
			numeric(-500, 0, 500, 1),
			numeric(-500, 0, 500, 1),
		]}
	},
	derivations: {
		dx: (values) => values.distance[0],
		dy: (values) => values.distance[1],
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feOffset;
