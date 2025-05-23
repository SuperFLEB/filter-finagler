import {type FilterDef} from "@t/MFilter.ts";
import {numeric} from "@/util/numericParams.ts";

const feFlood = {
	displayName: "Flood",
	author: "(SVG Native)",
	appuid: "native:feFlood",
	interfaceFor: "feFlood",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feFlood v:flood-color="floodColor" v:flood-opacity="floodOpacity" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		floodColor: {type: "STRING", label: "Flood Color"},
		floodOpacity: {type: "NUMBER", label: "Flood Opacity", ...numeric(0, 1, 1, 0.01)}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feFlood;
