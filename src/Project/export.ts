import type {FilterElement, FilterUtilityElement, ProjectModel,} from "@/Project/ProjectModel.ts";
import type {Edge, Node as FlowNode} from "@vue-flow/core";
import {Position} from "@vue-flow/core";
import {Namespaces} from "@/constants.ts";
import MFilter from "@/MFilters/MFilter.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";
import {xmlNotate} from "./xmlNotate.ts";
import {getOutputRef} from "@/Project/util.ts";
import namespace from "@/util/namespace.ts";
import SvgInputs from "@/MFilters/utility/SvgInputs.ts";
import type {FilterDef} from "@/MFilters/types.ts";

function getNodeType(fe: FilterElement) {
	if (fe.type === "SVGINPUTS") return "inputs";
	return "filterElement";
}

export function toGraph(project: ProjectModel, filterId: string = "filter"): { nodes: FlowNode[], edges: Edge[] } {
	const filter = project.filters.get(filterId);
	if (!filter) throw new Error(`Filter ${filter} does not exist`);

	const nodes: FlowNode<FilterElement>[] = [];
	const edges = [];

	const filterElements = filter.elements ?? [];

	const requiredUtilityNodes: Record<string, Partial<FilterUtilityElement> & { instanceId: string }> = {
		[SvgInputs.appuid]: {singleton: true, instanceId: "AUTO:SVGINPUTS"}
	};

	for (const [appuid, defaults] of Object.entries(requiredUtilityNodes)) {
		if (!(filterElements.length && filterElements.find(u => u.appuid === appuid))) {
			filterElements.push({
				type: "UTILITY",
				singleton: defaults.singleton ?? true,
				appuid,
				display: {
					x: 0,
					y: 0,
				},
				...defaults,
			});
		}
	}

	const svgInputNode = filterElements.find(fe => fe.appuid === SvgInputs.appuid) as FilterUtilityElement;

	for (const fe of filterElements) {
		const {x = 0, y = 0} = fe.display ?? {};

		nodes.push({
			id: fe.instanceId,
			type: getNodeType(fe),
			data: {...fe},
			position: {x, y},
			sourcePosition: Position.Right,
			targetPosition: Position.Left,
		});

		// Connect inputs with edges
		for (const [name, input] of Object.entries(fe.inputs ?? {})) {
			if (!input) continue;

			const outputInstanceId = input.outputInstanceId ?? svgInputNode.instanceId;

			const sourceHandle = getOutputRef(input.outputName, outputInstanceId);
			const targetHandle = getOutputRef(name, fe.instanceId);

			edges.push({
				source: outputInstanceId,
				target: fe.instanceId,
				sourceHandle,
				targetHandle,
				id: `${sourceHandle}-${targetHandle}`,
			});
		}
	}

	return {nodes, edges};
}

export function toSVGDoc(project: ProjectModel, filterName: string, includeMFMeta: boolean = false): XMLDocument {
	const mfe = project.filters.get(filterName)?.elements;

	if (!mfe) throw new Error(`Filter ${filterName} does not exist`);

	const svgDoc = document.implementation.createDocument(Namespaces.svg, "");
	const svgElement = svgDoc.appendChild(document.createElementNS(Namespaces.svg, "svg"));

	if (includeMFMeta) namespace(svgElement, {m: "svgmf", d: "display"});

	const defsElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "defs"));
	const filterElement = defsElement.appendChild(document.createElementNS(Namespaces.svg, "filter"));

	filterElement.setAttribute("id", filterName);

	const domElements: Element[][] = mfe.map<Element[]>(fe => {
		if (fe.type === "UTILITY") return [];
		const filterDef = fe.appuid !== undefined && getFilterById(fe.appuid);
		if (!filterDef) return [];
		return Array.from(new MFilter(filterDef as FilterDef).fillTemplate(fe, includeMFMeta).children);
	});

	filterElement.append(...domElements.flat(1));
	if (includeMFMeta) {
		xmlNotate(project, filterName, svgDoc);
	}

	return svgDoc;
}