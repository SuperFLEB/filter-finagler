import type {MFilterFilter, SVGMFilterElement} from "@/Project/ProjectModel.ts";
import {Namespaces} from "@/constants.ts";

const elements: SVGMFilterElement[] = [
	{
		instanceId: "1",
		appuid: "@superfleb/mfilters/unsharpMask",
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
		display: {
			x: 0,
			y: 0,
		}
	},
	{
		instanceId: "2",
		type: "NATIVE",
		nativeTag: "feColorMatrix",
		appuid: "native:feColorMatrix",
		inputs: {
			in: {
				outputName: "unsharpmasked",
				outputInstanceId: "1",
			},
		},
		values: {
			values: [
				-1,  0,  0,  0,  1,
				 0, -1,  0,  0,  1,
				 0,  0, -1,  0,  1,
				 0,  0,  0,  1,  0,
			]
		},
		outputs: {
			result: "blurred",
		},
		display: {
			x: 100,
			y: 0,
			displayName: "Color Invertotron",
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