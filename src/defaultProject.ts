import type {FilterModel, FilterElement, FilterUtilityElement} from "@/ProjectModel/ProjectModel.ts";
import {Namespaces} from "@/constants.ts";

const defaultProject = {
	type: Namespaces.svg,
	filters: new Map<string, FilterModel>([
		["filter", {
			id: "filter",
			elements: new Map(
				[
					[
						"AUTO:SVGINPUTS",
						{
							"instanceId": "AUTO:SVGINPUTS",
							"type": "UTILITY",
							"singleton": true,
							"appuid": "@superfleb/mfilters/util/svginputs",
							"display": {
								"x": 0,
								"y": 0
							},
						}
					],
					[
						"1",
						{
							"instanceId": "1",
							"type": "SVGNATIVE",
							"appuid": "native:feFlood",
							"display": {
								"x": 200,
								"y": 100
							},
							"outputs": {
								"result": "result@1"
							},
							"values": {
								"floodColor": "rgb(255, 112, 112)"
							}
						}
					],
					[
						"AUTO:SVGOUTPUT",
						{
							"instanceId": "AUTO:SVGOUTPUT",
							"type": "UTILITY",
							"singleton": true,
							"appuid": "@superfleb/mfilters/util/svgoutputs",
							"inputs": {
								"sink": {
									"outputId": "result",
									"outputInstanceId": "1"
								}
							},
							"display": {
								"x": 500,
								"y": 0
							},
						}
					]
				],
			)
		}]
	])
};

export default defaultProject;