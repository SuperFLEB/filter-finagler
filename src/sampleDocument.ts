import type {FilterModel, FilterElement, FilterUtilityElement} from "@/Project/ProjectModel.ts";
import {Namespaces} from "@/constants.ts";

const elements: FilterElement[] = [
	{
		type: "MFILTER",
		instanceId: "2",
		appuid: "@superfleb/mfilters/unsharpMask",
		version: [1, 0, 0],
		inputs: {
			in: {
				outputName: "SourceGraphic",
				outputInstanceId: null,
			},
		},
		values: {
			intensity: 3,
			radius: 5,
		},
		outputs: {
			result: "unsharpmasked",
		},
		display: {
			x: 200,
			y: 30,
		}
	},
	{
		instanceId: "3",
		type: "SVGNATIVE",
		nativeTag: "feColorMatrix",
		appuid: "native:feColorMatrix",
		inputs: {
			in: {
				outputName: "unsharpmasked",
				outputInstanceId: "2",
			},
		},
		values: {
			values: [
				-1,  0,  0,  0,  1,
				 0, -1,  0,  0,  1,
				 0,  0, -1,  0,  1,
				 0,  0,  0,  1,  0,
			],
		},
		outputs: {
			result: "inverted",
		},
		display: {
			x: 400,
			y: 30,
			displayName: "Color Invertotron",
		}
	}
];

const sampleDocument = {
	type: Namespaces.svg,
	filters: new Map<string, FilterModel>([
		["filter", {
			id: "filter",
			elements,
		}]
	])
};

export default sampleDocument;