import {type SVGFilterDef} from "@/MFilter/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feFlood: SVGFilterDef = {
	displayName: "Flood Fill",
	author: "(SVG Native)",
	appuid: "native:feFlood",
	interfaceFor: "feFlood",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feFlood v:flood-color="floodColor" v:flood-opacity="floodOpacity" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	values: {
		floodColor: {type: "COLOR", label: "Flood Color"},
		floodOpacity: {type: "NUMBER", label: "Flood Opacity", ...numeric(0, 1, 1, 0.01)}
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feFlood;
