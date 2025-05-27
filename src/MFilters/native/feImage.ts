import type {SVGFilterDef} from "@/MFilters/types.ts";

const feImage: SVGFilterDef = {
	displayName: "Image",
	author: "(SVG Native)",
	appuid: "native:feImage",
	interfaceFor: "feImage",
	type: "SVGNATIVE",
	version: [1, 0, 0],
	template: `<fragment xmlns:v="vars"><feImage v:href="href" v:preserveAspectRatio="preserveAspectRatio" v:result="result" /></fragment>`,
	contexts: ["//filter"],
	values: {
		href: {type: "STRING", label: "Image URL"},
		preserveAspectRatio: {type: "STRING", label: "Preserve Aspect Ratio"}
	},
	outputs: {
		result: {label: "Result"}
	}
};

export default feImage;
