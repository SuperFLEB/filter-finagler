import type {UtilityNodeDef} from "@/MFilters/types.ts";

const svgInputs: UtilityNodeDef = {
	type: "UTILITY",
	displayName: "SVG Inputs",
	author: "(Built-in)",
	appuid: "@superfleb/mfilters/util/svginputs",
	version: [1, 0, 0],

	contexts: ["//filter"],

	outputs: {
		"SourceGraphic": { label: "SourceGraphic", universal: true },
		"SourceAlpha": { label: "SourceAlpha", universal: true },
		"BackgroundImage": { label: "BackgroundImage", universal: true },
		"BackgroundAlpha": { label: "BackgroundAlpha", universal: true },
		"FillPaint": { label: "FillPaint", universal: true },
		"StrokePaint": { label: "StrokePaint", universal: true }
	}
};

export default svgInputs;