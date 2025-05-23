import {type FilterDef} from "@t/MFilter.ts";
import {numeric} from "@/util/numericParams.ts";

const feSpecularLighting = {
	displayName: "Specular Lighting",
	author: "(SVG Native)",
	appuid: "native:feSpecularLighting",
	interfaceFor: "feSpecularLighting",
	native: true,
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feSpecularLighting v:in="in" v:surfaceScale="surfaceScale" v:specularConstant="specularConstant" v:specularExponent="specularExponent" v:kernelUnitLength="kernelUnitLength" v:lightingColor="lightingColor" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	inputs: {
		in: {label: "Input"},
	},
	values: {
		surfaceScale: {type: "NUMBER", label: "Surface Scale", ...numeric(0, 1, 100, 0.1)},
		specularConstant: {type: "NUMBER", label: "Specular Constant", ...numeric(0, 1, 100, 0.1)},
		specularExponent: {type: "NUMBER", label: "Specular Exponent", ...numeric(1, 20, 100, 0.1)},
		kernelUnitLength: {type: "NUMBER", label: "Kernel Unit Length", ...numeric(0.01, 1, 100, 0.01)},
		lightingColor: {type: "STRING", label: "Lighting Color"}
	},
	outputs: {
		result: {label: "Result"}
	}
} as FilterDef;

export default feSpecularLighting;
