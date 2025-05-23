import type {StructuredDocument} from "@t/StructuredDocument.ts";
import type {Node as FlowNode} from "@vue-flow/core";
import {Position} from "@vue-flow/core";
import {Namespaces} from "@/constants.ts";
import MFilter from "@/MFilter/MFilter.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";
import {annotate} from "./annotate.ts";

export function toGraph(doc: StructuredDocument, filterId: string = "filter") {
	const filter = doc.filters.get(filterId);
	if (!filter) throw new Error(`Filter ${filter} does not exist`);

	const inputsNode = {
		id: "in:0",
		type: "inputs",
		data: {},
		position: {x: 0, y: 0},
		sourcePosition: Position.Left,
		targetPosition: Position.Right,
	};

	const nodes: FlowNode[] = [inputsNode];
	const edges = [];

	for (const fe of filter.elements) {
		nodes.push({
			id: fe.instanceId,
			type: "filterElement",
			data: fe,
			position: {x: 0, y: 0},
			sourcePosition: Position.Left,
			targetPosition: Position.Right,
		});

		for (const [name, input] of Object.entries(fe.inputs ?? {})) {
			if (!input) continue;

			if (typeof input === "string") {
				edges.push({
					source: inputsNode.id,
					target: fe.instanceId,
					sourceHandleId: input,
					targetHandleId: name,
					id: `${input}-${name}@${fe.instanceId}`,
				});
				continue;
			}

			edges.push({
				source: input.outputInstanceId,
				target: fe.instanceId,
				sourceHandleId: input.outputName,
				targetHandleId: name,
				id: `${input.outputName}@${input.outputInstanceId}-${name}@${fe.instanceId}`,
			});
		}
	}

	return {nodes, edges};
}

export function toSVGDoc(doc: StructuredDocument, filterName: string, includeMFMeta: boolean = false): XMLDocument {
	const mfe = doc.filters.get(filterName)?.elements;

	if (!mfe) throw new Error(`Filter ${filterName} does not exist`);

	const svgDoc = document.implementation.createDocument(Namespaces.svg, "");
	const svgElement = svgDoc.appendChild(document.createElementNS(Namespaces.svg, "svg"));

	if (includeMFMeta) svgElement.setAttributeNS(Namespaces.xmlns, "xmlns:m", Namespaces.svgmf1);

	const defsElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "defs"));
	// const defsMFElement = includeMFMeta ? defsElement.appendChild(document.createElementNS(Namespaces.svgmf1, "instances")) : undefined;
	const filterElement = defsElement.appendChild(document.createElementNS(Namespaces.svg, "filter"));

	filterElement.setAttribute("id", filterName);

	const domElements: Element[][] = mfe.map<Element[]>(fe => {
		const filterDef = getFilterById(fe.appuid);
		if (!filterDef) return [];
		return Array.from(new MFilter(filterDef).fillTemplate(fe, includeMFMeta).children);
	});

	filterElement.append(...domElements.flat(1));
	if (includeMFMeta) {
		annotate(doc, filterName, svgDoc);
	}

	return svgDoc;
}