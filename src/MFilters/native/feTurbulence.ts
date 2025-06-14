import {type FilterDef} from "@/MFilters/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feTurbulence = {
	displayName: "Turbulence",
	author: "(SVG Native)",
	appuid: "native:feTurbulence",
	interfaceFor: "feTurbulence",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feTurbulence v:type="type" v:baseFrequency="baseFrequency" v:numOctaves="numOctaves" v:seed="seed" v:stitchTiles="stitchTiles" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	values: {
		type: {
			type: "SELECT",
			label: "Type",
			values: ["turbulence", "fractalNoise"],
			defaultValue: "turbulence"
		},
		baseFrequency: {type: "NUMBER", label: "Base Frequency", ...numeric(0.001, 0.05, 1, 0.001)},
		numOctaves: {type: "NUMBER", label: "Number of Octaves", ...numeric(1, 1, 10, 1, true)},
		seed: {type: "NUMBER", label: "Seed", ...numeric(0, 0, 1000, 1)},
		stitchTiles: {
			type: "SELECT",
			label: "Stitch Tiles",
			values: ["noStitch", "stitch"],
			defaultValue: "noStitch"
		}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feTurbulence;
