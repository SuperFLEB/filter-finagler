import type {FilterElement, FilterModel} from "@/ProjectModel/ProjectModel.ts";
import {Namespaces} from "@/constants.ts";


const defaultProject = {
	type: Namespaces.svg,
	filters: new Map<string, FilterModel>([
		["filter", {
			id: "filter",
			elements: new Map<string, FilterElement>(
				[
					[
						"AUTO:SVGINPUTS",
						{
							instanceId: "AUTO:SVGINPUTS",
							type: "UTILITY",
							singleton: true,
							appuid: "@superfleb/mfilters/util/svginputs",
							display: {
								x: 0,
								y: 0
							},
						}
					],
					[
						"1",
						{
							instanceId: "1",
							type: "SVGNATIVE",
							appuid: "native:feOffset",
							display: {
								x: 200,
								y: 100
							},
							inputs: {
								in: {
									outputId: "SourceGraphic",
									outputInstanceId: null,
								},
							},
							outputs: {
								result: "result@1"
							},
							values: {
								distance: [0, 0]
							}
						}
					],
					[
						"AUTO:SVGOUTPUT",
						{
							instanceId: "AUTO:SVGOUTPUT",
							type: "UTILITY",
							singleton: true,
							appuid: "@superfleb/mfilters/util/svgoutputs",
							inputs: {
								sink: {
									outputId: "result",
									outputInstanceId: "1"
								}
							},
							display: {
								x: 500,
								y: 0
							}
						}
					]
				],
			)
		}]
	])
};

export default defaultProject;