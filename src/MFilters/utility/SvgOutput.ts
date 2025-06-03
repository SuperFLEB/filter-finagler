import type {UtilityNodeDef} from "@/MFilter/types.ts";

const svgInputs: UtilityNodeDef = {
	type: "UTILITY",
	displayName: "SVG Filter Output",
	author: "(Built-in)",
	appuid: "@superfleb/mfilters/util/svgoutputs",
	version: [1, 0, 0],

	contexts: ["//filter"],

	inputs: {
		sink: { label: "Output" },
	}
};

export default svgInputs;