import type {FilterInputValues, FilterOutputs, SemverArray} from "@/MFilter/types.ts";
import type {MFilterFilter, SVGMFilterElement} from "@t/StructuredDocument.ts";
import {Namespaces} from "@/constants.ts";

const elements: SVGMFilterElement[] = [
	{
		instanceId: "1",
		appuid: "@superfleb/svgfilters/unsharpMask",
		version: [1, 0, 0],
		type: "MFILTER",
		inputs: {
			in: "SourceGraphic"
		},
		values: {
			intensity: 3,
			radius: 5,
		},
		outputs: {
			result: "unsharpmasked",
		},
	},
	{
		instanceId: "2",
		type: "NATIVE",
		nativeTag: "feGaussianBlur",
		appuid: "native:feGaussianBlur",
		inputs: {
			in: {
				outputName: "unsharpmasked",
				outputInstanceId: "1",
			},
		},
		values: {
			stdDeviation: 4,
		},
		outputs: {
			result: "blurred",
		}
	},
];

const sampleDocument = {
	type: Namespaces.svg,
	filters: new Map<string, MFilterFilter>([
		["filter", {
			id: "filter",
			elements,
		}]
	])
};

export default sampleDocument;