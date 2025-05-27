import {type FilterDef, type SVGFilterDef} from "@/MFilters/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feMorphology: SVGFilterDef = {
	displayName: "Morphology",
	author: "(SVG Native)",
	appuid: "native:feMorphology",
	interfaceFor: "feMorphology",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feMorphology v:in="in" v:operator="operator" v:radius="radius" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"},
	},
	values: {
		operator: {
			type: "SELECT",
			label: "Operator",
			values: ["erode", "dilate"],
			defaultValue: "erode"
		},
		radius: {type: "NUMBER", label: "Radius", ...numeric(0, 1, 100, 0.1)}
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feMorphology;
