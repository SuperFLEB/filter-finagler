import {type SVGFilterDef} from "@/MFilter/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feDropShadow: SVGFilterDef = {
	displayName: "Drop Shadow",
	author: "(SVG Native)",
	appuid: "native:feDropShadow",
	interfaceFor: "feDropShadow",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feDropShadow v:dx="dx" v:dy="dy" v:stdDeviation="stdDeviation" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"},
	},
	values: {
		distance: {type: "VECTOR", components: 2, label: "Distance", defaultValue: [0,0], clamps: [
			numeric(-500, 0, 500, 1),
			numeric(-500, 0, 500, 1)
		]},
		stdDeviation: {type: "NUMBER", label: "Blur Radius", ...numeric(0, 4, 50, 0.1)}
	},
	derivations: {
		dx: (values) => values.distance[0],
		dy: (values) => values.distance[1]
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feDropShadow;
