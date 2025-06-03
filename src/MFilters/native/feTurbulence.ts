import {type SVGFilterDef} from "@/MFilter/types.ts";
import {numeric} from "@/util/numericParams.ts";

const feTurbulence: SVGFilterDef = {
	displayName: "Turbulence",
	author: "(SVG Native)",
	appuid: "native:feTurbulence",
	interfaceFor: "feTurbulence",
	type: "SVGNATIVE",
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
};

export default feTurbulence;
