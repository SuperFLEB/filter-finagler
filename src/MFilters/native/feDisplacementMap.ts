import {type SVGFilterDef} from "@/MFilters/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feDisplacementMap: SVGFilterDef = {
	displayName: "Displacement Map",
	author: "(SVG Native)",
	appuid: "native:feDisplacementMap",
	interfaceFor: "feDisplacementMap",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feDisplacementMap v:in="in" v:in2="in2" v:scale="scale" v:xChannelSelector="xChannelSelector" v:yChannelSelector="yChannelSelector" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"},
		in2: {label: "Input 2"},
	},
	values: {
		scale: {type: "NUMBER", label: "Scale", ...numeric(0, 20, 500, 1)},
		xChannelSelector: {
			type: "SELECT",
			label: "X Channel Selector",
			values: ["R", "G", "B", "A"],
			defaultValue: "A"
		},
		yChannelSelector: {
			type: "SELECT",
			label: "Y Channel Selector",
			values: ["R", "G", "B", "A"],
			defaultValue: "A"
		}
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feDisplacementMap;
