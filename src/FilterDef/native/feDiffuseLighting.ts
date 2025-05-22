import {type FilterDef} from "@/MFilter/types.ts";
import {numeric} from "@/MFilter/util.ts";

const feDiffuseLighting = {
	displayName: "Diffuse Lighting",
	author: "(SVG Native)",
	appuid: "native:feDiffuseLighting",
	interfaceFor: "feDiffuseLighting",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feDiffuseLighting v:in="in" v:surfaceScale="surfaceScale" v:diffuseConstant="diffuseConstant" v:kernelUnitLength="kernelUnitLength" v:lightingColor="lightingColor" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"},
	},
	values: {
		surfaceScale: {type: "NUMBER", label: "Surface Scale", ...numeric(0, 1, 100, 0.1)},
		diffuseConstant: {type: "NUMBER", label: "Diffuse Constant", ...numeric(0, 1, 100, 0.1)},
		kernelUnitLength: {type: "NUMBER", label: "Kernel Unit Length", ...numeric(0.01, 1, 100, 0.01)},
		lightingColor: {type: "STRING", label: "Lighting Color"}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feDiffuseLighting;