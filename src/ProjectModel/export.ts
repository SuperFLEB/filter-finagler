import type {FilterElement, FilterUtilityElement, ProjectModel,} from "@/ProjectModel/ProjectModel.ts";
import type {Edge, Node as FlowNode} from "@vue-flow/core";
import {Position} from "@vue-flow/core";
import {Namespaces} from "@/constants.ts";
import MFilter from "@/MFilter/MFilter.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";
import {xmlNotate} from "./xmlNotate.ts";
import {makeOutputNodeRef} from "@/ProjectModel/util.ts";
import xmlns from "@/util/xmlns.ts";
import type {FilterDef} from "@/MFilter/types.ts";
import SvgOutput from "@/MFilters/utility/SvgOutput.ts";
import SvgInputs from "@/MFilters/utility/SvgInputs.ts";
import type {FEConnectionStatus} from "@/ProjectModel/validate.ts";
import xpath from "@/util/xpath.ts";

export function toGraph(project: ProjectModel, filterId: string = "filter"): { nodes: FlowNode[], edges: Edge[] } {
	const filter = project.filters.get(filterId);
	if (!filter) throw new Error(`Filter ${filter} does not exist`);

	const nodes: FlowNode<FilterElement>[] = [];
	const edges = [];

	const filterElements = filter.elements ?? [];

	const requiredUtilityNodes: Record<string, Partial<FilterUtilityElement> & { instanceId: string }> = {
		[SvgInputs.appuid]: {singleton: true, instanceId: "AUTO:SVGINPUTS"},
		[SvgOutput.appuid]: {singleton: true, instanceId: "AUTO:SVGOUTPUT"},
	};

	for (const [appuid, defaults] of Object.entries(requiredUtilityNodes)) {
		if (!(filterElements.size && [...filterElements.values()].find(u => u.appuid === appuid))) {
			filterElements.set(defaults.instanceId, {
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

	const svgInputNode = [...filterElements.values()].find(fe => fe.appuid === SvgInputs.appuid) as FilterUtilityElement;

	for (const fe of filterElements.values()) {
		const {x = 0, y = 0} = fe.display ?? {};

		nodes.push({
			id: fe.instanceId,
			type: "filterElement",
			data: {...fe},
			position: {x, y},
			sourcePosition: Position.Right,
			targetPosition: Position.Left,
		});

		// Connect inputs with edges
		for (const [name, input] of Object.entries(fe.inputs ?? {})) {
			if (!input) continue;

			const outputInstanceId = input.outputInstanceId ?? svgInputNode.instanceId;

			const sourceHandle = makeOutputNodeRef(input.outputId, outputInstanceId);
			const targetHandle = makeOutputNodeRef(name, fe.instanceId);

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

export function toSVGDoc(project: ProjectModel, filterName: string, validity?: FEConnectionStatus, includeMFMeta: boolean = false): XMLDocument {
	const filter = project.filters.get(filterName);
	const filterElements = filter?.elements;

	if (!filterElements) throw new Error(`Filter ${filterName} does not exist`);

	const svgDoc = document.implementation.createDocument(Namespaces.svg, "");
	const svgElement = svgDoc.appendChild(document.createElementNS(Namespaces.svg, "svg"));

	if (includeMFMeta) xmlns(svgElement, {m: "svgmf", d: "display"});

	const defsElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "defs"));
	const filterElement = defsElement.appendChild(document.createElementNS(Namespaces.svg, "filter"));

	filterElement.setAttribute("id", filterName);

	const domElementsByInstanceId = new Map<string, Element[]>();

	const filterElementsValues = filterElements.values();
	let outputInstanceId: string | undefined = undefined;

	for (const fe of filterElementsValues) {
		if (fe.type === "UTILITY") {
			if (fe.appuid === SvgOutput.appuid) {
				outputInstanceId = fe.inputs?.sink?.outputInstanceId ?? undefined;
			}
			continue;
		}
		if (validity && !validity.get(fe.instanceId)) continue;

		const filterDef = fe.appuid !== undefined && getFilterById(fe.appuid);
		if (!filterDef) continue;

		domElementsByInstanceId.set(fe.instanceId, Array.from(new MFilter(filterDef as FilterDef, filter).fillTemplate(fe, includeMFMeta).children));
	}

	// Move the output-connected elements to the end of the SVG output, since that is what determines what shows
	if (outputInstanceId) {
		const outputConnectedElement = domElementsByInstanceId.get(outputInstanceId);
		if (outputConnectedElement) {
			domElementsByInstanceId.delete(outputInstanceId);
			domElementsByInstanceId.set(outputInstanceId, outputConnectedElement);
		}
	}

	filterElement.append(...Array.from(domElementsByInstanceId.values()).flat(1));

	return svgDoc;
}
